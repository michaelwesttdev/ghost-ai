import { Project } from "./types"

export const mockCurrentUserId = "user-1"

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Urban Fantasy Novel",
    slug: "urban-fantasy-novel",
    ownerId: "user-1",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-06-20"),
  },
  {
    id: "proj-2",
    name: "Sci-Fi Short Story Collection",
    slug: "sci-fi-short-story-collection",
    ownerId: "user-1",
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-07-01"),
  },
  {
    id: "proj-3",
    name: "Collaborative Poetry Anthology",
    slug: "collaborative-poetry-anthology",
    ownerId: "user-2",
    createdAt: new Date("2026-02-20"),
    updatedAt: new Date("2026-06-15"),
  },
  {
    id: "proj-4",
    name: "Mystery Novel Outline",
    slug: "mystery-novel-outline",
    ownerId: "user-3",
    createdAt: new Date("2026-04-05"),
    updatedAt: new Date("2026-05-30"),
  },
]
