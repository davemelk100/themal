// Storage utility for persisting data locally and in production
// Supports localStorage, sessionStorage, and potential future backends

export interface StorageBackend {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}

class LocalStorageBackend implements StorageBackend {
  get(key: string): string | null {
    try {
      const value = localStorage.getItem(key);
      console.log(`LocalStorage get ${key}:`, value);
      return value;
    } catch (error) {
      console.warn("localStorage access failed:", error);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      console.log(`LocalStorage set ${key}:`, value);
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      throw error;
    }
  }

  remove(key: string): void {
    try {
      console.log(`LocalStorage remove ${key}`);
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error);
    }
  }

  clear(): void {
    try {
      console.log("LocalStorage clear");
      localStorage.clear();
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }
}

class SessionStorageBackend implements StorageBackend {
  get(key: string): string | null {
    try {
      const value = sessionStorage.getItem(key);
      console.log(`SessionStorage get ${key}:`, value);
      return value;
    } catch (error) {
      console.warn("sessionStorage access failed:", error);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      console.log(`SessionStorage set ${key}:`, value);
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to save to sessionStorage:", error);
      throw error;
    }
  }

  remove(key: string): void {
    try {
      console.log(`SessionStorage remove ${key}`);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove from sessionStorage:", error);
    }
  }

  clear(): void {
    try {
      console.log("SessionStorage clear");
      sessionStorage.clear();
    } catch (error) {
      console.warn("Failed to clear sessionStorage:", error);
    }
  }
}

// Fallback storage using in-memory storage
class MemoryStorageBackend implements StorageBackend {
  private storage = new Map<string, string>();

  get(key: string): string | null {
    const value = this.storage.get(key) || null;
    console.log(`MemoryStorage get ${key}:`, value);
    return value;
  }

  set(key: string, value: string): void {
    console.log(`MemoryStorage set ${key}:`, value);
    this.storage.set(key, value);
  }

  remove(key: string): void {
    console.log(`MemoryStorage remove ${key}`);
    this.storage.delete(key);
  }

  clear(): void {
    console.log("MemoryStorage clear");
    this.storage.clear();
  }
}

// Storage manager that handles different backends and fallbacks
class StorageManager {
  private primaryBackend: StorageBackend;
  private fallbackBackend: StorageBackend;
  private isAvailable: boolean = true;

  constructor() {
    console.log("Initializing StorageManager...");
    // Try localStorage first, then sessionStorage, then memory
    if (this.testStorageAvailability("localStorage")) {
      console.log("Using localStorage as primary backend");
      this.primaryBackend = new LocalStorageBackend();
      this.fallbackBackend = new SessionStorageBackend();
    } else if (this.testStorageAvailability("sessionStorage")) {
      console.log("Using sessionStorage as primary backend");
      this.primaryBackend = new SessionStorageBackend();
      this.fallbackBackend = new MemoryStorageBackend();
    } else {
      console.log("Using memory storage as primary backend");
      this.primaryBackend = new MemoryStorageBackend();
      this.fallbackBackend = new MemoryStorageBackend();
      this.isAvailable = false;
    }
  }

