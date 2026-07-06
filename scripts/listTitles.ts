import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, cert, deleteApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

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
  if (!url) throw new Error('Set NEXT_PUBLIC_FIREBASE_URL in .env');
  return url;
}

async function main() {
  const keyPath = path.join(process.cwd(), 'serviceAccountKey.json');
  const app = initializeApp({
    credential: cert(JSON.parse(fs.readFileSync(keyPath, 'utf-8'))),
    databaseURL: getDatabaseURL(),
  });
  const db = getDatabase(app);
  const snap = await db.ref('recipes').get();
  const data = snap.exists() ? snap.val() : {};
  const titles = Object.entries(data)
    .map(([id, r]: [string, any]) => `${id}\t${r?.title ?? '(no title)'}`)
    .sort((a, b) => Number(a.split('\t')[0]) - Number(b.split('\t')[0]));
  console.log(titles.join('\n'));
  console.log(`\nTOTAL: ${titles.length}`);
  await deleteApp(app);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
