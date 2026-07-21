# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation — Editor Chrome, Auth, APIs

## Current Goal

- (completed) Editor workspace shell — `/editor/[roomId]` with server-side access checks, workspace layout, and sidebar integration

## Completed

- Feature: Design System — shadcn/ui installed and configured (Tailwind v4), components added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, `lib/utils.ts` with `cn()` helper created, dark-only custom theme from ui-context.md applied (custom variables: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--text-*`, `--accent-*`, `--state-*`, `--border-*` mapped via `@theme inline`), `.dark` class applied to `<html>`
- Feature: Editor Chrome — `components/editor/editor-navbar.tsx` created (fixed-height navbar, left/center/right sections, sidebar toggle with `PanelLeftOpen`/`PanelLeftClose` icons, dark elevated background, subtle bottom border)
- Feature: Editor Chrome — `components/editor/project-sidebar.tsx` created (fixed overlay above canvas, slides in from left, `isOpen` prop, Projects title + close button header, shadcn Tabs with My Projects / Shared tabs showing empty placeholder state, full-width New Project button with Plus icon)
- Feature: Auth — Clerk authentication wired per feature spec: `ClerkProvider` with `dark` theme from `@clerk/ui/themes` and CSS variable overrides in root layout, `AuthLayout` component with two-panel design (logo/tagline/feature list left, Clerk form right), sign-in/sign-up pages use `AuthLayout`, `/` redirects authenticated users to `/editor` and unauthenticated to `/sign-in`, `UserButton` in editor navbar right section, `proxy.ts` protects all routes except sign-in/sign-up, env vars redirect to `/editor` after auth
- Feature: Project Dialogs & Editor Home — `lib/types.ts` with `Project` interface (slug removed, aligned to DB schema), `hooks/use-project-dialogs.ts` dedicated hook managing dialog/form/loading state, `EditorHome` component with heading/description/New Project button, `CreateProjectDialog` with project name input + live slug preview, `RenameProjectDialog` with prefilled name/description/auto-focus/Enter submit, `DeleteProjectDialog` with destructive confirmation, `ProjectSidebar` updated with rename/delete actions for owned projects (hidden for shared), mobile backdrop scrim, all dialogs wired from sidebar and editor home
- Feature: Editor Shell & Project Dialogs — `app/editor/editor-shell.tsx` and the three project dialogs (`CreateProjectDialog`, `RenameProjectDialog`, `DeleteProjectDialog`) are implemented and wired through `hooks/use-project-actions.ts`. The editor shell and sidebar integrate real project data and dialog flows, and editor home shows room ID previews on create. Remaining limitation: persistence for canvas snapshots and generated specs is implemented as blob references in the schema but some API routes currently save/expect filesystem paths; these persistence flows will be migrated to Vercel Blob (see architecture-context.md) in a follow-up task.
- Feature: Prisma Schema & Data Layer — `prisma/schema.prisma` with generator (output to `app/generated/prisma`) and `postgresql` datasource, `prisma/models/project.prisma` with `Project` and `ProjectCollaborator` models (enums, relations, indexes, cascade delete, unique constraints), `lib/prisma.ts` cached singleton (Accelerate branch for `prisma+postgres://` URLs via `@prisma/extension-accelerate`, adapter-pg branch for direct connections), `@prisma/extension-accelerate` installed, first migration created and applied (`add_projects`)
- Feature: Project APIs — `app/api/projects/route.ts` (GET list + POST create) and `app/api/projects/[projectId]/route.ts` (PATCH rename + DELETE delete), Clerk `auth()` for owner identification, 401 for unauthenticated, 403 for non-owner mutations, 404 for missing projects, default name "Untitled Project" on create, name required on rename, all endpoints tested via `npm run build`
- Feature: Wire Editor Home — `app/editor/page.tsx` converted to server component; `app/editor/editor-shell.tsx` client wrapper created; `lib/data/projects.ts` server-side data helper fetches owned + shared projects via Prisma (collaborator email match); `hooks/use-project-actions.ts` replaces old hook with create (POST + navigate to workspace with slug+suffix room ID), rename (PATCH + router.refresh), delete (DELETE + router.refresh); `components/editor/project-sidebar.tsx` now accepts real project data as props (no mock data); all three dialogs wired with mutation callbacks; `CreateProjectDialog` shows room ID preview; `RenameProjectDialog` Enter submits rename; `DeleteProjectDialog` shows project name; `lib/mock-data.ts` and `hooks/use-project-dialogs.ts` removed; `GET /api/projects` returns both owned and shared projects, `POST /api/projects` accepts optional `id` for room ID alignment
- Feature: Editor Workspace Shell — `lib/project-access.ts` created with `getCurrentIdentity()` (userId + primary email) and `checkProjectAccess(roomId)` (owner or collaborator check) helpers; `components/editor/access-denied.tsx` created with centered layout, lock icon, message, and link back to `/editor`; `app/editor/[roomId]/page.tsx` server component created — auth check redirects to `/sign-in`, access check shows `AccessDenied` for unauthorized/missing projects, fetches project data and passes to workspace shell; `components/editor/workspace-shell.tsx` client component created with full-viewport workspace layout — navbar with project name, share button (no-op), AI sidebar toggle, `ProjectSidebar` with current room highlighted, central canvas placeholder (dark background, "Select an element to edit" message), right AI sidebar placeholder ("Coming soon"); `EditorNavbar` extended with optional `title`, `showShare`, `showAiSidebar`, `isAiSidebarOpen`, `onToggleAiSidebar` props; `ProjectSidebar` extended with optional `currentRoomId` prop for highlight, project items wrapped in `<Link>` to `/editor/[project.id]`, shared projects also linked and highlighted; no TypeScript errors (pre-existing `prisma.config.ts` error unrelated)
- Feature: Share Dialog — `app/api/projects/[projectId]/collaborators/route.ts` created with GET (list collaborators enriched via Clerk Backend API), POST (invite, owner-only), DELETE (remove, owner-only) endpoints; `components/editor/share-dialog.tsx` created with copy-link button (temporary "Copied!" feedback), owner invite-by-email, collaborator list with Clerk-enriched names/avatars, remove button for owners, read-only list for collaborators; `EditorNavbar` extended with `onShare` prop; `WorkspaceShell` wires share dialog open state; `npm run build` passes
- Feature: Base Canvas — `types/canvas.ts` with `CanvasNodeData` (label, color, shape), `CanvasNode`, `CanvasEdge` types, `NODE_COLORS` and `DEFAULT_NODE_COLOR` constants; `CanvasProvider` client component wrapping `LiveblocksProvider` (`/api/liveblocks-auth`), `RoomProvider` (room ID, initial presence with `cursor: null`), `ClientSideSuspense` with loading state, and error boundary fallback; `EditorCanvas` client component using `useLiveblocksFlow` from `@liveblocks/react-flow` with suspense, empty initial nodes/edges (only seeds new rooms, preserves existing), passing synced state to `ReactFlow` with `fitView`, `Background` (dots), `MiniMap`, `colorMode="dark"`, and loose connections; placeholder div in `WorkspaceShell` replaced with `CanvasProvider` + `EditorCanvas`; `npm run build` passes

## Next Up

- Editor canvas and document management
- Shape-specific node rendering and edge rendering

## Open Questions

- Add unresolved product or implementation questions here.

- Feature: Liveblocks Setup — `liveblocks.config.ts` defines Presence (cursor, isThinking) and UserMeta (name, avatar, color); `lib/liveblocks.ts` provides cached `Liveblocks` node client with deterministic `getCursorColor` helper; `POST /api/liveblocks-auth` requires Clerk auth, verifies project access via `checkProjectAccess`, creates room with `getOrCreateRoom` if needed, and returns ID token with user metadata (name, avatar, color); `@liveblocks/node@^3.22.0` installed

## Architecture Decisions

- `@liveblocks/react-flow` manages its own storage key (`"flow"`) internally — root-level `Storage` type in `liveblocks.config.ts` is kept as `{}` to avoid LSON type conflicts. `initialStorage` not required on `RoomProvider` when `Storage: {}`.
- `CanvasProvider` wraps `LiveblocksProvider` → `RoomProvider` → `ClientSideSuspense` as a dedicated component so the Liveblocks room setup is isolated from the React Flow rendering. Both the canvas provider and the editor canvas are separate client components.
- `useLiveblocksFlow` with `suspense: true` always returns non-null arrays for nodes/edges. Initial nodes/edges are only used when seeding a new room — existing rooms hydrate from Liveblocks storage automatically, matching the spec requirement to preserve existing room state across remounts/reconnects.
- `EditorCanvas` uses the CSS import `@xyflow/react/dist/base.css` for React Flow base styles (available via package.json exports map).
- Error boundary is a class component inside `CanvasProvider` — catches Liveblocks connection failures at the room level and shows a fallback message.

- Workspace shell follows the same server→client component pattern as editor home: `app/editor/[roomId]/page.tsx` is a server component handling auth, access checks, and data fetching; `WorkspaceShell` is a client component managing interactive state (sidebar open/close, AI sidebar toggle)
- `EditorNavbar` extended with optional workspace props rather than creating a separate `WorkspaceNavbar` — avoids duplication, the existing component already uses the correct layout pattern
- `ProjectSidebar` made clickable by wrapping project items in `<Link>` — clicking a project navigates to its workspace in all views; `currentRoomId` prop added for highlight styling
- `AccessDenied` is a server component (no client interactivity needed beyond Link)
- `checkProjectAccess` reuses the `<Project, ownerId, collaborators>` pattern already established in `lib/data/projects.ts`

- `components/editor/workspace-shell.tsx` — Fixed edit/delete buttons and "New Project" button not opening dialogs from sidebar in workspace view. Wired `useProjectActions` hook to sidebar `onCreate`, `onRename`, `onDelete` callbacks. Added `CreateProjectDialog`, `RenameProjectDialog`, `DeleteProjectDialog` to workspace shell. Custom `handleDelete` redirects to `/editor` when deleting the currently-viewed project.

## Session Notes

- `types/canvas.ts` created with `CanvasNodeData` (extends `Record<string, unknown>` for React Flow type compatibility), `CanvasNode`, `CanvasEdge` types
- `liveblocks.config.ts` reverted to `Storage: {}` — `@liveblocks/react-flow` manages its own nested storage under `"flow"` key
- `components/editor/canvas-provider.tsx` created with `LiveblocksProvider`, `RoomProvider`, `ClientSideSuspense`, and error boundary
- `components/editor/editor-canvas.tsx` created with `useLiveblocksFlow` (suspense mode), `ReactFlow` with dark mode, `BackgroundVariant.Dots`, `MiniMap`, `fitView`
- `components/editor/workspace-shell.tsx` updated to replace canvas placeholder with `CanvasProvider` + `EditorCanvas`
- `npm run build` passes
- Next: shape-specific node rendering, edge rendering, controls, persistence, AI behavior
- Feature: Shape Panel — `components/editor/shape-panel.tsx` created with floating pill-shaped toolbar at bottom-center of canvas; 6 draggable shape buttons (rectangle, diamond, circle, pill, cylinder, hexagon) with lucide-react icons; each button supports drag (with shape + default size in `application/ghost-shape` payload), click, and keyboard activation (Enter/Space); `components/editor/canvas-node.tsx` created with `CanvasNodeRenderer` component (bordered rectangle + centered label + handles); `types/canvas.ts` extended with `NODE_COLORS` and `DEFAULT_NODE_COLOR` constants; `EditorCanvas` updated with `onInit` to capture ReactFlow instance, `onDragOver`/`onDrop` handlers that read shape payload, convert screen position to flow coordinates via `screenToFlowPosition`, and create nodes using `addNodes` with `crypto.randomUUID()` for collision-resistant IDs; click/keyboard placement uses center of the canvas wrapper; `nodeTypes` registered with `canvasNode` → `CanvasNodeRenderer` mapping; `npm run build` passes
- Fix: Canvas Visual Issues — ReactFlow background overridden to `transparent` via `--xy-background-color` CSS variable; `Background` component uses `bgColor="transparent"` and `color="#444"` for visible dots on dark base; canvas wrapper uses `bg-base` to match the app background, eliminating the floating card effect and making the canvas feel like an infinite design canvas
- Fix: Sidebar Overlay Layout — `WorkspaceShell` restructured so the canvas fills the full workspace container while both sidebars float over it using `absolute` positioning with `z-50`/`z-40`; canvas extends edge-to-edge underneath both sidebars with the dotted pattern visible behind; `ProjectSidebar` changed from `fixed` to `absolute` so `overflow-hidden` on the workspace container clips it fully off-screen when closed (`-translate-x-full`); added `shadow-lg` to both sidebars for elevated appearance; right AI sidebar moved from flex layout (pushing canvas) to `absolute right-0 top-0 z-40` (floating overlay); `npm run build` passes

- `@liveblocks/node@^3.22.0` installed
- `liveblocks.config.ts` defines Presence (cursor, isThinking) and UserMeta (name, avatar, color)
- `lib/liveblocks.ts` provides cached `Liveblocks` node client and `getCursorColor` deterministic color helper
- `POST /api/liveblocks-auth` authenticates via Clerk, checks project access, creates room if needed, issues ID token with user metadata
- `.env.local` has `LIVEBLOCKS_SECRET_KEY` placeholder — must be replaced with a real key for runtime use
- Next step: wire `LiveblocksProvider` in workspace shell to enable realtime features
