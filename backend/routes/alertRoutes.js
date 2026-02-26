import express from 'express';
import { 
  getAlerts, 
  createAlert, 
  markAsRead, 
  deleteAlert, 
  clearAlerts,
  getUnreadCount 
} from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAlerts)
  .post(createAlert)
  .delete(clearAlerts);

router.get('/unread/count', getUnreadCount);

router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteAlert);

export default router;
