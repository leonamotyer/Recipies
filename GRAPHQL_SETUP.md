# Firebase Data Connect GraphQL Setup

## Step 1: Get Your Data Connect Endpoint

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **leonasrecipes-6f85a**
3. Go to **Data Connect** in the left sidebar
4. Click on your service: **leonasrecipes-6f85a-service**
5. Go to the **Settings** tab
6. Find the **GraphQL endpoint URL**
7. It should look like: `https://data-connect-us-east4-leonasrecipes-6f85a.cloudfunctions.net/graphql`

## Step 2: Add Endpoint to .env.local

Add this line to your `.env.local` file:

```env
NEXT_PUBLIC_DATA_CONNECT_ENDPOINT=https://data-connect-us-east4-leonasrecipes-6f85a.cloudfunctions.net/graphql
```

Replace with your actual endpoint URL from Step 1.

## Step 3: Deploy Your Data Connect Service

If you haven't deployed your Data Connect service yet:

1. In Firebase Console > Data Connect > Service
2. Click **"Deploy"** or **"Publish"**
3. Wait for deployment to complete

## Step 4: Set Up Authentication (Optional)

If your Data Connect requires authentication:

1. Go to Firebase Console > Authentication
2. Enable authentication if needed
3. The GraphQL client will automatically include auth tokens

## Step 5: Test the Connection

Restart your dev server and test:

```bash
npm run dev
```

Visit your app - it should now load recipes from Firebase Data Connect using GraphQL!

## GraphQL Queries Available

The app uses these queries:

- `GET_ALL_RECIPES` - Gets all recipes with ingredients
- `GET_RECIPE_BY_ID` - Gets a single recipe by UUID
- `GET_RECIPES_BY_CATEGORY` - Filters recipes by category
- `GET_RECIPE_FULL` - Gets recipe with all related data (ingredients, images)

## Troubleshooting

### "Network error" or "Failed to fetch"
- Check that your Data Connect endpoint is correct in `.env.local`
- Make sure the service is deployed
- Verify the endpoint URL in Firebase Console

### "Authentication required"
- Your Data Connect service might require authentication
- Check Firebase Console > Data Connect > Service > Settings for auth requirements

### "Query not found" or "Field does not exist"
- The GraphQL schema might be different
- Check Firebase Console > Data Connect > Service > Schema
- Update the queries in `lib/graphql/queries.ts` to match your schema

### Queries return empty results
- Make sure you have data in your Data Connect database
- Check the Data tab in Firebase Console to see if recipes exist

