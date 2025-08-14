import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/xml",
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
    const { url } = event.queryStringParameters || {};

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "URL parameter is required" }),
      };
    }

    console.log(`Fetching RSS feed from: ${url}`);

    // Fetch the RSS feed
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS-Reader/1.0)",
        Accept:
          "application/xml, text/xml, application/rss+xml, application/atom+xml, text/plain",
      },
      // Add timeout
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlContent = await response.text();

    // Validate that we got XML content
    if (
      !xmlContent.includes("<?xml") &&
      !xmlContent.includes("<rss") &&
      !xmlContent.includes("<feed")
    ) {
      throw new Error("Response does not appear to be valid XML/RSS content");
    }

    console.log(`Successfully fetched RSS feed, length: ${xmlContent.length}`);

    return {
      statusCode: 200,
      headers,
      body: xmlContent,
    };
  } catch (error) {
    console.error("Error fetching RSS feed:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch RSS feed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
