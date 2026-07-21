Implement the full AI design agent so a user prompt results in real-time updates on the collaborative canvas, with visible AI presence and status.

## Implementation

1. Update the design agent task in `trigger/design-agent.ts`.

   Before implementing:
   - check `context/project-overview.md` and `context/architecture-context.md` for product behavior and system rules
     -Before implementing, check Liveblocks and Trigger.dev agent skills for current patterns on canvas mutation and background task execution.
   - follow the existing Trigger.dev setup and agent patterns already in the project
   - reuse existing Liveblocks flow and presence patterns instead of creating new ones

   Then implement:
   - use Gemini (`@ai-sdk/google`) to interpret the user prompt
   - update the canvas using the existing collaborative flow utilities
   - support actions like:
     - add node
     - move node
     - resize node
     - update node data
     - delete node
     - add edge
     - delete edge

   - publish AI activity to the shared status feed so all users see progress
   - update AI presence (cursor + thinking state) while the task runs
   - push clear status messages at key steps (start, processing, complete)

   - ensure generated designs follow:
     - allowed node shapes
     - color palette
     - layout and spacing rules

   - handle errors gracefully and update status if something fails
   - clear AI presence when the task finishes

Schema and validation

- Define a strict Gemini action response schema that the agent must return. For example:

  ```json
  {
    "actions": [
      {"type": "addNode", "id": "string", "shape": "rectangle|circle|...", "x": number, "y": number, "width": number, "height": number, "data": { /* validated */ }},
      {"type": "updateNode", "id": "string", "data": { /* validated */ }},
      {"type": "removeNode", "id": "string"},
      {"type": "addEdge", "id": "string", "source": "string", "target": "string"},
      {"type": "removeEdge", "id": "string"}
    ]
  }
  ```

- Validate the complete response before applying any changes: check IDs reference existing or well-formed node/edge IDs, ensure shapes, colors, and dimensions are supported, and reject payloads that exceed an allowed action count or contain unsupported types.
- Only apply fully validated actions to Liveblocks state; do not apply partial or unvalidated actions.

## Dependencies

All packages are already installed.`GOOGLE_AI_API_KEY` is already in `.env.local`.

## Scope Limits

- don’t change canvas architecture
- don’t introduce a new state system outside Liveblocks
- don’t bypass existing collaborative flow utilities

## Check When Done

- Design task updates the canvas through the existing collaborative flow.
- AI presence and status are visible to all participants.
- Status messages reflect task progress.
- Errors are handled without breaking the canvas.
- `npm run build` passes.
