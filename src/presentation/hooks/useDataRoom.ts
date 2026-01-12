import { useState, useEffect, useCallback, useRef } from 'react';
import { DataRoomItem, SortConfig, SortBy, SortOrder, CreateFolderDTO, UploadFileDTO, RenameItemDTO, MoveItemDTO } from '../../domain/types';
import { DataRoomService } from '../../application/services/DataRoomService';
import { IndexedDBRepository } from '../../infrastructure/repositories/IndexedDBRepository';
import { useAuth } from '../context/AuthContext';
import { ERROR_MESSAGES } from '../constants/messages';

const DEFAULT_SORT: SortConfig = {
  sortBy: SortBy.NAME,
  sortOrder: SortOrder.ASC,
};

export const useDataRoom = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<DataRoomItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(DEFAULT_SORT);

  // Store repository and service per user
  const repositoryRef = useRef<IndexedDBRepository | null>(null);
  const serviceRef = useRef<DataRoomService | null>(null);

  const loadItems = useCallback(async (folderId: string | null, config: SortConfig) => {
    if (!serviceRef.current) return;

    try {
      setLoading(true);
      setError(null);
      const loadedItems = await serviceRef.current.getItems(folderId);
      const sortedItems = serviceRef.current.sortItems(loadedItems, config);
      setItems(sortedItems);
      setCurrentFolderId(folderId);
    } catch (err) {
      setError(ERROR_MESSAGES.FAILED_LOAD_ITEMS);
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadCurrentFolder = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      setLoading(true);
      const loadedItems = await serviceRef.current.getItems(currentFolderId);
      const sortedItems = serviceRef.current.sortItems(loadedItems, sortConfig);
      setItems(sortedItems);
    } catch (err) {
      console.error('Error reloading items:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, sortConfig]);

  // Initialize repository and service when user changes
  useEffect(() => {
    const initDB = async () => {
      if (!user) {
        // Clear data when user logs out
        setItems([]);
        setCurrentFolderId(null);
        repositoryRef.current = null;
        serviceRef.current = null;
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Create new user-scoped repository and service
        const repository = new IndexedDBRepository(user.id);
        await repository.init();

        const service = new DataRoomService(repository);

        repositoryRef.current = repository;
        serviceRef.current = service;

        // Load initial items
        const loadedItems = await service.getItems(null);
        const sortedItems = service.sortItems(loadedItems, sortConfig);
        setItems(sortedItems);
        setCurrentFolderId(null);
      } catch (err) {
        setError(ERROR_MESSAGES.FAILED_INIT_DB);
        console.error('Error initializing DB:', err);
      } finally {
        setLoading(false);
      }
    };

    initDB();
  }, [user?.id]);

  const createFolder = useCallback(async (dto: CreateFolderDTO) => {
    if (!serviceRef.current) return { success: false, message: ERROR_MESSAGES.SERVICE_NOT_INITIALIZED };

    const result = await serviceRef.current.createFolder(dto);
    if (result.success) {
      await reloadCurrentFolder();
    }
    return result;
  }, [reloadCurrentFolder]);

  const uploadFile = useCallback(async (dto: UploadFileDTO) => {
    if (!serviceRef.current) return { success: false, message: ERROR_MESSAGES.SERVICE_NOT_INITIALIZED };

    const result = await serviceRef.current.uploadFile(dto);
    if (result.success) {
      await reloadCurrentFolder();
    }
    return result;
  }, [reloadCurrentFolder]);

  const renameItem = useCallback(async (dto: RenameItemDTO) => {
    if (!serviceRef.current) return { success: false, message: ERROR_MESSAGES.SERVICE_NOT_INITIALIZED };

    const result = await serviceRef.current.renameItem(dto);
    if (result.success) {
      await reloadCurrentFolder();
    }
    return result;
  }, [reloadCurrentFolder]);

  const deleteItem = useCallback(async (id: string) => {
    if (!serviceRef.current) return { success: false, message: ERROR_MESSAGES.SERVICE_NOT_INITIALIZED };

    const result = await serviceRef.current.deleteItem(id);
    if (result.success) {
      await reloadCurrentFolder();
    }
    return result;
  }, [reloadCurrentFolder]);

  const moveItem = useCallback(async (dto: MoveItemDTO) => {
    if (!serviceRef.current) return { success: false, message: ERROR_MESSAGES.SERVICE_NOT_INITIALIZED };

    const result = await serviceRef.current.moveItem(dto);
    if (result.success) {
      await reloadCurrentFolder();
    }
    return result;
  }, [reloadCurrentFolder]);

  const navigateToFolder = useCallback(async (folderId: string | null) => {
    if (!serviceRef.current) return;

    try {
      setLoading(true);
      setError(null);
      const loadedItems = await serviceRef.current.getItems(folderId);
      const sortedItems = serviceRef.current.sortItems(loadedItems, sortConfig);
      setItems(sortedItems);
      setCurrentFolderId(folderId);
    } catch (err) {
      setError(ERROR_MESSAGES.FAILED_LOAD_ITEMS);
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  }, [sortConfig]);

  const getBreadcrumbs = useCallback(async () => {
    if (!serviceRef.current) return [];
    return serviceRef.current.getBreadcrumbs(currentFolderId);
  }, [currentFolderId]);

  const getAllFolders = useCallback(async () => {
    if (!serviceRef.current) return [];
    return serviceRef.current.getAllFolders();
  }, []);

  const getAllItems = useCallback(async () => {
    if (!repositoryRef.current) return [];
    return repositoryRef.current.getAll();
  }, []);

  return {
    items,
    currentFolderId,
    loading,
    error,
    sortConfig,
    setSortConfig,
    createFolder,
    uploadFile,
    renameItem,
    deleteItem,
    moveItem,
    navigateToFolder,
    getBreadcrumbs,
    getAllFolders,
    getAllItems,
    refresh: () => loadItems(currentFolderId, sortConfig),
  };
};
