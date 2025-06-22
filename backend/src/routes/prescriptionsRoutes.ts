import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} from '../controllers/prescriptionController';

const router = Router();

router.use(authenticate);

router.get('/', getAllPrescriptions);
router.get('/:id', getPrescriptionById);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;