import { Router } from 'express';
import * as telemedicineController from '../controllers/telemedicineController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', telemedicineController.getAllTelemedicine);
router.get('/:id', (req, res, next) => {
  telemedicineController.getTelemedicineById(req, res, next).catch(next);
});
router.post('/', telemedicineController.createTelemedicine);
router.put('/:id', telemedicineController.updateTelemedicine);
router.delete('/:id', telemedicineController.deleteTelemedicine);

export default router;