# Firebase Setup Guide

## Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project

## Configuration Steps

1. **Create a `.env.local` file** in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. **Get your Firebase config:**
   - Go to Firebase Console > Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the Web app icon (</>) or add a new web app
   - Copy the config values to your `.env.local` file

## Firestore Database Structure

Create a collection named `recipes` with the following document structure:

```typescript
{
  title: string;
  categories: string[];  // Array of categories (e.g., ["Main Course", "Quick"])
  time: string;          // e.g., "30 min"
  servings?: string;    // e.g., "4 servings"
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  fancy?: boolean;
  quick?: boolean;
  cheap?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

## Available Functions

### `getRecipeById(id: string)`
Get a single recipe by its document ID.

### `getAllRecipes()`
Get all recipes from the database.

### `getRecipesByCategory(category: string)`
Get all recipes that include the specified category in their categories array.

### `getRecipesByFilters(filters: { fancy?, quick?, cheap? })`
Get recipes filtered by fancy, quick, or cheap flags.

## Example Usage

```typescript
import { getRecipeById, getAllRecipes, getRecipesByCategory } from '@/lib/firebaseRecipes';

// Get a single recipe
const recipe = await getRecipeById('recipe-id-123');

// Get all recipes
const allRecipes = await getAllRecipes();

// Get recipes by category
const mainCourses = await getRecipesByCategory('Main Course');
```

