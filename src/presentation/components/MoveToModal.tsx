import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Folder, ChevronRight, ChevronDown } from 'lucide-react'
import { DataRoomItem } from '../../domain/types'

interface MoveToModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMove: (targetFolderId: string | null) => void
  folders: DataRoomItem[]
  currentItemId: string
  currentParentId?: string | null
}

interface FolderNode {
  folder: DataRoomItem | null // null for root
  children: FolderNode[]
  isExpanded: boolean
}

export const MoveToModal = ({ open, onOpenChange, onMove, folders, currentItemId, currentParentId }: MoveToModalProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null | undefined>(undefined)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedFolderId(undefined)
    }
  }, [open])

  // Build folder tree
  const buildFolderTree = (): FolderNode => {
    const rootNode: FolderNode = {
      folder: null,
      children: [],
      isExpanded: true,
    }

    const folderMap = new Map<string, FolderNode>()
    folderMap.set('root', rootNode)

    // Create nodes for all folders
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        folder,
        children: [],
        isExpanded: expandedFolders.has(folder.id),
      })
    })

    // Build tree structure
    folders.forEach(folder => {
      const node = folderMap.get(folder.id)!
      const parentNode = folder.parentId ? folderMap.get(folder.parentId) : rootNode

      if (parentNode) {
        parentNode.children.push(node)
      }
    })

    return rootNode
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const isDescendant = (possibleDescendant: string, ancestor: string): boolean => {
    let currentId: string | null = possibleDescendant

    while (currentId) {
      if (currentId === ancestor) return true

      const folder = folders.find(f => f.id === currentId)
      if (!folder) break

      currentId = folder.parentId
    }

    return false
  }

  const canMoveTo = (targetFolderId: string | null): boolean => {
    // Can't move into itself
    if (targetFolderId === currentItemId) return false

    // Can't move into descendant (would create cycle)
    if (targetFolderId && isDescendant(targetFolderId, currentItemId)) return false

    return true
  }

  const renderFolderTree = (node: FolderNode, depth: number = 0): React.ReactElement | null => {
    const folderId = node.folder?.id || null
    const folderName = node.folder?.name || 'DataRoom'
    const disabled = !canMoveTo(folderId)
    const isSelected = selectedFolderId === folderId
    const hasChildren = node.children.length > 0
    const isExpanded = node.folder ? expandedFolders.has(node.folder.id) : true

    return (
      <div key={folderId || 'root'}>
        <div
          className={`flex items-center gap-2 px-3 py-2 hover:bg-accent rounded cursor-pointer ${
            isSelected ? 'bg-accent' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
          onClick={() => {
            if (!disabled) {
              setSelectedFolderId(folderId)
            }
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (node.folder) toggleFolder(node.folder.id)
              }}
              className="p-0 hover:bg-transparent"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="truncate">{folderName}</span>
        </div>
        {isExpanded && node.children.length > 0 && (
          <div>
            {node.children.map(child => renderFolderTree(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const handleMove = () => {
    if (selectedFolderId === undefined) return
    onMove(selectedFolderId)
    onOpenChange(false)
  }

  const folderTree = buildFolderTree()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
          <DialogDescription>
            Select a destination folder for this item
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto border rounded-lg p-2">
          {renderFolderTree(folderTree)}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={selectedFolderId === undefined || selectedFolderId === currentParentId}
          >
            Move Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
