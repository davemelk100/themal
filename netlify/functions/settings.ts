import { Handler } from "@netlify/functions";
import { SettingsService } from "../../src/services/settingsService";
import { verifyToken } from "../../src/lib/auth";

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Verify authentication
    const token = event.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return {
        statusCode: 401,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "No token provided" }),
      };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return {
        statusCode: 401,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    const { action, ...data } = JSON.parse(event.body || "{}");

    switch (action) {
      case "getSettings":
        const settings = await SettingsService.getUserSettings(payload.email);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        };

      case "updateSettings":
        const updatedSettings = await SettingsService.updateUserSettings(
          payload.email,
          data
        );
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSettings),
        };

      case "saveTheme":
        await SettingsService.saveTheme(payload.email, data.theme);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ success: true, message: "Theme saved" }),
        };

      case "saveViewMode":
        await SettingsService.saveViewMode(payload.email, data.viewMode);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ success: true, message: "View mode saved" }),
        };

      case "saveCustomFeeds":
        await SettingsService.saveCustomFeeds(payload.email, data.feeds);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            success: true,
            message: "Custom feeds saved",
          }),
        };

      case "saveActiveCategory":
        await SettingsService.saveActiveCategory(payload.email, data.category);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            success: true,
            message: "Active category saved",
          }),
        };

      default:
        return {
          statusCode: 400,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Invalid action" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
    };
  }
};
