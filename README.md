# DataRoom - Secure Document Management

> Production-ready document management system with authentication, real-time search, and drag & drop support

A professional DataRoom application built with **React**, **TypeScript**, **Firebase**, and **Clean Architecture** principles. Features include multi-user authentication, folder management, PDF uploads, global search, and an intuitive drag & drop interface.

## 🎯 Features

### Authentication & Security
- ✅ **Google OAuth**: Sign in with Google account
- ✅ **Email/Password**: Traditional authentication
- ✅ **User Isolation**: Each user has their own private workspace
- ✅ **Secure Storage**: User-scoped IndexedDB databases (`DataRoomDB-{userId}`)

### Core Functionality
- ✅ **Folder Management**: Create, rename, delete, move folders with unlimited nesting
- ✅ **File Upload**: Upload PDF files with drag & drop from OS
- ✅ **File Operations**: View, rename, move, delete, and download files
- ✅ **PDF Preview**: In-app PDF viewer with download option
- ✅ **Global Search**: Real-time search across all files and folders with space normalization
- ✅ **Smart Filters**: Filter by All/Folders Only/Files Only
- ✅ **Move Items**: Context menu and drag & drop to move items between folders
- ✅ **Breadcrumb Navigation**: Drag items onto breadcrumbs to move them
- ✅ **Validation**: Duplicate name detection, file type validation, circular dependency prevention

### UI/UX Excellence
- ✅ **Modern Design**: Clean, minimal interface inspired by Google Drive
- ✅ **Drag & Drop**:
  - Drop files from OS anywhere on the page
  - Drag items between folders
  - Drag items onto breadcrumbs for quick navigation
  - Visual feedback with hover states and animations
- ✅ **Toast Notifications**: Real-time feedback for all operations
- ✅ **Empty States**: Helpful placeholders when folders are empty
- ✅ **Loading States**: Smooth transitions during async operations
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Custom Favicon**: Branded folder icon in browser tab

### Code Quality
- ✅ **Clean Architecture**: 4-layer separation (Domain, Application, Infrastructure, Presentation)
- ✅ **SOLID Principles**: Dependency Inversion, Single Responsibility, Open/Closed
- ✅ **Design Patterns**: Repository, Factory, Service Layer, Custom Hooks
- ✅ **Type Safety**: Strict TypeScript with no `any` types
- ✅ **DRY Principle**: Extracted helpers, no code duplication
- ✅ **Constants Over Magic Strings**: All text, messages, and numbers in constants files
- ✅ **Conditional Rendering**: Clean && pattern instead of nested ternaries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project (for authentication)

### Setup Instructions

#### 1. Clone the repository
```bash
git clone <repository-url>
cd dataRoom
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure Firebase

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

To get these values:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Sign-in methods**:
   - Enable **Google** provider
   - Enable **Email/Password** provider
4. Go to **Project Settings** → **General** → **Your apps**
5. Click **Web app** (</>) icon
6. Copy the config values to your `.env` file

#### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### 5. Build for production
```bash
npm run build
npm run preview
```

## 🏗️ Architecture & Design Decisions

### Clean Architecture (4 Layers)

```
src/
├── domain/                    # Business Logic (framework-independent)
│   ├── entities/             # Folder & File factories with validation
│   ├── repositories/         # Repository interfaces (IDataRoomRepository)
│   ├── types/                # TypeScript types and enums
│   └── constants/            # Domain constants (MIME_TYPES, FILE_EXTENSIONS)
│
├── infrastructure/            # External Concerns
│   ├── repositories/         # IndexedDBRepository implementation
│   ├── database/             # IndexedDBClient (low-level DB operations)
│   ├── auth/                 # FirebaseAuthService
│   ├── config/               # Firebase configuration
│   ├── utils/                # File utilities (formatFileSize, readFileAsDataURL)
│   └── constants/            # Infrastructure constants (TIME_UNITS)
│
├── application/               # Use Cases
│   └── services/             # DataRoomService (business rules)
│
└── presentation/              # UI Layer
    ├── components/
    │   ├── ui/               # Base components (Button, Input, Dialog)
    │   ├── dialogs/          # Modal dialogs (Create, Rename, Delete, PDF Preview)
    │   ├── auth/             # Authentication components
    │   └── DataRoom/         # Main UI components
    ├── hooks/                # Custom hooks (useDataRoom, useAuth, useSearch, etc.)
    ├── context/              # React Context (AuthContext)
    └── constants/            # UI constants (messages.ts, keyboard.ts)
