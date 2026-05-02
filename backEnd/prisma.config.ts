// prisma.config.ts — Prisma v7 configuration
// The datasource URL is managed here instead of in schema.prisma
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
 url: process.env['DIRECT_URL']

  },
});
