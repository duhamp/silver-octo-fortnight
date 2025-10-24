import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'mockup-db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

// This is a singleton promise for the database connection
let dbPromise: Promise<IDBPDatabase<unknown>> | null = null;

function initDB() : Promise<IDBPDatabase<unknown>> {
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
  return dbPromise;
}

export async function addImage(imageBlob: Blob): Promise<string> {
  const db = await initDB();
  // Using a simple unique key. For production, a better UUID might be used.
  const key = `${Date.now()}-${Math.random()}`;
  await db.put(STORE_NAME, imageBlob, key);
  return key;
}

export async function getImage(key: string): Promise<Blob | undefined> {
  const db = await initDB();
  return db.get(STORE_NAME, key);
}

export async function deleteImage(key: string): Promise<void> {
  const db = await initDB();
  await db.delete(STORE_NAME, key);
}
