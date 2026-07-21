import { PrismaClient } from "@/app/generated/prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

const databaseUrl = process.env.DATABASE_URL!

function createPrismaClient() {
  if (databaseUrl.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: databaseUrl }).$extends(withAccelerate())
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
