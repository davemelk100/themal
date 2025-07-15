// Migration utility to transition from old localStorage format to new storage system
import { storage, STORAGE_KEYS } from "./storage";

interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
}

export const migrateOldStorage = (): MigrationResult => {
  const result: MigrationResult = {
    success: true,
    migratedKeys: [],
    errors: [],
  };

  try {
    console.log("Starting storage migration...");

    // Check for old localStorage keys and migrate them
    const oldKeys = [
      "writingGalleryPieces",
      "contentVisibility",
      "adminAuthenticated",
      "adminAuthTime",
    ];

    oldKeys.forEach((oldKey) => {
      try {
        const oldValue = localStorage.getItem(oldKey);
        console.log(`Checking old key: ${oldKey}, value:`, oldValue);

        if (oldValue) {
          let parsedValue;
          try {
            parsedValue = JSON.parse(oldValue);
          } catch {
            // If it's not JSON, store as string
            parsedValue = oldValue;
          }

          // Map old keys to new storage keys
          let newKey = oldKey;
          if (oldKey === "writingGalleryPieces") {
            newKey = STORAGE_KEYS.WRITING_GALLERY_PIECES;
          } else if (oldKey === "contentVisibility") {
            newKey = STORAGE_KEYS.CONTENT_VISIBILITY;
          } else if (
            oldKey === "adminAuthenticated" ||
            oldKey === "adminAuthTime"
          ) {
            // Handle admin session migration
            if (oldKey === "adminAuthenticated") {
              const authTime = localStorage.getItem("adminAuthTime");
              if (authTime) {
                const session = {
                  isAuthenticated: oldValue === "true",
                  authTime: authTime,
                };
                storage.set(STORAGE_KEYS.ADMIN_SESSION, session);
                result.migratedKeys.push("adminSession");
                console.log("Migrated admin session:", session);
              }
            }
            return; // Skip individual admin keys as we handle them together
          }

          // Store in new storage system
          storage.set(newKey, parsedValue);
          result.migratedKeys.push(newKey);
          console.log(`Migrated ${oldKey} to ${newKey}:`, parsedValue);

          // Remove old key after successful migration
          localStorage.removeItem(oldKey);
        }
      } catch (error) {
        result.errors.push(`Failed to migrate ${oldKey}: ${error}`);
        result.success = false;
        console.error(`Migration error for ${oldKey}:`, error);
      }
    });

    // Special handling for admin session
    const adminAuth = localStorage.getItem("adminAuthenticated");
    const adminTime = localStorage.getItem("adminAuthTime");
    if (
      adminAuth &&
      adminTime &&
      !result.migratedKeys.includes("adminSession")
    ) {
      try {
        const session = {
          isAuthenticated: adminAuth === "true",
          authTime: adminTime,
        };
        storage.set(STORAGE_KEYS.ADMIN_SESSION, session);
        result.migratedKeys.push("adminSession");
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminAuthTime");
        console.log("Migrated admin session (special handling):", session);
      } catch (error) {
        result.errors.push(`Failed to migrate admin session: ${error}`);
        result.success = false;
        console.error("Admin session migration error:", error);
      }
    }
  } catch (error) {
    result.errors.push(`Migration failed: ${error}`);
    result.success = false;
    console.error("General migration error:", error);
  }

  console.log("Migration completed:", result);
  return result;
};

// Check if migration is needed
export const needsMigration = (): boolean => {
  const oldKeys = [
    "writingGalleryPieces",
    "contentVisibility",
    "adminAuthenticated",
    "adminAuthTime",
  ];
  const hasOldData = oldKeys.some((key) => localStorage.getItem(key) !== null);
  console.log(
    "Migration needed:",
    hasOldData,
    "Old keys found:",
    oldKeys.filter((key) => localStorage.getItem(key) !== null)
  );
  return hasOldData;
};

// Force migration function for manual use
export const forceMigration = (): MigrationResult => {
  console.log("Forcing storage migration...");
  return migrateOldStorage();
};

// Auto-migrate on import
if (typeof window !== "undefined") {
  console.log(
    "Storage migration module loaded, checking for migration needs..."
  );
  if (needsMigration()) {
    console.log("Detected old storage format, migrating...");
    const migrationResult = migrateOldStorage();
    if (migrationResult.success) {
      console.log("Migration successful:", migrationResult.migratedKeys);
    } else {
      console.error("Migration failed:", migrationResult.errors);
    }
  } else {
    console.log("No migration needed, storage is up to date");
  }
}
