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

EXPOSE 7860
ENV PORT=7860
ENV NODE_ENV=production

CMD ["node", "-e", "\
console.log('=== START ===');\
console.log('PORT:', process.env.PORT);\
console.log('NODE_ENV:', process.env.NODE_ENV);\
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);\
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);\
console.log('API_KEY exists:', !!process.env.API_KEY);\
try { require('./dist/server.js'); console.log('=== SERVER LOADED ==='); }\
catch(e) { console.error('=== CRASH ===', e.message, e.stack); process.exit(1); }\
"]