# Deployment Guide - IGR Payment Portal

## ⚠️ CRITICAL SECURITY WARNING

**This application is a DEMO/PROTOTYPE. Before production use, you MUST:**

1. ✅ Read `SECURITY.md` for complete security requirements
2. ✅ Delete all demo accounts (or reset with strong passwords)
3. ✅ Integrate real payment gateway (currently mock)
4. ✅ Add session security hardening
5. ✅ Conduct security audit and penetration testing

**Security Status:**
- ✅ Password hashing implemented (bcrypt)
- ⚠️ Demo accounts exist with known usernames
- ⚠️ Mock payment processing only
- ⚠️ Session security needs hardening

See `SECURITY.md` for detailed security requirements.

---

This guide explains how to deploy the IGR Payment Portal to Vercel for development/testing purposes.

## Prerequisites

- A Vercel account (https://vercel.com)
- A GitHub/GitLab account
- This project pushed to a git repository

## Database Setup

The application uses PostgreSQL in production. You have two options:

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Connect Database** → **Postgres** → **Continue**
4. Name your database (e.g., `igr-portal-db`)
5. Select a region close to your deployment region
6. Click **Create**

Vercel automatically adds these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Option 2: External PostgreSQL Provider

Use any PostgreSQL provider (Neon, Supabase, Railway, etc.):

1. Create a PostgreSQL database with your provider
2. Get the connection string
3. Add it as `DATABASE_URL` environment variable in Vercel

## Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/client`

### 3. Configure Environment Variables

Add the following environment variables in Vercel project settings:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (auto-added if using Vercel Postgres)
- `SESSION_SECRET` - Random secret key for sessions (generate with `openssl rand -base64 32`)

**Optional:**
- `NODE_ENV` - Set to `production` (usually auto-set by Vercel)

### 4. Deploy

Click **Deploy** and wait for the build to complete.

### 5. Run Database Migrations

After first deployment, you need to set up the database schema:

**Option A: Using Vercel CLI** (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables locally
vercel env pull .env

# Push database schema
npm run db:push

# Seed the database with demo data
npm run db:seed
```

**Option B: Using Vercel Dashboard**
1. Go to your project in Vercel dashboard
2. Navigate to **Storage** → **Data** → **Query**
3. Run the SQL commands from the migration files in `migrations/` directory

## Database Seeding

The application includes demo users, taxpayers, categories, and payment configurations.

To seed the production database:

```bash
# Make sure you have DATABASE_URL set (from vercel env pull)
npm run db:seed
```

**Demo Accounts (after seeding):**
The seed script creates several demo user accounts for testing. Passwords are bcrypt-hashed in the database.

**Testing Credentials:** See `DEMO_CREDENTIALS.md` for account usernames and passwords.

**IMPORTANT**: Delete these demo accounts and create secure admin accounts before production use. See `SECURITY.md`.

## Vercel Configuration

The `vercel.json` file configures:
- API route rewrites (`/api/*` → Express server)
- Client-side routing support (SPA mode)
- Static asset serving

## Environment-Specific Behavior

The application automatically detects the environment:

**Local Development (Replit/localhost):**
- Uses in-memory storage if `DATABASE_URL` is not set
- Runs on port 5000
- Includes Vite dev server with HMR

**Production (Vercel):**
- Requires `DATABASE_URL` to be set
- Uses serverless functions for API routes
- Serves pre-built static assets

## Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
**Solution**: Run `npm run check` locally to fix type errors before deploying

### Database Connection Errors

**Issue**: `DATABASE_URL must be set in production`
**Solution**: Ensure database is connected and `DATABASE_URL` environment variable is set

### API Routes Return 404

**Issue**: API endpoints not working
**Solution**: Check `vercel.json` rewrites are correct. All API routes must start with `/api/`

### Session Errors

**Issue**: "Session secret not configured"
**Solution**: Add `SESSION_SECRET` environment variable

### Database Schema Missing

**Issue**: Errors about missing tables
**Solution**: Run `npm run db:push` to create database schema

## Post-Deployment

After successful deployment:

1. **Verify deployment**: Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. **Test login**: Try logging in with demo accounts
3. **Create taxpayers**: Test creating new taxpayers and invoices
4. **Test payments**: Complete a mock payment flow
5. **Check reports**: View dashboard and reports

## Custom Domain (Optional)

To add a custom domain:

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## Monitoring

Vercel provides:
- **Analytics**: Track page views and performance
- **Logs**: View function logs in real-time
- **Insights**: Monitor Core Web Vitals

Access these in your Vercel project dashboard.

## Updating the Application

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel automatically deploys on every push to the main branch.

## Security Recommendations

For production use:

1. **Change default passwords** - Update all demo account passwords
2. **Enable HTTPS** - Vercel provides this automatically
3. **Add authentication** - Implement proper password hashing (bcrypt)
4. **Set up real payment gateway** - Replace mock Remita with actual integration
5. **Add email notifications** - Set up email service for receipts and notifications
6. **Enable rate limiting** - Protect against abuse
7. **Add audit logging** - Track all system changes
8. **Regular backups** - Set up automated database backups

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Review Drizzle ORM docs: https://orm.drizzle.team
- Check Vercel Postgres docs: https://vercel.com/docs/storage/vercel-postgres
