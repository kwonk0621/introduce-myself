import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
const isDatabaseConfigured = !!(databaseUrl && databaseUrl !== '' && !databaseUrl.includes('localhost:51213'));

export const prisma = globalForPrisma.prisma || 
  (isDatabaseConfigured 
    ? new PrismaClient() 
    : null);

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
