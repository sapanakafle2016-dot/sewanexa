import http from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import apiRouter from './routes/index.js';
import { initSocketIO } from './sockets/socketHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:19006'],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({
    brand: 'SEWANEXA',
    tagline: 'Your Local Services, Connected.',
    company: 'Sangalo Tech Pvt. Ltd.',
    website: 'https://www.sangalotech.com',
    location: 'Lokanthali, Bhaktapur, Nepal',
    apiDocumentation: '/api/health',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api', apiRouter);

// Error handling middleware
app.use(errorHandler);

// Initialize Socket.IO
initSocketIO(httpServer, config.clientUrl);

// Start server
const startServer = async () => {
  await connectDB();

  httpServer.listen(config.port, () => {
    console.log(`
=============================================================
🚀 SEWANEXA API Server is running on port ${config.port}
📍 Environment: ${config.nodeEnv}
🇳🇵 Target Market: Nepal
🔗 Client URL: ${config.clientUrl}
💳 Payment Gateways: eSewa v2 & Khalti v2 Active
=============================================================
    `);
  });
};

startServer();

export { app, httpServer };

