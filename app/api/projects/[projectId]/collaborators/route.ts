import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

async function checkOwnership(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  if (!project) return { project: null, isOwner: false }
  return { project, isOwner: project.ownerId === userId }
}

async function enrichCollaborators(
  collaborators: { id: string; email: string; createdAt: Date }[]
) {
  if (collaborators.length === 0) return []

  const client = await clerkClient()
  const emails = collaborators.map((c) => c.email)
  const clerkUsers = await client.users.getUserList({
    emailAddress: emails,
    limit: emails.length,
  })

  const userByEmail = new Map<string, { firstName: string | null; lastName: string | null; imageUrl: string }>()
  for (const u of clerkUsers.data) {
    for (const e of u.emailAddresses) {
      userByEmail.set(e.emailAddress, {
        firstName: u.firstName,
        lastName: u.lastName,
        imageUrl: u.imageUrl,
      })
    }
  }

  return collaborators.map((c) => {
    const clerk = userByEmail.get(c.email)
    const displayName = clerk
      ? [clerk.firstName, clerk.lastName].filter(Boolean).join(" ") || c.email
      : c.email
    return {
      id: c.id,
      email: c.email,
      displayName,
      avatarUrl: clerk?.imageUrl ?? null,
      createdAt: c.createdAt,
    }
  })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const { project, isOwner } = await checkOwnership(projectId, userId)
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, createdAt: true },
  })

  const enriched = await enrichCollaborators(collaborators)

  return Response.json({ collaborators: enriched, isOwner })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const { project, isOwner } = await checkOwnership(projectId, userId)
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  if (!isOwner) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  })
  if (existing) {
    return Response.json({ error: "Already a collaborator" }, { status: 409 })
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: { projectId, email },
    select: { id: true, email: true, createdAt: true },
  })

  return Response.json({ collaborator }, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const { project, isOwner } = await checkOwnership(projectId, userId)
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  if (!isOwner) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  })
  if (!existing) {
    return Response.json({ error: "Collaborator not found" }, { status: 404 })
  }

  await prisma.projectCollaborator.delete({
    where: { projectId_email: { projectId, email } },
  })

  return new Response(null, { status: 204 })
}
