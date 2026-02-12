import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'nordlys';
const DB_VERSION = 1;
const STORE_NAME = 'api-cache';

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			}
		});
	}
	return dbPromise;
}

export async function getCached<T>(key: string, maxAgeMs: number): Promise<T | null> {
	try {
		const db = await getDb();
		const entry = await db.get(STORE_NAME, key);
		if (!entry) return null;
		const { data, timestamp } = entry as CacheEntry<T>;
		if (Date.now() - timestamp > maxAgeMs) return null;
		return data;
	} catch {
		return null;
	}
}

export async function setCache<T>(key: string, data: T): Promise<void> {
	try {
		const db = await getDb();
		const entry: CacheEntry<T> = { data, timestamp: Date.now() };
		await db.put(STORE_NAME, entry, key);
	} catch {
		// Silently fail — cache is non-critical
	}
}
