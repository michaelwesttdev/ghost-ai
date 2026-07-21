import { Liveblocks } from "@liveblocks/node"

const CURSOR_COLORS = [
  "#FF6B6B",
  "#51CF66",
  "#339AF0",
  "#F06595",
  "#FF922B",
  "#20C997",
  "#845EF7",
  "#FFD43B",
  "#22B8CF",
  "#E599F7",
  "#FAB005",
  "#5C7CFA",
]

export function getCursorColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length]
}

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined
}

export const liveblocks =
  globalForLiveblocks.liveblocks ??
  new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
  })

if (process.env.NODE_ENV !== "production") {
  globalForLiveblocks.liveblocks = liveblocks
}
