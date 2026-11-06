import { Router } from 'express';
import authRoutes from './auth.routes.js';
import providerRoutes from './provider.routes.js';
import categoryRoutes from './category.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';
import adminRoutes from './admin.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/providers', providerRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/admin', adminRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SEWANEXA Backend API',
    region: 'Nepal (NPT)',
  });
});

export default apiRouter;

