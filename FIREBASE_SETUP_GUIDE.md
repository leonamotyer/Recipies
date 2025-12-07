# Firebase Setup Guide - Step by Step

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Leona's Recipes")
4. Click **Continue**
5. (Optional) Disable Google Analytics if you don't need it, or enable it
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

## Step 2: Enable Firestore Database

1. In your Firebase project, click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development) or **"Start in production mode"** (for production)
   - **Test mode** allows read/write for 30 days, then you'll need to set up security rules
   - **Production mode** requires security rules from the start
4. Select a location for your database (choose the closest to your users)
5. Click **"Enable"**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to the **"Your apps"** section
4. If you don't have a web app yet:
   - Click the **Web icon** (`</>`)
   - Register your app with a nickname (e.g., "Leona's Recipes Web")
   - Click **"Register app"**
5. You'll see your Firebase configuration object. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Create .env.local File

1. In your project root directory, create a file named `.env.local`
2. Copy the template below and fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Replace each value with the corresponding value from your Firebase config:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = `apiKey` from Firebase config
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `authDomain` from Firebase config
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `projectId` from Firebase config
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `storageBucket` from Firebase config
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `messagingSenderId` from Firebase config
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = `appId` from Firebase config

## Step 5: Restart Your Development Server

After creating/updating `.env.local`:
1. Stop your development server (Ctrl+C)
2. Start it again with `npm run dev`
3. Environment variables are loaded when the server starts

## Step 6: Create Your Recipes Collection

1. In Firebase Console, go to **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `recipes`
4. Click **"Next"**
5. Add your first recipe document:
   - Document ID: Click "Auto-ID" to generate one, or enter a custom ID
   - Add fields:
     - `title` (string): "Classic Chocolate Chip Cookies"
     - `categories` (array): ["Dessert", "Quick"]
     - `time` (string): "30 min"
     - `servings` (string): "24 cookies"
     - `description` (string): "The perfect classic chocolate chip cookie recipe..."
     - `ingredients` (array): ["2 1/4 cups all-purpose flour", "1 tsp baking soda", ...]
     - `instructions` (array): ["Preheat oven to 375°F", "Mix flour...", ...]
     - `fancy` (boolean): false
     - `quick` (boolean): true
     - `cheap` (boolean): true
6. Click **"Save"**

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that your `.env.local` file exists and has the correct values
- Make sure you restarted your dev server after creating `.env.local`
- Verify the API key in Firebase Console matches what's in your `.env.local`

### "Missing or insufficient permissions"
- Go to Firestore Database > Rules
- For development, you can temporarily use:
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
- **⚠️ WARNING:** This allows anyone to read/write. Only use for development!

### Environment variables not loading
- Make sure the file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
- Make sure all variables start with `NEXT_PUBLIC_`
- Restart your development server

## Security Rules (Production)

For production, set up proper security rules in Firestore:
1. Go to Firestore Database > Rules
2. Update rules to restrict access appropriately
3. Example (read-only for public):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      allow read: if true;
      allow write: if false; // Only allow writes from admin/authenticated users
    }
  }
}
```

