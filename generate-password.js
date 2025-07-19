import crypto from "crypto";

// Change this to your desired password
const password = "your_password_here";

// Generate the hash
const hash = crypto.createHash("sha256").update(password).digest("hex");

console.log("Generated hash for your password");
console.log("Hash:", hash);
console.log("\nAdd this to your .env.local file:");
console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`);
