import { PrismaClient } from '@prisma/client';

// Mencegah multiple instances Prisma di mode development saat hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasource: {
    url: "file:../prisma/dev.db"
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
