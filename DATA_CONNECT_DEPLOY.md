# Deploying Firebase Data Connect Service

## The Problem
You're getting a 404 error because the Data Connect service hasn't been deployed yet, or the endpoint URL is incorrect.

## Step 1: Deploy Your Data Connect Service

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **leonasrecipes-6f85a**
3. Click on **Data Connect** in the left sidebar
4. Click on your service: **leonasrecipes-6f85a-service**
5. You should see tabs: **Schema**, **Operations**, **Data**, **Monitoring**
6. Look for a **"Deploy"** or **"Publish"** button (usually at the top right)
7. Click **"Deploy"** or **"Publish"**
8. Wait for deployment to complete (this can take a few minutes)

## Step 2: Get the Correct Endpoint URL

After deployment:

1. In Data Connect > Service, go to the **Settings** tab (or look for endpoint info)
2. Find the **GraphQL endpoint URL**
3. It might be in one of these formats:
   - `https://data-connect-{location}-{project-id}.cloudfunctions.net/graphql`
   - Or a different format depending on your setup

## Step 3: Alternative - Check Operations Tab

1. Go to **Operations** tab in Data Connect
2. Look for any deployed operations or endpoints
3. The endpoint URL should be displayed there

## Step 4: Update .env.local

Once you have the correct endpoint, add it to your `.env.local`:

```env
NEXT_PUBLIC_DATA_CONNECT_ENDPOINT=your_actual_endpoint_url_here
```

## Step 5: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## If You Can't Find the Endpoint

If the endpoint isn't showing up, the service might need to be:
1. **Deployed** - Make sure you clicked Deploy/Publish
2. **Configured** - Check that your schema is valid
3. **Enabled** - Some regions require enabling Data Connect API

## Alternative: Use Realtime Database Instead

Since you already have data in Realtime Database, we could also:
1. Switch to using Realtime Database (simpler, no deployment needed)
2. Or migrate your Realtime Database data to Data Connect

Let me know which approach you'd prefer!

