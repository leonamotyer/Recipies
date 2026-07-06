/**
 * Migrate recipes into the /recipes/{id} structure.
 *
 * Sources (in priority order):
 *   1. Legacy recipes stored at the database root under numeric keys (0, 1, 2, ...)
 *   2. app/rec.json seed data (used for any recipe_id not already found)
 *
 * Each recipe is written to /recipes/{recipe_id} and given an
 * `image_folder` field linking it to its Firebase Storage folder
 * (recipe-images/{recipe_id}) so images can be uploaded per recipe.
 *
 * The migration is non-destructive by default: legacy root keys are left
 * in place. Pass --delete-old to remove them after a successful copy.
 *
 * Requirements:
 *   - .env with NEXT_PUBLIC_FIREBASE_URL (or NEXT_PUBLIC_FIREBASE_PROJECT_ID)
 *   - Service account key JSON, either via GOOGLE_APPLICATION_CREDENTIALS
 *     or a serviceAccountKey.json file in the repo root
 *     (Firebase console -> Project settings -> Service accounts -> Generate new private key)
 *
 * Run: npm run migrate           (copy only)
 *      npm run migrate -- --delete-old   (copy, then delete legacy root keys)
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, cert, applicationDefault, deleteApp, App, Credential } from 'firebase-admin/app';
import { getDatabase, Database } from 'firebase-admin/database';

const DELETE_OLD = process.argv.includes('--delete-old');

function getDatabaseURL(): string {
  let url = (process.env.NEXT_PUBLIC_FIREBASE_URL || '')
    .replace(/^["']|["']$/g, '')
    .replace(/\/+$/, '')
    .trim();
  if (url && !url.startsWith('http')) {
    url = 'https://' + url.replace(/^\/+/, '');
  }
  if (!url && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    url = `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;
  }
  if (!url) {
    throw new Error('Set NEXT_PUBLIC_FIREBASE_URL in your .env file');
  }
  return url;
}

function initAdmin(): { app: App; db: Database } {
  const localKeyPath = path.join(process.cwd(), 'serviceAccountKey.json');
  let credential: Credential;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credential = applicationDefault();
  } else if (fs.existsSync(localKeyPath)) {
    credential = cert(JSON.parse(fs.readFileSync(localKeyPath, 'utf-8')));
  } else {
    throw new Error(
      'No service account credentials found.\n' +
      'Either set GOOGLE_APPLICATION_CREDENTIALS to the key file path,\n' +
      'or place serviceAccountKey.json in the repo root.\n' +
      '(Firebase console -> Project settings -> Service accounts -> Generate new private key)'
    );
  }

  const app = initializeApp({ credential, databaseURL: getDatabaseURL() });
  return { app, db: getDatabase(app) };
}

interface RawRecipe {
  recipe_id?: number;
  title?: string;
  cook_time_minutes?: number | null;
  ingredients?: Record<string, string>;
  instructions?: string;
  dish_category?: string[];
  tags?: string[];
  image_urls?: unknown[];
  image_id?: string;
  [key: string]: unknown;
}

function isRecipe(item: unknown): item is RawRecipe {
  return (
    !!item &&
    typeof item === 'object' &&
    ('title' in item || 'cook_time_minutes' in item)
  );
}

function toRecipeNode(raw: RawRecipe, id: string) {
  // Copy everything, normalize nulls (RTDB drops null values anyway)
  const node: Record<string, unknown> = { ...raw };
  node.recipe_id = Number(id);
  node.image_folder = `recipe-images/${id}`;
  if (node.cook_time_minutes === null || node.cook_time_minutes === undefined) {
    node.cook_time_minutes = 0;
  }
  return node;
}

async function main() {
  const { app, db } = initAdmin();

  // 1. Collect legacy recipes from the database root
  const rootSnapshot = await db.ref('/').get();
  const rootData: Record<string, unknown> = rootSnapshot.exists() ? rootSnapshot.val() : {};

  const legacyKeys: string[] = [];
  const recipesById = new Map<string, RawRecipe>();

  for (const [key, item] of Object.entries(rootData)) {
    if (key === 'recipes' || !isRecipe(item)) continue;
    legacyKeys.push(key);
    const id = item.recipe_id !== undefined ? String(item.recipe_id) : key;
    recipesById.set(id, item);
  }
  console.log(`Found ${recipesById.size} legacy recipe(s) at database root.`);

  // 2. Fill gaps from rec.json seed data
  const recJsonPath = path.join(process.cwd(), 'app', 'rec.json');
  if (fs.existsSync(recJsonPath)) {
    const seed: RawRecipe[] = JSON.parse(fs.readFileSync(recJsonPath, 'utf-8'));
    let added = 0;
    for (const item of seed) {
      if (!isRecipe(item) || item.recipe_id === undefined) continue;
      const id = String(item.recipe_id);
      if (!recipesById.has(id)) {
        recipesById.set(id, item);
        added++;
      }
    }
    console.log(`Added ${added} recipe(s) from app/rec.json seed data.`);
  }

  // 3. Skip recipes already present under /recipes (do not clobber edits)
  const existingSnapshot = await db.ref('recipes').get();
  const existing: Record<string, unknown> = existingSnapshot.exists() ? existingSnapshot.val() : {};

  const updates: Record<string, unknown> = {};
  let skipped = 0;
  for (const [id, raw] of recipesById) {
    if (existing[id]) {
      skipped++;
      continue;
    }
    updates[id] = toRecipeNode(raw, id);
  }

  if (skipped > 0) {
    console.log(`Skipped ${skipped} recipe(s) already present under /recipes.`);
  }

  if (Object.keys(updates).length === 0) {
    console.log('Nothing to migrate.');
  } else {
    await db.ref('recipes').update(updates);
    console.log(`Wrote ${Object.keys(updates).length} recipe(s) to /recipes.`);
  }

  // 4. Optionally delete legacy root keys
  if (DELETE_OLD && legacyKeys.length > 0) {
    const deletions: Record<string, null> = {};
    for (const key of legacyKeys) {
      deletions[key] = null;
    }
    await db.ref('/').update(deletions);
    console.log(`Deleted ${legacyKeys.length} legacy root key(s).`);
  } else if (legacyKeys.length > 0) {
    console.log(`Legacy root keys left in place. Re-run with --delete-old to remove them.`);
  }

  await deleteApp(app);
  console.log('Done.');
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
