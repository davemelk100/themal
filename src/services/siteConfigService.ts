import { db } from '../db';
import { siteConfig } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface SiteConfigValue {
  [key: string]: any;
}

export interface SiteConfigItem {
  id: string;
  key: string;
  value: SiteConfigValue;
  description?: string;
  isPublic: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class SiteConfigService {
  /**
   * Get a site configuration value by key
   */
  static async getConfig(key: string): Promise<SiteConfigValue | null> {
    try {
      const result = await db
        .select()
        .from(siteConfig)
        .where(eq(siteConfig.key, key))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      return result[0].value as SiteConfigValue;
    } catch (error) {
      console.error('Error getting site config:', error);
      return null;
    }
  }

  /**
   * Set a site configuration value
   */
  static async setConfig(
    key: string,
    value: SiteConfigValue,
    description?: string,
    isPublic: boolean = false
  ): Promise<boolean> {
    try {
      const existing = await db
        .select()
        .from(siteConfig)
        .where(eq(siteConfig.key, key))
        .limit(1);

      if (existing.length > 0) {
        // Update existing config
        await db
          .update(siteConfig)
          .set({
            value,
            description,
            isPublic,
            updatedAt: new Date(),
          })
          .where(eq(siteConfig.key, key));
      } else {
        // Create new config
        await db.insert(siteConfig).values({
          key,
          value,
          description,
          isPublic,
        });
      }

      return true;
    } catch (error) {
      console.error('Error setting site config:', error);
      return false;
    }
  }

  /**
   * Get all public site configurations
   */
  static async getPublicConfigs(): Promise<SiteConfigItem[]> {
    try {
      const result = await db
        .select()
        .from(siteConfig)
        .where(eq(siteConfig.isPublic, true));

      return result.map(item => ({
        id: item.id,
        key: item.key,
        value: item.value as SiteConfigValue,
        description: item.description || undefined,
        isPublic: item.isPublic || false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    } catch (error) {
      console.error('Error getting public site configs:', error);
      return [];
    }
  }

  /**
   * Delete a site configuration
   */
  static async deleteConfig(key: string): Promise<boolean> {
    try {
      await db
        .delete(siteConfig)
        .where(eq(siteConfig.key, key));

      return true;
    } catch (error) {
      console.error('Error deleting site config:', error);
      return false;
    }
  }

  /**
   * Initialize default site configuration
   */
  static async initializeDefaultConfig(): Promise<void> {
    const defaultConfigs = [
      {
        key: 'site_title',
        value: 'Dave Melkonian',
        description: 'Main site title',
        isPublic: true,
      },
      {
        key: 'default_theme',
        value: 'light',
        description: 'Default theme for new users',
        isPublic: true,
      },
    ];

    for (const config of defaultConfigs) {
      await this.setConfig(config.key, config.value as unknown as SiteConfigValue, config.description, config.isPublic);
    }
  }
}
