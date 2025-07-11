import crypto from "crypto";

// You can change this password to whatever you want
const password = "admin123";

// Generate the hash
const hash = crypto.createHash("sha256").update(password).digest("hex");

console.log("Password:", password);
console.log("Hash:", hash);
console.log("\nAdd this to your .env.local file:");
console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`);
