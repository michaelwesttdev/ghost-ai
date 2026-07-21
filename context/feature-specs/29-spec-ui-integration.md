Integrate spec generation results into the editor so users can view, preview, and download specs from the existing ai sidebar specs tab.

### Implementation

1. Spec list

 in the right sidebar (Specs tab), show a list of specs for the current project
 fetch specs from the backend using a secured ProjectSpec list endpoint
 display:
  - createdAt
  - filename
 keep items simple and clickable

API contracts

- `GET /api/projects/[projectId]/specs`
  - auth: authenticated user required
  - query params: optional pagination (page, perPage)
  - response: `200 [{ id: string, filename: string, createdAt: string, runId?: string }]`

- `GET /api/projects/[projectId]/specs/[specId]`
  - auth: authenticated user required
  - response: `200 { id: string, filename: string, createdAt: string, filePath: string }` (metadata only)

- `GET /api/projects/[projectId]/specs/[specId]/content` (used by preview modal)
  - auth: authenticated user required
  - response: `200 { content: string, contentType: 'text/markdown' }` — server fetches the blob and returns the Markdown payload to the authorized client (no redirect to Blob URLs)

Clients MUST use these authorized endpoints rather than attempting to access Blob storage directly.

2. Preview modal

 open a modal when a spec is selected
 fetch the spec content through an authorized server endpoint (do not access Blob directly from the client)
 sanitize the rendered Markdown output: disable raw HTML, strip dangerous elements, and restrict links to safe URL protocols (`https`, `mailto`) before rendering
 include a close action and basic keyboard support

3. Download action

- add a download action for each spec (list item + modal)
- call the download endpoint
- let the browser handle the file download

### UI Details

- use existing sidebar layout, do not redesign
- use shadcn/ui components (Dialog, ScrollArea, Button)
- use existing colors and tokens from `global.css`
- follow `ui-context.md` for spacing and layout
- keep the list compact and scrollable

### Scope Limits

- do not implement backend logic
- do not fetch Blob URLs directly in the client
- do not store spec content in frontend state long-term
- do not redesign the sidebar or tabs
- do not add new global state

### Notes

- reuse existing fetch patterns used in the app
- assume ProjectSpec only provides metadata, content must be fetched separately

### Check When Done

- spec list loads for the current project
- modal shows rendered Markdown content
- download action triggers file download
- TypeScript and build pass
