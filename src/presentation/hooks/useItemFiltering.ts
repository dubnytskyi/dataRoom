import { useMemo } from 'react';
import { DataRoomItem, ItemType } from '../../domain/types';
import { FilterType } from './useSearch';

interface UseItemFilteringProps {
  items: DataRoomItem[];
  searchQuery: string;
  filterType: FilterType;
  filteredItems: DataRoomItem[];
}

export const useItemFiltering = ({
  items,
  searchQuery,
  filterType,
  filteredItems,
}: UseItemFilteringProps) => {
  const itemsToDisplay = useMemo(() => {
    const hasSearchQuery = searchQuery.trim() !== '';
    const hasTypeFilter = filterType !== FilterType.ALL;

    if (hasSearchQuery) {
      // Global search across all items
      return filteredItems;
    }

    if (hasTypeFilter) {
      // Filter current folder items by type
      return items.filter(item => {
        if (filterType === FilterType.FOLDERS) return item.type === ItemType.FOLDER;
        if (filterType === FilterType.FILES) return item.type === ItemType.FILE;
        return true;
      });
    }

    // Show current folder items
    return items;
  }, [searchQuery, filterType, filteredItems, items]);

  return { itemsToDisplay };
};
