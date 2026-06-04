# 1. Base Image
FROM node:22-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY backEnd/package*.json ./

# 4. Install dependencies (في Linux clean)
RUN npm install

# 5. Copy source code بس (مش node_modules!)
COPY backEnd/src/ ./src/
COPY backEnd/prisma/ ./prisma/
COPY backEnd/tsconfig.json ./

# 6. Generate Prisma Client
RUN npm run prisma:generate

# 7. Build TypeScript
RUN npm run build

# 8. Expose port
EXPOSE 7860
ENV PORT=7860
ENV NODE_ENV=production

# 9. Start
CMD ["npm", "start"]