import Link from "next/link"
import { Lock } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AccessDenied() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Lock className="size-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold text-foreground">Access Denied</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You don't have access to this project.
        </p>
      </div>
      <Link
        href="/editor"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Back to Editor
      </Link>
    </div>
  )
}
