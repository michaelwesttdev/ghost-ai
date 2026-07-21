import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <Link
        href="/editor"
        className="rounded-lg border border-border bg-elevated px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-subtle"
      >
        Open Editor
      </Link>
    </div>
  );
}
