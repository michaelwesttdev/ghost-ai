Create the backend flow for AI-powered spec generation: API route, Trigger.dev task, token route, and run ownership tracking.

### Implementation

1. Spec trigger route

Create or update `POST /api/ai/spec`.

It should:

- accept `roomId`, `chatHistory`, `nodes`, and `edges`
- authenticate the current user
- resolve project access from `roomId`
- persist a `TaskRun` ownership record before triggering when possible: create a `TaskRun` in a pending state tied to the authenticated user and an idempotency key so the run can be queried and owned immediately
- trigger the `generate-spec` task and update the `TaskRun` with the returned `runId` and status
- return the `runId` to the client

If triggering must occur before persisting (for example when a provider requires immediate trigger), record a durable idempotency key and implement compensation on retries: reconcile Trigger.dev runs and `TaskRun` records on retry so no orphaned runs or duplicate DB records remain. Always return the existing or newly created `runId` to the client.

Do not trust a client-supplied `projectId`.

2. Spec token route

Create or update `POST /api/ai/spec/token`.

It should:

- accept `runId`
- authenticate the current user
- verify the `TaskRun` belongs to the user
- issue a Trigger.dev public access token scoped to that run
- set token expiration to 1 hour
- return the token to the client

3. Spec generation task

Create or update `trigger/generate-spec.ts`.
Define a `generateSpec` task that:

- accepts `projectId`, `roomId`, `chatHistory`, `nodes`, and `edges`
- validates input with Zod
- uses Gemini through `@ai-sdk/google`
- generates a Markdown technical spec from the canvas and chat context
- updates run metadata/status for realtime tracking
- returns the generated spec content as task output

Follow the existing Trigger.dev task patterns in the codebase for retries, logging, and error handling.

### Scope Limits

- Do not add frontend logic
- Do not create spec editor UI
- Do not store the final spec in this unit
- Do not derive access from client-provided project IDs
- Do not create a new AI provider abstraction
- Do not change existing canvas or chat data models

### Notes

- Check `context/project-overview.md` and `context/architecture-context.md` for system alignment before implementing
- Use Zod for request/task input validation
- Use Prisma for `TaskRun` persistence
- Project access must come from the authenticated user + `roomId`
- Keep the task output as plain Markdown
- Reuse existing auth, Prisma, Trigger.dev, and Gemini patterns

### Check When Done

- `POST /api/ai/spec` validates input and returns a `runId`
- A `TaskRun` record is created for the authenticated user
- `POST /api/ai/spec/token` only returns a token for the run owner
- `generate-spec` runs through Trigger.dev and returns Markdown output
- TypeScript and build pass
