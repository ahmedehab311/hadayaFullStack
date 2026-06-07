import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import { notFound } from './middlewares/notFound';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import menuRoutes from './routes/menuRoutes';
import collectionRoutes from './routes/collectionRoutes';
import settingRoutes from './routes/settingRoutes';
import addressRoutes from './routes/addressRoutes';
import orderRoutes from './routes/orderRoutes';
import { apiLimiter } from './middlewares/rateLimiter';
import { verifyApiKey } from './middlewares/apiKey';
import dashboardRoutes from './routes/dashboardRoutes';
const app: Application = express();
// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api-key'],
  })
);
// ─── Rate Limiting (على كل الـ /api) 

app.use('/api', apiLimiter);
app.use('/api', verifyApiKey);
// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
