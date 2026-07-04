import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Force a new instance by ignoring the global cache once so it picks up the new Order model
export const db = globalThis.prisma ?? (() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
