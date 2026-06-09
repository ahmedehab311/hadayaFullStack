// import app from './app';
// import { env } from './config/env';

// const PORT = env.PORT;

// app.listen(PORT, () => {
//   console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
// });
process.on('uncaughtException', (err) => {
  console.error('❌ uncaughtException:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ unhandledRejection:', reason);
  process.exit(1);
});

import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});