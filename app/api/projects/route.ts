import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress

  const [owned, shared] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
    }),
    email
      ? prisma.project.findMany({
          where: {
            collaborators: { some: { email } },
            ownerId: { not: userId },
          },
          orderBy: { updatedAt: "desc" },
          select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
        })
      : [],
  ])

  return Response.json({ owned, shared })
}

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { name?: string; id?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const name = body.name?.trim() || "Untitled Project"
  const projectId = body.id?.trim() || undefined

  const project = await prisma.project.create({
    data: {
      ...(projectId ? { id: projectId } : {}),
      ownerId: userId,
      name,
    },
    select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
  })

  return Response.json({ project }, { status: 201 })
}
