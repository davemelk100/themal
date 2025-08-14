# Authentication Service Setup Guide

This guide will help you set up the complete passwordless authentication system with Neon database integration for saving user settings.

## 🚀 What You Get

- **Passwordless Authentication**: Users sign in with just their email
- **Magic Link System**: Secure, time-limited login links
- **Automatic Settings Sync**: All user preferences saved to database
- **Cross-Device Access**: Settings sync across all devices
- **Secure JWT Tokens**: Protected API endpoints

## 📋 Prerequisites

1. **Neon Database**: Set up as per `DATABASE_SETUP.md`
2. **Netlify Account**: For hosting and serverless functions
3. **Environment Variables**: Configured in Netlify dashboard

## 🔧 Step-by-Step Setup

### 1. Environment Variables

Add these to your Netlify environment variables:

```bash
# Neon Database
DATABASE_URL=postgresql://neondb_owner:npg_VEnMjce7AR9L@ep-long-field-ae2y9fkr-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret
JWT_SECRET=eb304ecdc116ef6d5d50e8fe178ec8d7263bcfa0df2c069605fd3fe434db682d1f26e55af19e31a2d941e0d0a45d77cf6984ce8224d387aa047746db7447a18c

# Base URL (Netlify will set this automatically)
URL=https://your-app.netlify.app
```

### 2. Database Migration

Run the database migration to create the new tables:

```bash
npm run db:push
```

This creates:
- `users` table for user accounts
- `magic_links` table for authentication tokens
- `user_settings` table for user preferences
- `rss_feeds` table for user's RSS subscriptions

### 3. Deploy to Netlify

Push your code to trigger a new deployment:

```bash
git add .
git commit -m "Add passwordless authentication system"
git push
```

## 🔐 How It Works

### User Flow

1. **Sign In**: User enters email address
2. **Magic Link Sent**: Email with secure login link
3. **Click Link**: User clicks link in email
4. **Auto Sign In**: User is authenticated and redirected
5. **Settings Sync**: All preferences automatically saved

### Settings That Get Saved

- **Theme**: Light/dark mode preference
- **View Mode**: Grid/list view preference
- **Active Category**: Currently selected news category
- **Custom Feeds**: User's RSS feed subscriptions
- **Preferences**: Any other app settings

## 🎯 Integration Points

### 1. Add Auth Header to NewsAggregator

Add the authentication header to your news aggregator:

```tsx
import { AuthHeader } from '../components/AuthHeader';

// Add this near the top of your NewsAggregator component
<AuthHeader />
```

### 2. Sync Settings Changes

Use the `useSettingsSync` hook to automatically save settings:

```tsx
import { useSettingsSync } from '../hooks/useSettingsSync';

const { syncViewMode, syncActiveCategory, syncCustomFeeds } = useSettingsSync();

// When view mode changes
const handleViewModeChange = (mode: 'grid' | 'list') => {
  setViewMode(mode);
  syncViewMode(mode); // This saves to database
};
```

### 3. Load User Settings

Settings are automatically loaded when users sign in:

```tsx
const { settings, isAuthenticated } = useAuth();

// Use settings if available, fallback to defaults
const currentViewMode = settings?.viewMode || 'grid';
const currentTheme = settings?.theme || 'light';
```

## 📧 Email Configuration

### Development Mode

In development, emails are logged to console. You'll see:
```
📧 Email would be sent: {
  to: "user@example.com",
  subject: "Your Magic Link - News Aggregator",
  html: "<div>...</div>"
}
```

### Production Mode

For production, integrate with an email service:

1. **SendGrid** (recommended)
2. **Mailgun**
3. **AWS SES**

Update `src/services/emailService.ts` with your email service credentials.

## 🔒 Security Features

- **JWT Tokens**: 7-day expiration
- **Magic Links**: 15-minute expiration
- **One-time Use**: Links can only be used once
- **HTTPS Only**: All connections use SSL
- **Email Verification**: Users must click email link

## 🧪 Testing

### 1. Local Testing

```bash
npm run dev
```

1. Go to `/news` page
2. Click "Sign In to Save Settings"
3. Enter your email
4. Check console for magic link
5. Click the link to verify

### 2. Production Testing

1. Deploy to Netlify
2. Test the complete flow
3. Verify settings are saved
4. Test cross-device sync

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in Netlify environment variables
   - Verify Neon database is running

2. **Magic Link Not Working**
   - Check email service configuration
   - Verify `URL` environment variable is set

3. **Settings Not Saving**
   - Check user authentication status
   - Verify JWT token is valid
   - Check browser console for errors

### Debug Mode

Enable verbose logging in `drizzle.config.ts`:

```typescript
verbose: true,
```

## 📱 User Experience

### Benefits

- **No Passwords**: Users never forget login credentials
- **Instant Access**: One-click sign in from email
- **Auto-Save**: Settings saved automatically
- **Cross-Device**: Same settings everywhere
- **Secure**: Industry-standard security practices

### User Onboarding

1. **First Visit**: "Sign In to Save Settings" button
2. **Email Entry**: Simple email input form
3. **Magic Link**: Clear instructions in email
4. **Auto-Sync**: Settings automatically loaded
5. **Profile Access**: View and manage settings

## 🎉 Next Steps

1. **Test the complete flow**
2. **Customize email templates**
3. **Add user profile management**
4. **Implement settings import/export**
5. **Add social login options**

## 📞 Support

- Check browser console for errors
- Verify environment variables
- Test database connection
- Review Netlify function logs

Your authentication system is now ready to provide a seamless, secure experience for your users! 🚀
