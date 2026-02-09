import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define users schema inline (matches src/db/schema.ts)
const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: boolean("email_verified").default(false),
  passwordHash: text("password_hash"),
  provider: text("provider"),
  providerId: text("provider_id"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = 8888;
let stripe;

// Database setup
let db;

async function initDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("⚠️  DATABASE_URL is not set. Auth functions will fail.");
      return false;
    }

    // Check if DATABASE_URL is still a placeholder
    if (
      process.env.DATABASE_URL.includes("user:password@host") ||
      process.env.DATABASE_URL ===
      "postgresql://user:password@host/database?sslmode=require"
    ) {
      console.error("❌ DATABASE_URL appears to be a placeholder value.");
      console.error(
        "Please update your .env file with a real Neon database connection string."
      );
      console.error("Run: npx neonctl@latest init");
      return false;
    }

    console.log("🔌 Attempting to connect to database...");
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema: { users } });

    // Test the connection by trying a simple query
    try {
      await db.select().from(users).limit(1);
      console.log("✅ Database initialized and connection verified");
      return true;
    } catch (testError) {
      console.error("❌ Database connection test failed:", testError.message);
      console.error("This might indicate:");
      console.error("  - Invalid DATABASE_URL");
      console.error("  - Database server is not accessible");
      console.error("  - Network/firewall issues");
      db = null;
      return false;
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack);
    }
    db = null;
    return false;
  }
}

// Initialize database on startup
initDatabase();

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover",
  });
} else {
  console.warn(
    "⚠️  STRIPE_SECRET_KEY is not set. Checkout session creation will fail."
  );
}

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Configure multer for Discogs uploads
const DISCOGS_UPLOAD_DIR = path.resolve(__dirname, "../public/uploads/discogs");
if (!fs.existsSync(DISCOGS_UPLOAD_DIR)) {
  fs.mkdirSync(DISCOGS_UPLOAD_DIR, { recursive: true });
}

const discogsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DISCOGS_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadDiscogs = multer({
  storage: discogsStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Development server running",
    timestamp: new Date().toISOString(),
  });
});

