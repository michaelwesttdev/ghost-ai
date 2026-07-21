# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation — Editor Chrome, Auth, APIs

## Current Goal

- (completed) Wire editor home — server-side data fetching, project mutations, real API wiring

## Completed

- Feature: Design System — shadcn/ui installed and configured (Tailwind v4), components added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, `lib/utils.ts` with `cn()` helper created, dark-only custom theme from ui-context.md applied (custom variables: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--text-*`, `--accent-*`, `--state-*`, `--border-*` mapped via `@theme inline`), `.dark` class applied to `<html>`
- Feature: Editor Chrome — `components/editor/editor-navbar.tsx` created (fixed-height navbar, left/center/right sections, sidebar toggle with `PanelLeftOpen`/`PanelLeftClose` icons, dark elevated background, subtle bottom border)
- Feature: Editor Chrome — `components/editor/project-sidebar.tsx` created (fixed overlay above canvas, slides in from left, `isOpen` prop, Projects title + close button header, shadcn Tabs with My Projects / Shared tabs showing empty placeholder state, full-width New Project button with Plus icon)
- Feature: Auth — Clerk authentication wired per feature spec: `ClerkProvider` with `dark` theme from `@clerk/ui/themes` and CSS variable overrides in root layout, `AuthLayout` component with two-panel design (logo/tagline/feature list left, Clerk form right), sign-in/sign-up pages use `AuthLayout`, `/` redirects authenticated users to `/editor` and unauthenticated to `/sign-in`, `UserButton` in editor navbar right section, `proxy.ts` protects all routes except sign-in/sign-up, env vars redirect to `/editor` after auth
- Feature: Project Dialogs & Editor Home — `lib/types.ts` with `Project` interface (slug removed, aligned to DB schema), `hooks/use-project-dialogs.ts` dedicated hook managing dialog/form/loading state, `EditorHome` component with heading/description/New Project button, `CreateProjectDialog` with project name input + live slug preview, `RenameProjectDialog` with prefilled name/description/auto-focus/Enter submit, `DeleteProjectDialog` with destructive confirmation, `ProjectSidebar` updated with rename/delete actions for owned projects (hidden for shared), mobile backdrop scrim, all dialogs wired from sidebar and editor home
- Feature: Prisma Schema & Data Layer — `prisma/schema.prisma` with generator (output to `app/generated/prisma`) and `postgresql` datasource, `prisma/models/project.prisma` with `Project` and `ProjectCollaborator` models (enums, relations, indexes, cascade delete, unique constraints), `lib/prisma.ts` cached singleton (Accelerate branch for `prisma+postgres://` URLs via `@prisma/extension-accelerate`, adapter-pg branch for direct connections), `@prisma/extension-accelerate` installed, first migration created and applied (`add_projects`)
- Feature: Project APIs — `app/api/projects/route.ts` (GET list + POST create) and `app/api/projects/[projectId]/route.ts` (PATCH rename + DELETE delete), Clerk `auth()` for owner identification, 401 for unauthenticated, 403 for non-owner mutations, 404 for missing projects, default name "Untitled Project" on create, name required on rename, all endpoints tested via `npm run build`
- Feature: Wire Editor Home — `app/editor/page.tsx` converted to server component; `app/editor/editor-shell.tsx` client wrapper created; `lib/data/projects.ts` server-side data helper fetches owned + shared projects via Prisma (collaborator email match); `hooks/use-project-actions.ts` replaces old hook with create (POST + navigate to workspace with slug+suffix room ID), rename (PATCH + router.refresh), delete (DELETE + router.refresh); `components/editor/project-sidebar.tsx` now accepts real project data as props (no mock data); all three dialogs wired with mutation callbacks; `CreateProjectDialog` shows room ID preview; `RenameProjectDialog` Enter submits rename; `DeleteProjectDialog` shows project name; `lib/mock-data.ts` and `hooks/use-project-dialogs.ts` removed; `GET /api/projects` returns both owned and shared projects, `POST /api/projects` accepts optional `id` for room ID alignment

## Next Up

- Editor canvas and document management

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.
