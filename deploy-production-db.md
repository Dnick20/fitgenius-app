# 🚀 Production Database Deployment Guide

## Option 1: Railway (Recommended - Free Tier)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"

### Step 2: Get Database URL
1. Click on your PostgreSQL service
2. Go to "Connect" tab
3. Copy the "Postgres Connection URL"
4. It looks like: `postgresql://postgres:password@hostname:5432/railway`

### Step 3: Deploy PostgREST on Railway
1. Click "New Project" → "Deploy from GitHub repo"
2. Create a new GitHub repo with this content:

**Dockerfile:**
```dockerfile
FROM postgrest/postgrest:latest
COPY postgrest.conf /etc/postgrest.conf
CMD ["postgrest", "/etc/postgrest.conf"]
```

**postgrest.conf:**
```ini
db-uri = "${DATABASE_URL}"
db-schema = "api"
db-anon-role = "web_anon"
jwt-secret = "${JWT_SECRET}"
server-port = 3000
server-cors-allowed-origins = "*"
```

### Step 4: Initialize Database Schema
Run this command with your Railway PostgreSQL URL:

```bash
psql "your-railway-postgres-url" -f database/init.sql
```

## Option 2: Neon (Serverless PostgreSQL)

### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up (free tier: 500MB)
3. Create new project

### Step 2: Get Connection String
1. Copy the connection string from dashboard
2. Format: `postgresql://user:pass@hostname/dbname?sslmode=require`

## Option 3: Supabase (Easiest)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up and create new project
3. Use their PostgreSQL + PostgREST automatically

### Step 2: Run Schema
1. Go to SQL Editor in Supabase dashboard
2. Paste the contents of `database/init.sql`
3. Run the query

## Recommended: Railway Setup (5 minutes)

Since you already have everything working locally, Railway is the fastest deployment option.

### Quick Railway Deploy:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new
railway add postgresql
railway deploy
```

Your production URLs will be:
- **Database**: `postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway`
- **PostgREST**: `https://your-app-xxx.up.railway.app`