```

### Key Design Decisions

#### 1. Why User-Scoped IndexedDB?
**Decision**: Each user gets their own IndexedDB database named `DataRoomDB-{userId}`

**Reasoning**:
- **User Isolation**: Different users don't see each other's files
- **Security**: No shared storage, no data leakage
- **Scalability**: Easy to migrate to backend - just change repository implementation
- **Offline-First**: Works without internet after authentication

**Implementation**:
```typescript
// IndexedDBClient creates user-specific database
constructor(userId: string) {
  this.dbName = `DataRoomDB-${userId}`;
}
```

#### 2. Why Firebase Authentication?
**Decision**: Firebase Auth with Google OAuth + Email/Password

**Reasoning**:
- **No Backend Required**: Serverless authentication
- **Production Ready**: Battle-tested, secure, scalable
- **Multiple Providers**: Google OAuth for convenience, Email/Password for flexibility
- **Free Tier**: Generous limits for demo projects
- **Easy Integration**: Official SDK with TypeScript support

#### 3. Why Clean Architecture?
**Decision**: 4-layer separation with strict dependency rules

**Reasoning**:
- **Maintainability**: Each layer has clear responsibility
- **Testability**: Can test business logic without UI or database
- **Flexibility**: Easy to swap IndexedDB for REST API
- **Professional**: Shows understanding of software engineering principles

**Example**: Repository pattern allows swapping storage:
```typescript
interface IDataRoomRepository {
  add(item: DataRoomItem): Promise<void>;
  // ... other methods
}

// Current: IndexedDBRepository
// Future: APIRepository (just implement the interface)
```

#### 4. Why Constants Files?
**Decision**: Extracted all magic strings and numbers into constant files

**Reasoning**:
- **Maintainability**: Change text in one place
- **i18n Ready**: Easy to add internationalization later
- **Type Safety**: Autocomplete and type checking for messages
- **No Typos**: Can't misspell error messages

**Structure**:
```typescript
// presentation/constants/messages.ts
export const ERROR_MESSAGES = {
  DUPLICATE_FOLDER: 'A folder with this name already exists',
  // ...
} as const;

