import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { Project } from "@/lib/types"

export async function getCurrentIdentity() {
  const { userId } = await auth()
  if (!userId) return { userId: null, email: null }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null

  return { userId, email }
}

export async function checkProjectAccess(roomId: string) {
  const { userId, email } = await getCurrentIdentity()
  if (!userId) return { project: null, hasAccess: false }

  const select = { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true }

  console.log("roomId", roomId)

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    select: {
      ...select,
      collaborators: {
        where: email ? { email } : { email: "" },
        select: { id: true },
      },
    },
  })

  if (!project) return { project: null, hasAccess: false }

  const isOwner = project.ownerId === userId
  const isCollaborator = project.collaborators.length > 0

  const { collaborators, ...projectData } = project

  return { project: projectData as Project, hasAccess: isOwner || isCollaborator }
}
