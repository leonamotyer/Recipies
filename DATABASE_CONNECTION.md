# Connecting to Firestore Database

## Step 1: Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **leonasrecipes-6f85a**
3. In the left sidebar, click on **"Firestore Database"**
4. If you see "Create database" button:
   - Click **"Create database"**
   - Choose **"Start in test mode"** (for development)
   - Select a location (choose closest to you)
   - Click **"Enable"**
5. Wait for Firestore to initialize (takes a few seconds)

## Step 2: Set Firestore Security Rules (Temporary for Development)

1. In Firestore Database, click on the **"Rules"** tab
2. Replace the rules with this (for development only):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

⚠️ **Warning:** These rules allow anyone to read/write. Only use for development!

## Step 3: Import Your Recipes

Once Firestore is enabled, run the import script:

```bash
npm run import-recipes
```

This will:
- Read your `recipies.json` file
- Transform the data to match the Firestore schema
- Import all recipes into the `recipes` collection
- Show progress as it imports each recipe

## What the Script Does

The import script transforms your JSON data:
- Converts `dish_category` array → `categories` array (capitalized)
- Converts `ingredients` object → `ingredients` array
- Converts `instructions` string → `instructions` array
- Sets `fancy`, `quick`, `cheap` flags based on categories
- Formats `cook_time_minutes` → `time` string
- Creates description from instructions

## Verify the Import

1. Go to Firebase Console > Firestore Database
2. You should see a `recipes` collection
3. Click on it to see all your imported recipes
4. Click on a recipe document to see its data

## Troubleshooting

### "Missing or insufficient permissions"
- Make sure you set the Firestore rules to allow read/write (see Step 2)
- Click "Publish" after updating rules

### "Firebase: Error (auth/invalid-api-key)"
- Make sure your `.env.local` file exists and has correct values
- Restart your terminal/command prompt after creating `.env.local`

### "Cannot find module 'dotenv'"
- Run: `npm install`

### Script runs but no data appears
- Check the console output for errors
- Verify Firestore is enabled in Firebase Console
- Check that the `recipies.json` file exists in the root directory

## Next Steps

After importing:
1. Your app should automatically load recipes from Firestore
2. Test by visiting your home page - you should see featured recipes
3. Visit `/recipes` to see all recipes
4. Test filtering by category, fancy, quick, or cheap

