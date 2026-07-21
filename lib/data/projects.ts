import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { Project } from "@/lib/types"

export type ProjectData = Project

export async function getProjectsData() {
  const { userId } = await auth()
  if (!userId) return { owned: [] as ProjectData[], shared: [] as ProjectData[] }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress

  const select = { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true }

  const [owned, shared] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select,
    }),
    email
      ? prisma.project.findMany({
          where: {
            collaborators: { some: { email } },
            ownerId: { not: userId },
          },
          orderBy: { updatedAt: "desc" },
          select,
        })
      : [],
  ])

  return { owned, shared }
}
