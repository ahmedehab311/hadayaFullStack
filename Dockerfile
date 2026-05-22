    # 1. Base Image
    FROM node:22-alpine

    # 2. Set working directory
    WORKDIR /app

    # 3. Copy package files from backEnd folder
    COPY backEnd/package*.json ./

    # 4. Install dependencies
    RUN npm install

    # 5. Copy the rest of the backend code
    COPY backEnd/ .

    # 6. Generate Prisma Client
    RUN npm run prisma:generate

    # 7. Build TypeScript project
    RUN npm run build

    # 8. Expose port 7860
    EXPOSE 7860
    ENV PORT=7860
    ENV NODE_ENV=production

    # 9. Start the server
    CMD ["npm", "start"]