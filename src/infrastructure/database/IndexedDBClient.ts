const DB_VERSION = 1;
const STORE_NAME = 'items';

/**
 * Low-level IndexedDB client
 * Handles database connection and basic operations
 * Each user gets their own isolated database
 */
export class IndexedDBClient {
  private db: IDBDatabase | null = null;
  private readonly dbName: string;

  constructor(userId: string) {
    this.dbName = `DataRoomDB-${userId}`;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, DB_VERSION);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('parentId', 'parentId', { unique: false });
          objectStore.createIndex('type', 'type', { unique: false });
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  getObjectStore(mode: IDBTransactionMode): { store: IDBObjectStore; transaction: IDBTransaction } {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    const transaction = this.db.transaction([STORE_NAME], mode);
    return {
      store: transaction.objectStore(STORE_NAME),
      transaction
    };
  }

  async executeRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`IndexedDB error: ${request.error?.message}`));
    });
  }
}
