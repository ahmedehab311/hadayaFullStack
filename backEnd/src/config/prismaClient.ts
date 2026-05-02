import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });
}

const prisma: PrismaClient =
  global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;