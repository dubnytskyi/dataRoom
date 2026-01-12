import { useState, useEffect, useCallback } from 'react';
import { BreadcrumbItem } from '../../domain/types';

interface UseBreadcrumbsProps {
  currentFolderId: string | null;
  getBreadcrumbs: () => Promise<BreadcrumbItem[]>;
}

export const useBreadcrumbs = ({ currentFolderId, getBreadcrumbs }: UseBreadcrumbsProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const loadBreadcrumbs = useCallback(async () => {
    const crumbs = await getBreadcrumbs();
    setBreadcrumbs(crumbs);
  }, [getBreadcrumbs]);

  useEffect(() => {
    loadBreadcrumbs();
  }, [currentFolderId, loadBreadcrumbs]);

  return {
    breadcrumbs,
    loadBreadcrumbs,
  };
};
