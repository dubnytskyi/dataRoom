import { IDataRoomRepository } from '@/domain/repositories/IDataRoomRepository.ts';
import { DataRoomItem, ItemType } from '@/domain/types';
import { IndexedDBClient } from '../database/IndexedDBClient';

/**
 * IndexedDB implementation of IDataRoomRepository
 * Can be easily replaced with API-based repository
 * Creates a user-scoped database for data isolation
 */
export class IndexedDBRepository implements IDataRoomRepository {
  private client: IndexedDBClient;

  constructor(userId: string) {
    this.client = new IndexedDBClient(userId);
  }

  async init(): Promise<void> {
    await this.client.init();
  }

  async getById(id: string): Promise<DataRoomItem | undefined> {
    const { store } = this.client.getObjectStore('readonly');
    const request = store.get(id);
    return this.client.executeRequest(request);
  }

  async getByParentId(parentId: string | null): Promise<DataRoomItem[]> {
    const { store } = this.client.getObjectStore('readonly');

    // IndexedDB index doesn't handle null values correctly in getAll()
    // So we need to filter manually when parentId is null
    if (parentId === null) {
      const request = store.getAll();
      const allItems = await this.client.executeRequest(request);
      return allItems.filter(item => item.parentId === null);
    }

    const index = store.index('parentId');
    const request = index.getAll(parentId);
    return this.client.executeRequest(request);
  }

  async getAll(): Promise<DataRoomItem[]> {
    const { store } = this.client.getObjectStore('readonly');
    const request = store.getAll();
    return this.client.executeRequest(request);
  }

  async add(item: DataRoomItem): Promise<void> {
    const { store, transaction } = this.client.getObjectStore('readwrite');
    const request = store.add(item);

    // Wait for request to complete
    await this.client.executeRequest(request);

    // CRITICAL: Wait for transaction to actually commit to disk
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => reject(new Error(`Transaction error: ${transaction.error?.message}`));
      transaction.onabort = () => reject(new Error('Transaction aborted'));
    });
  }

  async update(item: DataRoomItem): Promise<void> {
    const { store, transaction } = this.client.getObjectStore('readwrite');
    const request = store.put(item);

    await this.client.executeRequest(request);

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => reject(new Error(`Transaction error: ${transaction.error?.message}`));
      transaction.onabort = () => reject(new Error('Transaction aborted'));
    });
  }

  async delete(id: string): Promise<void> {
    const { store, transaction } = this.client.getObjectStore('readwrite');
    const request = store.delete(id);

    await this.client.executeRequest(request);

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => reject(new Error(`Transaction error: ${transaction.error?.message}`));
      transaction.onabort = () => reject(new Error('Transaction aborted'));
    });
  }

  async checkDuplicateName(
    name: string,
    parentId: string | null,
    excludeId?: string
  ): Promise<boolean> {
    const items = await this.getByParentId(parentId);
    return items.some(
      (item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== excludeId
    );
  }

  async deleteWithChildren(id: string): Promise<void> {
    const item = await this.getById(id);
    if (!item) return;

    // If folder, delete all children recursively
    if (item.type === ItemType.FOLDER) {
      const children = await this.getByParentId(id);
      for (const child of children) {
        await this.deleteWithChildren(child.id);
      }
    }

    // Delete the item itself
    await this.delete(id);
  }
}
