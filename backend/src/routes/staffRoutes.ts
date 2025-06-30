import { Router } from 'express';
import * as staffController from '../controllers/staffController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.get("/user/:userId", staffController.getStaffByUserId);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

export default router;