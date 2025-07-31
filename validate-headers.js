const fs = require("fs");
const path = require("path");

function validateHeadersFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    console.log("Validating _headers file...");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;

      // Skip empty lines and comments
      if (!line || line.startsWith("#")) {
        continue;
      }

      // Check for invalid patterns
      if (line.includes(" ")) {
        // This might be a header rule with multiple patterns, which is invalid
        console.error(
          `Line ${lineNumber}: Invalid pattern "${line}" - multiple patterns detected`
        );
        return false;
      }

      // Check if next line is a header (starts with space or tab)
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (nextLine.trim() && !nextLine.startsWith("#")) {
          // This should be a header value
          if (!nextLine.startsWith(" ") && !nextLine.startsWith("\t")) {
            console.error(
              `Line ${lineNumber}: Pattern "${line}" should be followed by header values`
            );
            return false;
          }
        }
      }
    }

    console.log("✅ _headers file is valid!");
    return true;
  } catch (error) {
    console.error("Error reading _headers file:", error.message);
    return false;
  }
}

const headersPath = path.join(__dirname, "public", "_headers");
validateHeadersFile(headersPath);
