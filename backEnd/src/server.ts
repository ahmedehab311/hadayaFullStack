import express from 'express';
import app from './app';
import { env } from './config/env';

const server = express();
const PORT = env.PORT;

server.use('/api', app);

server.listen(PORT, () => {
  console.log(`🚀 Local: http://localhost:${PORT}/api`);
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});