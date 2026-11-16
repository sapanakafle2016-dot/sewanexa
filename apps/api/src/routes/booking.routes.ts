import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/', requireAuth, BookingController.createBooking);
router.get('/my', requireAuth, BookingController.getMyBookings);
router.get('/:id/tracking', requireAuth, BookingController.getTracking);
router.patch('/:id/provider-location', requireAuth, BookingController.updateProviderLocation);
router.patch('/:id/status', requireAuth, BookingController.updateStatus);
router.post('/review', requireAuth, BookingController.addReview);

export default router;

