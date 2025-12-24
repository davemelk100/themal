import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = 8888;
let stripe;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover",
  });
} else {
  console.warn("⚠️  STRIPE_SECRET_KEY is not set. Checkout session creation will fail.");
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
      return res.status(500).json({ error: "Stripe secret key not configured locally" });
    }

    const lineItems = items.map((item) => {
      const productData = {
        name: item.price_data.product_data.name,
      };
      
      // Only include description if it's not empty
      if (item.price_data.product_data.description && item.price_data.product_data.description.trim() !== "") {
        productData.description = item.price_data.product_data.description;
      }
      
      // Only include images if they exist and are not empty
      // Convert relative URLs to absolute URLs for Stripe
      if (item.price_data.product_data.images && item.price_data.product_data.images.length > 0) {
        const origin = req.headers.origin || 'http://localhost:5173';
        productData.images = item.price_data.product_data.images
          .filter(img => img && img.trim() !== "")
          .map(img => {
            // Convert relative URLs to absolute
            if (img.startsWith('/')) {
              return `${origin}${img}`;
            } else if (!img.startsWith('http://') && !img.startsWith('https://')) {
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
    const origin = req.headers.origin || 'http://localhost:5173';
    const finalSuccessUrl = successUrl || `${origin}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${origin}/store/checkout`;
    
    console.log("Creating Stripe session with URLs:", {
      origin,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
      receivedSuccessUrl: successUrl,
      receivedCancelUrl: cancelUrl
    });
    
    // Validate URLs before sending to Stripe
    try {
      new URL(finalSuccessUrl);
      new URL(finalCancelUrl);
    } catch (urlError) {
      console.error("Invalid URL detected:", {
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl,
        error: urlError.message
      });
      return res.status(400).json({
        error: "Invalid URL format",
        details: {
          successUrl: finalSuccessUrl,
          cancelUrl: finalCancelUrl,
          error: urlError.message
        }
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
        cancel_url: finalCancelUrl
      });
      return res.status(500).json({
        error: stripeError.message || "Stripe API error",
        details: stripeError.param || stripeError.type
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// RSS feed creation endpoint
app.post("/create-rss-feed", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format",
      });
    }

    // Fetch the HTML content
    let response;
    let html;

    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RSSFeedCreator/1.0)",
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        return res.status(400).json({
          success: false,
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        });
      }

      html = await response.text();
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Unknown fetch error";
      return res.status(400).json({
        success: false,
        error: `Failed to fetch URL: ${errorMessage}`,
      });
    }

    // Simple HTML parsing for development
    const items = [];
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : "Custom RSS Feed";

    if (pageTitle && pageTitle.length > 5) {
      items.push({
        title: pageTitle,
        link: url,
        description: `Content from ${pageTitle}`,
        pubDate: new Date().toUTCString(),
        author: "Unknown",
        category: "Custom",
      });
    }

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "No parseable content found on this page. The site may use JavaScript to load content or have a different structure than expected.",
      });
    }

    // Generate simple RSS XML
    const siteUrl = new URL(url);
    const siteName = siteUrl.hostname.replace("www.", "");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName} - Custom RSS Feed</title>
    <link>${url}</link>
    <description>Custom RSS feed generated for ${siteName}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${url}" rel="self" type="application/rss+xml" />
    <item>
      <title><![CDATA[${items[0].title}]]></title>
      <link>${items[0].link}</link>
      <description><![CDATA[${items[0].description}]]></description>
      <pubDate>${items[0].pubDate}</pubDate>
      <author>${items[0].author}</author>
      <category>${items[0].category}</category>
      <guid isPermaLink="false">${items[0].link}</guid>
    </item>
  </channel>
</rss>`;

    res.json({
      success: true,
      rssXml,
      itemCount: items.length,
      note: "Created minimal RSS feed from page title only (development mode)",
    });
  } catch (error) {
    console.error("Error in RSS feed creation:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error: " + error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📡 RSS feed endpoint: http://localhost:${PORT}/create-rss-feed`);
});
