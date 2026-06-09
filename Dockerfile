FROM node:22-alpine

WORKDIR /app

COPY backEnd/package*.json ./

RUN npm install

COPY backEnd/src/ ./src/
COPY backEnd/prisma/ ./prisma/
COPY backEnd/tsconfig.json ./
COPY backEnd/prisma.config.ts ./

RUN npm run prisma:generate

RUN npm run build

RUN ls -la dist/

EXPOSE 7860
ENV PORT=7860
ENV NODE_ENV=production

CMD ["node", "dist/server.js"]