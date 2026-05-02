import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
