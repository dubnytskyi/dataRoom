export const SUCCESS_MESSAGES = {
  FOLDER_CREATED: 'Folder created successfully',
  ITEM_RENAMED: 'Item renamed successfully',
  ITEM_DELETED: 'Item deleted successfully',
  ITEM_MOVED: (itemName: string) => `${itemName} moved successfully`,
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DOWNLOADED: (fileName: string) => `${fileName} downloaded`,
} as const;

export const ERROR_MESSAGES = {
  DUPLICATE_FOLDER: 'A folder with this name already exists in this location',
  DUPLICATE_FILE: 'A file with this name already exists in this location',
  DUPLICATE_ITEM: 'An item with this name already exists in this location',
  ITEM_NOT_FOUND: 'Item not found',
  MOVE_INTO_ITSELF: 'Cannot move folder into itself',
  MOVE_INTO_SUBFOLDER: 'Cannot move folder into its own subfolder',
  ITEM_IN_TARGET: 'An item with this name already exists in the target location',
  FAILED_CREATE_FOLDER: 'Failed to create folder',
  FAILED_UPLOAD: 'Failed to upload file',
  FAILED_RENAME: 'Failed to rename item',
  FAILED_MOVE: 'Failed to move item',
  FAILED_DELETE: 'Failed to delete item',
  FAILED_LOAD_ITEMS: 'Failed to load items',
  FAILED_INIT_DB: 'Failed to initialize database',
  FAILED_READ_FILE: 'Failed to read file',
  SERVICE_NOT_INITIALIZED: 'Service not initialized',
  ONLY_PDF_ALLOWED: 'Only PDF files are allowed',
  DRAG_DROP_MOVE_INTO_ITSELF: 'Cannot move item into itself',
} as const;

export const UI_TEXT = {
  DIALOGS: {
    CREATE_FOLDER_TITLE: 'Create New Folder',
    CREATE_FOLDER_DESC: 'Enter a name for your new folder',
    RENAME_TITLE: 'Rename Item',
    RENAME_DESC: 'Enter a new name for this item',
    DELETE_TITLE: 'Delete Item',
    DELETE_CONFIRM: (itemName: string) => `Are you sure you want to delete "${itemName}"?`,
    DELETE_FOLDER_WARNING: ' This will also delete all items inside this folder.',
    MOVE_TO_TITLE: 'Move to Folder',
    MOVE_TO_DESC: 'Select a destination folder for this item',
  },
  BUTTONS: {
    CANCEL: 'Cancel',
    CREATE: 'Create',
    RENAME: 'Rename',
    DELETE: 'Delete',
    MOVE_HERE: 'Move Here',
    NEW_FOLDER: 'New Folder',
    UPLOAD_PDF: 'Upload PDF',
    LOGOUT: 'Logout',
  },
  PLACEHOLDERS: {
    FOLDER_NAME: 'Folder name',
    NEW_NAME: 'New name',
    SEARCH: 'Search files and folders...',
  },
  BREADCRUMBS: {
    ROOT: 'DataRoom',
  },
  FILTER: {
    LABEL: 'Filter',
    ALL: 'All',
    FOLDERS_ONLY: 'Folders Only',
    FILES_ONLY: 'Files Only',
  },
  ARIA_LABELS: {
    CLEAR_SEARCH: 'Clear search',
  },
} as const;
