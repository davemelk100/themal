# Neon Database Setup Guide

This guide will help you set up your Neon PostgreSQL database and integrate it with your news aggregator app.

## 1. Neon Dashboard Setup

### Create Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Choose a region close to your users
4. Set a project name and database name

### Get Connection String

1. In your project dashboard, go to "Connection Details"
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@hostname:port/database?sslmode=require
   ```

### Create User

1. Go to "Users" in your dashboard
2. Create a new user with appropriate permissions
3. Note down the username and password

## 2. Environment Variables

Add these to your Netlify environment variables:

```bash
# Neon Database
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Optional: Neon connection pool settings
NEON_POOL_MIN=1
NEON_POOL_MAX=10
```

## 3. Database Migration

Run the migration to create your tables:

```bash
# Push the schema to your database
npm run db:push

# Or run the generated migration
npm run db:migrate
```

## 4. Database Schema

Your database will have these tables:

- **users**: User authentication and profiles
- **user_settings**: User preferences and app settings
- **rss_feeds**: User's RSS feed subscriptions
- **news_items**: Cached news articles

## 5. Authentication Flow

1. **Register**: Users create accounts with email/password
2. **Login**: Users authenticate and receive JWT tokens
3. **Settings**: User preferences are stored and synced
4. **Feeds**: RSS feeds are associated with user accounts

## 6. API Endpoints

### Authentication

- `POST /.netlify/functions/auth` with action: "register" or "login"

### User Settings

- User settings are automatically created on registration
- Settings include theme, view mode, active category, and custom feeds

## 7. Security Features

- Passwords are hashed using bcrypt
- JWT tokens for session management
- Database connections use SSL
- User data is isolated by user ID

## 8. Development Commands

```bash
# Generate new migrations after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio to view/edit data
npm run db:studio

# Run migrations
npm run db:migrate
```

## 9. Production Considerations

- Set up connection pooling for better performance
- Monitor database usage and costs
- Set up automated backups
- Use environment-specific connection strings

## 10. Troubleshooting

### Common Issues

1. **Connection refused**: Check your DATABASE_URL and firewall settings
2. **SSL errors**: Ensure `sslmode=require` is in your connection string
3. **Permission denied**: Verify your database user has proper permissions

### Debug Mode

Enable verbose logging in drizzle.config.ts for debugging:

```typescript
verbose: true,
```

## 11. Next Steps

1. Test the authentication flow
2. Implement user settings persistence
3. Add RSS feed management
4. Set up user-specific news caching
5. Add user profile management

## Support

- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