// domain/constants/file.ts
export const MIME_TYPES = {
  PDF: 'application/pdf',
} as const;
```

#### 5. Why Custom Hooks?
**Decision**: Extracted logic into custom hooks (useDataRoom, useSearch, useItemFiltering, etc.)

**Reasoning**:
- **Separation of Concerns**: UI components stay thin
- **Reusability**: Hooks can be used in multiple components
- **Testability**: Can test hooks independently
- **Readability**: Component code is cleaner

**Example**:
```typescript
// App.tsx is just composition:
const { items, createFolder, uploadFile } = useDataRoom();
const { searchQuery, setSearchQuery } = useSearch(allItems);
const { itemsToDisplay } = useItemFiltering({ items, searchQuery, filterType });
```

#### 6. Why Global Search + Filters?
**Decision**: Search across all items, not just current folder

**Reasoning**:
- **User Expectation**: Modern file managers search globally
- **Better UX**: Find files faster
- **Smart Filtering**: Combine search with type filters (folders/files)
- **Space Normalization**: Handle files with multiple spaces in names

**Implementation**:
```typescript
// useSearch normalizes spaces: "File  Name" matches "File Name"
const normalizedQuery = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
const normalizedName = item.name.toLowerCase().replace(/\s+/g, ' ');
return normalizedName.includes(normalizedQuery);
```

#### 7. Why Drag & Drop Everywhere?
**Decision**: Multiple drag & drop interactions

**Reasoning**:
- **Better UX**: Faster than context menus
- **Modern Interface**: Expected behavior in file managers
- **Visual Feedback**: Clear hover states and animations
- **Flexible**: Drop files from OS, drag items to folders, drag to breadcrumbs

**Features**:
- Drop files from OS anywhere on page → uploads to current folder
- Drag item to folder → moves item
- Drag item to breadcrumb → moves to that folder
- Visual feedback with highlighting and scale animations

## 🛠️ Tech Stack

| Category | Technology | Why? |
|----------|-----------|------|
| **Framework** | React 18 + TypeScript | Type safety, modern hooks, component composition |
| **Build Tool** | Vite 5 | Fast HMR, optimized builds, better DX |
| **Authentication** | Firebase Auth | Serverless, secure, multi-provider support |
| **Storage** | IndexedDB | Offline-first, large storage (50MB+), async API |
| **Styling** | Tailwind CSS | Utility-first, fast development, small bundle |
| **UI Components** | Shadcn/ui (Radix UI) | Accessible (ARIA), keyboard nav, customizable |
| **Icons** | Lucide React | Lightweight, consistent, tree-shakeable |
| **Notifications** | Sonner | Modern toast notifications, smooth animations |
| **State Management** | React Hooks + Context | Simple, built-in, no extra dependencies |

## 📖 Usage Guide

### First Time Setup
1. Open the app at http://localhost:5173
2. Click **"Sign in with Google"** or **"Sign up"** for email/password
3. Create your first folder
4. Start organizing your documents!

### Creating Folders
- Click **"New Folder"** button in header
- Enter folder name and press Enter
- Duplicate names in same location are prevented

### Uploading Files
- Click **"Upload PDF"** button
- **OR** drag PDF files from your computer anywhere on the page
- Only PDF files are allowed
- Files upload to current folder

### Search & Filter
- Type in search box to search **all** files and folders globally
- Click **"Filter"** button to show:
  - All items (default)
  - Folders only
  - Files only
- Filters work on current folder, search works globally

### Moving Items
**Context Menu:**
1. Hover over item → click ⋮ menu → "Move to"
2. Select destination folder in tree
3. Click "Move Here"

**Drag & Drop:**
1. Drag item and hover over a folder → drops inside folder
2. Drag item onto breadcrumb → moves to that folder
3. Visual feedback shows where item will be dropped

### Renaming & Deleting
- Hover over item → click ⋮ menu
- "Rename" → enter new name
- "Delete" → confirm deletion (folders delete all contents)

### PDF Preview
- Click on any PDF file to preview it
- Click "Download" to save to your computer

## 🧪 Testing Checklist

Manual testing performed:
- ✅ Google OAuth sign-in
- ✅ Email/Password sign-up and sign-in
- ✅ User isolation (different users see different files)
- ✅ Create/rename/delete folders at root and nested levels
- ✅ Upload PDFs via button and drag & drop from OS
- ✅ Global search with space normalization
- ✅ Filter by folders/files
- ✅ Move items via context menu (including to root)
- ✅ Drag & drop items between folders
- ✅ Drag & drop items onto breadcrumbs
- ✅ PDF preview and download
- ✅ Duplicate name validation
- ✅ Circular dependency prevention (can't move folder into itself)
- ✅ Cascade delete (deleting folder removes all contents)
- ✅ Favicon displays in browser tab

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Deploy!

### Build Locally

```bash
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally
```

## 🔒 Security

- **Client-Side Storage**: All data in browser's IndexedDB (user-scoped)
- **Firebase Auth**: Industry-standard authentication
- **No Backend**: No server-side vulnerabilities
- **Input Sanitization**: File names validated, no XSS possible
- **Type Safety**: TypeScript prevents many runtime errors
- **User Isolation**: Each user's data in separate database

## 🔮 Future Enhancements

If this were production:
- **Backend API**: Replace IndexedDB with PostgreSQL + REST API
- **Cloud Storage**: S3/Azure Blob for file storage
- **Permissions**: Share folders with specific users (view/edit roles)
- **Real-time Collaboration**: WebSocket for live updates
- **Version History**: Track file changes over time
- **Audit Logs**: Track who accessed what and when
- **Advanced Search**: Full-text search in PDF contents
- **Mobile App**: React Native for iOS/Android
- **E2E Tests**: Playwright for automated testing
- **CI/CD**: GitHub Actions for automated deployments

## 📄 License

MIT

---

## 🎓 What This Project Demonstrates

### Software Engineering
- ✅ Clean Architecture principles
- ✅ SOLID principles
- ✅ Design patterns (Repository, Factory, Service Layer)
- ✅ Separation of concerns
- ✅ Dependency injection

### TypeScript Mastery
- ✅ Strict type safety
- ✅ Interfaces and enums
- ✅ Generic types
- ✅ Const assertions
- ✅ No `any` types

### React Best Practices
- ✅ Custom hooks for logic reuse
- ✅ Context API for global state
- ✅ Proper useEffect usage
- ✅ useMemo for performance
- ✅ Component composition

### Code Quality
- ✅ DRY principle
- ✅ Constants over magic strings
- ✅ Clean conditional rendering
- ✅ Consistent error handling
- ✅ Professional code organization

### UX Design
- ✅ Intuitive drag & drop
- ✅ Real-time search
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty states
- ✅ Responsive design

**Built with attention to detail, following industry best practices** 🚀
