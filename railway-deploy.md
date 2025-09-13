# 🚀 Quick Railway Database Setup

## Step 1: Create Railway Account & Database
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the connection string (format: `postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway`)

## Step 2: Deploy PostgREST API
1. Create new GitHub repo: `fitgenius-api`
2. Add these files:

**Dockerfile:**
```dockerfile
FROM postgrest/postgrest:v12.0.2
COPY postgrest.conf /etc/postgrest.conf
EXPOSE 3000
CMD ["postgrest", "/etc/postgrest.conf"]
```

**postgrest.conf:**
```
db-uri = "${DATABASE_URL}"
db-schema = "api"
db-anon-role = "web_anon"
jwt-secret = "${JWT_SECRET}"
server-port = 3000
server-cors-allowed-origins = "*"
```

**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

3. Push to GitHub
4. In Railway: "New Project" → "Deploy from GitHub repo" → Select your `fitgenius-api` repo
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: `your-super-secret-jwt-key-change-in-production-minimum-256-bits`

## Step 3: Initialize Database Schema
```bash
# Replace with your Railway PostgreSQL URL
export DATABASE_URL="postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway"

# Run schema initialization
psql "$DATABASE_URL" -f database/init.sql
```

## Step 4: Update Vercel Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

- `DATABASE_URL`: Your Railway PostgreSQL URL
- `POSTGREST_URL`: Your Railway PostgREST URL (e.g., `https://fitgenius-api-production.up.railway.app`)
- `JWT_SECRET`: `your-super-secret-jwt-key-change-in-production-minimum-256-bits`
- `B2_APPLICATION_KEY_ID`: `0055791d364659800000000003`
- `B2_APPLICATION_KEY`: `K005fXaQ4F3PxMEtlsmHTwGCRBB0PS8`
- `B2_BUCKET_NAME`: `fitgenius-storage`

## Step 5: Redeploy Vercel
```bash
npx vercel --prod
```

## Alternative: Use Supabase (Even Easier!)
1. Go to https://supabase.com → Create new project
2. SQL Editor → Paste `database/init.sql` → Run
3. Settings → API → Copy URL and anon key
4. Use Supabase URL as your API endpoint (it includes PostgREST!)

Total setup time: 5-10 minutes! 🚀