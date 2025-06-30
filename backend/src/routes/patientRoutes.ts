// src/routes/patientRoutes.ts
import { Router } from 'express';
import {
  getAllPatients,
  getPatientById,
  getPatientByUserId,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getAllPatients);
import { RequestHandler } from 'express';

router.get('/:id', getPatientById as RequestHandler);
router.get("/user/:userId", getPatientByUserId);
router.post('/', createPatient as RequestHandler);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
