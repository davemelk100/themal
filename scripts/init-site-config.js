#!/usr/bin/env node

/**
 * Script to initialize site configuration in the database
 * Run this after setting up the database schema
 */

import { SiteConfigService } from "../src/services/siteConfigService.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function initializeSiteConfig() {
  try {
    console.log("🚀 Initializing site configuration...");

    await SiteConfigService.initializeDefaultConfig();

    console.log("✅ Site configuration initialized successfully!");
    console.log("\nDefault configurations created:");
    console.log("- site_title: Main site title");
    console.log("- default_theme: Default theme for new users");
    console.log("- default_view_mode: Default view mode for new users");
    console.log("- default_category: Default active category for new users");
    console.log("- rss_feeds: Default RSS feeds configuration");
    console.log("- category_colors: Category color scheme configuration");

    console.log("\n🎉 You can now use the site configuration system!");
  } catch (error) {
    console.error("❌ Error initializing site configuration:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeSiteConfig();