// create-checkout-session endpoint
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set in .env");
      return res
        .status(500)
        .json({ error: "Stripe secret key not configured locally" });
    }

    const lineItems = items.map((item) => {
      const productData = {
        name: item.price_data.product_data.name,
      };

      // Only include description if it's not empty
      if (
        item.price_data.product_data.description &&
        item.price_data.product_data.description.trim() !== ""
      ) {
        productData.description = item.price_data.product_data.description;
      }

      // Only include images if they exist and are not empty
      // Convert relative URLs to absolute URLs for Stripe
      if (
        item.price_data.product_data.images &&
        item.price_data.product_data.images.length > 0
      ) {
        const origin = req.headers.origin || "http://localhost:5173";
        productData.images = item.price_data.product_data.images
          .filter((img) => img && img.trim() !== "")
          .map((img) => {
            // Convert relative URLs to absolute
            if (img.startsWith("/")) {
              return `${origin}${img}`;
            } else if (
              !img.startsWith("http://") &&
              !img.startsWith("https://")
            ) {
              return `${origin}/${img}`;
            }
            return img;
          });
      }

      return {
        price_data: {
          currency: item.price_data.currency || "usd",
          product_data: productData,
          unit_amount: item.price_data.unit_amount,
        },
        quantity: item.quantity,
      };
    });

    // Build URLs with proper fallback
    const origin = req.headers.origin || "http://localhost:5173";
    const finalSuccessUrl =
      successUrl ||
      `${origin}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${origin}/store/checkout`;

    console.log("Creating Stripe session with URLs:", {
      origin,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
      receivedSuccessUrl: successUrl,
      receivedCancelUrl: cancelUrl,
    });

    // Validate URLs before sending to Stripe
    try {
      new URL(finalSuccessUrl);
      new URL(finalCancelUrl);
    } catch (urlError) {
      console.error("Invalid URL detected:", {
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl,
        error: urlError.message,
      });
      return res.status(400).json({
        error: "Invalid URL format",
        details: {
          successUrl: finalSuccessUrl,
          cancelUrl: finalCancelUrl,
          error: urlError.message,
        },
      });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: finalSuccessUrl,
        cancel_url: finalCancelUrl,
      });

      console.log("Stripe session created successfully:", session.id);

      res.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (stripeError) {
      console.error("Stripe API error:", {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        param: stripeError.param,
        success_url: finalSuccessUrl,
        cancel_url: finalCancelUrl,
      });
      return res.status(500).json({
        error: stripeError.message || "Stripe API error",
        details: stripeError.param || stripeError.type,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Auth login endpoint (Google OAuth)
// Note: Vite proxy rewrites /.netlify/functions/* to /*, so this route is /auth-login
app.get("/auth-login", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      // Redirect to Google OAuth
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        return res
          .status(500)
          .json({ error: "GOOGLE_CLIENT_ID not configured" });
      }

      const redirectUri =
        process.env.GOOGLE_REDIRECT_URI ||
        `http://localhost:5173/.netlify/functions/auth-login`;
      const scope = "openid email profile";
      const responseType = "code";

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=${responseType}&scope=${encodeURIComponent(
        scope
      )}&access_type=offline&prompt=consent`;

      return res.redirect(googleAuthUrl);
    }

    // Exchange code for token
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      `http://localhost:5173/.netlify/functions/auth-login`;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Google OAuth not configured" });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code.toString(),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info");
    }

    const userInfo = await userInfoResponse.json();
    const { id: providerId, email, name, picture } = userInfo;

    // Wait for database to be initialized
    if (!db) {
      console.log("⚠️ Database not initialized, attempting to initialize...");
      const initialized = await initDatabase();
      if (!initialized || !db) {
        console.error("❌ Database initialization failed");
        throw new Error(
          "Database not initialized. Please check DATABASE_URL environment variable."
        );
      }
      console.log("✅ Database initialized successfully");
    }

    // Find or create user
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          email,
          name: name || null,
          provider: "google",
          providerId,
          image: picture || null,
          emailVerified: true,
        })
        .returning()
        .then((rows) => rows[0]);
      user = newUser;
    } else {
      // Update existing user with OAuth info if needed
      if (!user.provider || user.provider !== "google") {
        await db
          .update(users)
          .set({
            provider: "google",
            providerId,
            image: picture || user.image,
            name: name || user.name,
            emailVerified: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
        user = {
          ...user,
          provider: "google",
          providerId,
          image: picture || user.image,
          name: name || user.name,
          emailVerified: true,
        };
      }
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Redirect to store with token
    const frontendUrl = process.env.URL || "http://localhost:5173";
    const redirectUrl = `${frontendUrl}/store/auth/callback?token=${token}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Auth error:", error);
    const frontendUrl = process.env.URL || "http://localhost:5173";
    return res.redirect(
      `${frontendUrl}/store/login?error=${encodeURIComponent(
        error.message || "Authentication failed"
      )}`
    );
  }
});

// Auth session endpoint (validate JWT token)
app.get("/auth-session", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Wait for database to be initialized
    if (!db || !users || !eq) {
      const initialized = await initDatabase();
      if (!initialized || !db || !users || !eq) {
        return res.status(500).json({
          error:
            "Database not initialized. Please check DATABASE_URL environment variable.",
        });
      }
    }

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Auth register endpoint (email/password registration)
app.post("/auth-register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Wait for database to be initialized
    if (!db || !users || !eq) {
      const initialized = await initDatabase();
      if (!initialized || !db || !users || !eq) {
        return res.status(500).json({
          error:
            "Database not initialized. Please check DATABASE_URL environment variable.",
        });
      }
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        name: name || null,
        passwordHash,
        provider: "email",
        emailVerified: false,
      })
      .returning()
      .then((rows) => rows[0]);

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Auth login email endpoint (email/password login)
app.post("/auth-login-email", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Wait for database to be initialized
    if (!db || !users || !eq) {
      const initialized = await initDatabase();
      if (!initialized || !db || !users || !eq) {
        return res.status(500).json({
          error:
            "Database not initialized. Please check DATABASE_URL environment variable.",
        });
      }
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user has a password (email/password auth)
    if (!user.passwordHash) {
      return res.status(401).json({
        error:
          "This account was created with Google. Please sign in with Google.",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Photo upload endpoint for /discogs
app.post("/upload-discogs", uploadDiscogs.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/discogs/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// List uploaded files for /discogs
app.get("/list-discogs", (req, res) => {
  try {
    if (!fs.existsSync(DISCOGS_UPLOAD_DIR)) {
      return res.json({ files: [] });
    }
    const files = fs.readdirSync(DISCOGS_UPLOAD_DIR).map((filename) => ({
      url: `/uploads/discogs/${filename}`,
      name: filename,
      type: path.extname(filename).toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)$/)
        ? "video"
        : "image",
    }));
    res.json({ files });
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(
    `🔐 Auth endpoint: http://localhost:${PORT}/auth-login (proxied from /.netlify/functions/auth-login)`
  );
  console.log(
    `🔐 Auth session: http://localhost:${PORT}/auth-session (proxied from /.netlify/functions/auth-session)`
  );
  console.log(
    `🔐 Auth register: http://localhost:${PORT}/auth-register (proxied from /.netlify/functions/auth-register)`
  );
  console.log(
    `🔐 Auth login email: http://localhost:${PORT}/auth-login-email (proxied from /.netlify/functions/auth-login-email)`
  );
});
