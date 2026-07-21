import { auth, currentUser } from "@clerk/nextjs/server"
import { checkProjectAccess } from "@/lib/project-access"
import { liveblocks, getCursorColor } from "@/lib/liveblocks"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { room?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const roomId = body.room?.trim()
  if (!roomId) {
    return Response.json({ error: "room is required" }, { status: 400 })
  }

  const { project, hasAccess } = await checkProjectAccess(roomId)
  if (!project || !hasAccess) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const user = await currentUser()
  const name =
    user
      ? [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.emailAddresses?.[0]?.emailAddress ||
        "Anonymous"
      : "Anonymous"
  const avatar = user?.imageUrl ?? ""
  const color = getCursorColor(userId)

  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: ["room:write"],
  })

  const { status, body: tokenBody } = await liveblocks.identifyUser(
    {
      userId,
      groupIds: [],
    },
    {
      userInfo: {
        name,
        avatar,
        color,
      },
    }
  )

  return new Response(tokenBody, { status })
}