  private testStorageAvailability(
    type: "localStorage" | "sessionStorage"
  ): boolean {
    try {
      const storage = window[type];
      const testKey = "__storage_test__";
      storage.setItem(testKey, "test");
      storage.removeItem(testKey);
      console.log(`${type} is available`);
      return true;
    } catch (error) {
      console.log(`${type} is not available:`, error);
      return false;
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    console.log(`StorageManager get ${key} with default:`, defaultValue);
    try {
      const value = this.primaryBackend.get(key);
      if (value === null) {
        console.log(`Primary storage returned null for ${key}, using default`);
        return defaultValue !== undefined ? defaultValue : null;
      }
      const parsed = JSON.parse(value);
      console.log(`StorageManager get ${key} result:`, parsed);
      return parsed;
    } catch (error) {
      console.warn(`Failed to get ${key} from primary storage:`, error);
      try {
        const fallbackValue = this.fallbackBackend.get(key);
        if (fallbackValue === null) {
          console.log(
            `Fallback storage returned null for ${key}, using default`
          );
          return defaultValue !== undefined ? defaultValue : null;
        }
        const parsed = JSON.parse(fallbackValue);
        console.log(`StorageManager get ${key} from fallback:`, parsed);
        return parsed;
      } catch (fallbackError) {
        console.error(
          `Failed to get ${key} from fallback storage:`,
          fallbackError
        );
        return defaultValue !== undefined ? defaultValue : null;
      }
    }
  }

  set<T>(key: string, value: T): void {
    console.log(`StorageManager set ${key}:`, value);
    try {
      const serializedValue = JSON.stringify(value);
      this.primaryBackend.set(key, serializedValue);
      // Also save to fallback for redundancy
      this.fallbackBackend.set(key, serializedValue);
      console.log(`StorageManager set ${key} successful`);
    } catch (error) {
      console.error(`Failed to save ${key} to storage:`, error);
      throw error;
    }
  }

  remove(key: string): void {
    console.log(`StorageManager remove ${key}`);
    this.primaryBackend.remove(key);
    this.fallbackBackend.remove(key);
  }

  clear(): void {
    console.log("StorageManager clear");
    this.primaryBackend.clear();
    this.fallbackBackend.clear();
  }

  getStorageAvailability(): boolean {
    return this.isAvailable;
  }

  // Export data for backup/transfer
  exportData(): Record<string, any> {
    const data: Record<string, any> = {};
    try {
      if (this.primaryBackend instanceof LocalStorageBackend) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            if (value) {
              try {
                data[key] = JSON.parse(value);
              } catch {
                data[key] = value;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to export data:", error);
    }
    return data;
  }

  // Import data from backup
  importData(data: Record<string, any>): void {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
    } catch (error) {
      console.error("Failed to import data:", error);
      throw error;
    }
  }
}

// Create singleton instance
const storageManager = new StorageManager();

// Convenience functions
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null =>
    storageManager.get(key, defaultValue),

  set: <T>(key: string, value: T): void => storageManager.set(key, value),

  remove: (key: string): void => storageManager.remove(key),

  clear: (): void => storageManager.clear(),

  isAvailable: (): boolean => storageManager.getStorageAvailability(),

  export: (): Record<string, any> => storageManager.exportData(),

  import: (data: Record<string, any>): void => storageManager.importData(data),
};

// Storage keys for consistent usage across the app
export const STORAGE_KEYS = {
  WRITING_GALLERY_PIECES: "writingGalleryPieces",
  CONTENT_VISIBILITY: "contentVisibility",
  ADMIN_SESSION: "adminSession",
  MUSIC_PLAYER_SETTINGS: "musicPlayerSettings",
  THEME_PREFERENCES: "themePreferences",
  USER_PREFERENCES: "userPreferences",
} as const;

// Type-safe storage helpers
export const writingGalleryStorage = {
  getPieces: () => storage.get(STORAGE_KEYS.WRITING_GALLERY_PIECES, []),
  setPieces: (pieces: any[]) =>
    storage.set(STORAGE_KEYS.WRITING_GALLERY_PIECES, pieces),
  clearPieces: () => storage.remove(STORAGE_KEYS.WRITING_GALLERY_PIECES),
};

export const contentVisibilityStorage = {
  getSettings: () => storage.get(STORAGE_KEYS.CONTENT_VISIBILITY, {}),
  setSettings: (settings: any) =>
    storage.set(STORAGE_KEYS.CONTENT_VISIBILITY, settings),
  clearSettings: () => storage.remove(STORAGE_KEYS.CONTENT_VISIBILITY),
};

export const adminSessionStorage = {
  getSession: () => storage.get(STORAGE_KEYS.ADMIN_SESSION, null),
  setSession: (session: any) =>
    storage.set(STORAGE_KEYS.ADMIN_SESSION, session),
  clearSession: () => storage.remove(STORAGE_KEYS.ADMIN_SESSION),
};

export const musicPlayerStorage = {
  getSettings: () => storage.get(STORAGE_KEYS.MUSIC_PLAYER_SETTINGS, {}),
  setSettings: (settings: any) =>
    storage.set(STORAGE_KEYS.MUSIC_PLAYER_SETTINGS, settings),
  clearSettings: () => storage.remove(STORAGE_KEYS.MUSIC_PLAYER_SETTINGS),
};

export const themeStorage = {
  getPreferences: () => storage.get(STORAGE_KEYS.THEME_PREFERENCES, {}),
  setPreferences: (preferences: any) =>
    storage.set(STORAGE_KEYS.THEME_PREFERENCES, preferences),
  clearPreferences: () => storage.remove(STORAGE_KEYS.THEME_PREFERENCES),
};

export const userPreferencesStorage = {
  getPreferences: () => storage.get(STORAGE_KEYS.USER_PREFERENCES, {}),
  setPreferences: (preferences: any) =>
    storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences),
  clearPreferences: () => storage.remove(STORAGE_KEYS.USER_PREFERENCES),
};

export default storage;
