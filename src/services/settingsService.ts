import { db } from '../db';
import { userSettings, users } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface UserSettings {
  theme: 'light' | 'dark';
  preferences: Record<string, any>;
}

export class SettingsService {
  // Get or create user settings
  static async getUserSettings(email: string): Promise<UserSettings> {
    try {
      // First, get the user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      // Get their settings
      const [settings] = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, user.id));

      if (!settings) {
        // Create default settings if none exist
        const [newSettings] = await db.insert(userSettings).values({
          userId: user.id,
          theme: 'light',
          preferences: {},
        }).returning();

        return {
          theme: newSettings.theme as 'light' | 'dark',
          preferences: newSettings.preferences as Record<string, any> || {},
        };
      }

      return {
        theme: settings.theme as 'light' | 'dark',
        preferences: settings.preferences as Record<string, any> || {},
      };
    } catch (error) {
      throw new Error('Failed to get user settings');
    }
  }

  // Update user settings
  static async updateUserSettings(email: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    try {
      // Get the user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      // Update their settings
      const [updatedSettings] = await db
        .update(userSettings)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, user.id))
        .returning();

      return {
        theme: updatedSettings.theme as 'light' | 'dark',
        preferences: updatedSettings.preferences as Record<string, any> || {},
      };
    } catch (error) {
      throw new Error('Failed to update user settings');
    }
  }

  // Save theme preference
  static async saveTheme(email: string, theme: 'light' | 'dark'): Promise<void> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      await db
        .update(userSettings)
        .set({
          theme,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, user.id));
    } catch (error) {
      throw new Error('Failed to save theme');
    }
  }
}
