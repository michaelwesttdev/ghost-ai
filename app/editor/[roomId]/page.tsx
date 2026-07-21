import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { checkProjectAccess } from "@/lib/project-access"
import { getProjectsData } from "@/lib/data/projects"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import { AccessDenied } from "@/components/editor/access-denied"

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { project, hasAccess } = await checkProjectAccess((await params).roomId)

  if (!project || !hasAccess) {
    return <AccessDenied />
  }

  const { owned, shared } = await getProjectsData()

  return (
    <WorkspaceShell
      project={project}
      roomId={(await params).roomId}
      ownedProjects={owned}
      sharedProjects={shared}
    />
  )
}
