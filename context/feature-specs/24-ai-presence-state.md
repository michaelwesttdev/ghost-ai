Add shared AI activity indicators so everyone in the room can see when generation is in progress. This unit is only for UI, presence, and realtime status signals. Do not add the actual AI generation flow yet.

## Implementation

1. Add AI thinking state to the sidebar.
   - show a small status indicator when AI is working
   - make the status visible to everyone in the room
   - disable the chat input and send button only for the user who initiated the current run; other participants should retain the ability to send messages (the UI should still show the shared running indicator)
   - show a loading state on the initiating user's send button
   - keep the rest of the sidebar usable for others

2. Add a shared AI status feed.
   - check the existing Liveblocks setup and installed agent-related features first
   - follow Liveblocks best practices for feeds/presence instead of creating parallel realtime state
   - create or reuse a Liveblocks feed named `ai-status-feed`
   - subscribe to the latest feed message in the sidebar
   - show only the most recent status message
   - keep the feed generic enough for design and spec generation later

3. Add status message validation.
   - define the feed payload schema in `types/tasks.ts`
   - use a discriminated, server-validated status shape that includes `runId` (string), `phase` (e.g. `started|processing|completed|failed|stale`), and a server-generated `timestamp` (ISO 8601 string). Optional `text` may be present for human-readable messages.
   - validate the complete incoming payload on the server and client before displaying it

4. Add thinking indicators to live cursors.
   - when a participant has `thinking: true` in presence, show a small spinner in their cursor name badge
   - hide the spinner when `thinking` is false or missing

## Scope Limits

- don’t add actual AI generation logic
- don’t trigger background tasks yet
- don’t block or dim the whole sidebar
- don’t show full feed history
- keep this focused on shared AI activity state only

## Check When Done

- Sidebar can render shared AI status from `ai-status-feed`.
- Chat input and send button respond to active generation state.
- Cursor badges read `thinking` from presence.
- Feed messages are validated through the task schema.
- `npm run build` passes.
