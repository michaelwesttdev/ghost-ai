import { getProjectsData } from "@/lib/data/projects"
import { EditorShell } from "./editor-shell"

export default async function EditorPage() {
  const { owned, shared } = await getProjectsData()

  return <EditorShell ownedProjects={owned} sharedProjects={shared} />
}
