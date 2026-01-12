import { useState, useMemo } from 'react';
import { DataRoomItem, ItemType } from '../../domain/types';

export enum FilterType {
  ALL = 'ALL',
  FOLDERS = 'FOLDERS',
  FILES = 'FILES',
}

export const useSearch = (items: DataRoomItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply filter by type
    if (filterType === FilterType.FOLDERS) {
      result = result.filter((item) => item.type === ItemType.FOLDER);
    } else if (filterType === FilterType.FILES) {
      result = result.filter((item) => item.type === ItemType.FILE);
    }

    // Apply search query
    if (searchQuery.trim()) {
      // Normalize spaces: replace multiple spaces with single space
      const normalizedQuery = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
      result = result.filter((item) => {
        // Normalize spaces in item name as well
        const normalizedName = item.name.toLowerCase().replace(/\s+/g, ' ');
        return normalizedName.includes(normalizedQuery);
      });
    }

    return result;
  }, [items, searchQuery, filterType]);

  return {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filteredItems,
  };
};
