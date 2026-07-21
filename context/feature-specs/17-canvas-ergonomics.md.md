Add a floating control bar for zoom and undo/redo, then wire the same actions to keyboard shortcuts.

## Implementation

1. Add a pill-shaped control bar at the bottom-left of the canvas.

   It should sit above the shape panel and include two groups:
   - zoom controls: zoom out, fit view, zoom in
   - history controls: undo, redo

   Separate the two groups with a thin divider.

2. Wire the zoom controls to the React Flow instance.
   - zoom in
   - zoom out
   - fit view
   - use a short animation so the movement feels smooth

3. Wire undo and redo to Liveblocks history.
   - use the existing Liveblocks undo/redo hooks
   - disable undo when there is nothing to undo
   - disable redo when there is nothing to redo
   - keep disabled buttons visually dimmed

4. Create a `useKeyboardShortcuts` hook in `hooks/`.

   The hook should:
   - receive the React Flow instance
   - receive undo and redo handlers
   - listen for keyboard shortcuts on `window`
   - ignore shortcuts while typing in inputs, textareas, or editable text fields

5. Support these shortcuts and precedence rules:
   - Unmodified presses of `+`, `=` (zoom in) and `-` (zoom out) should trigger canvas zoom. These zoom handlers should call `preventDefault()` to avoid the browser's page zoom where appropriate.
   - Cmd/Ctrl-based shortcuts take precedence: `Cmd/Ctrl + Z` (undo), `Cmd/Ctrl + Shift + Z` (redo), `Cmd/Ctrl + Y` (redo) should be detected before unmodified handlers. Undo/redo handlers MUST call `preventDefault()` to avoid triggering browser history navigation.
   - The hook should ignore shortcuts while typing in inputs, textareas, or editable text fields.

## Scope Limits

- don’t change the shape panel
- don’t change node or edge rendering
- don’t add extra canvas controls
- don’t change the existing collaborative state setup

## Check When Done

- Control bar is added to the canvas.
- Zoom actions use the React Flow instance.
- Undo and redo use Liveblocks history.
- Keyboard shortcuts are handled in `hooks/useKeyboardShortcuts`.
- Shortcut handling skips editable fields.
- `npm run build` passes.
