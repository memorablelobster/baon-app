/** db.js — offline data for BAON using IndexedDB. MIT */

const DB_NAME = 'baon-db';

const DB_VERSION = 1;

/** Open the database (and create its stores on first run). */

function openDB() {

return new Promise((resolve, reject) => {

const req = indexedDB.open(DB_NAME, DB_VERSION);

req.onupgradeneeded = () => {

const db = req.result;

db.createObjectStore('settings', { keyPath: 'key' });

const store = db.createObjectStore('expenses', { keyPath: 'id' });

store.createIndex('by-date', 'date');

};

req.onsuccess = () => resolve(req.result);

req.onerror = () => reject(req.error);

});

}
/** Run one request in a transaction; resolve with its result. */

async function run(storeName, mode, fn) {

const db = await openDB();

return new Promise((resolve, reject) => {

const tx = db.transaction(storeName, mode);

const req = fn(tx.objectStore(storeName));

tx.oncomplete = () => resolve(req?.result);

tx.onerror = () => reject(tx.error);

});

}

/* ---------- settings (FR-01) ---------- */

export async function getSetting(key, fallback = null) {

const row = await run('settings', 'readonly', (s) => s.get(key));

return row ? row.value : fallback;

}

export const setSetting = (key, value) =>

run('settings', 'readwrite', (s) => s.put({ key, value }));