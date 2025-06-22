import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getAllExams, getExamById, createExam, updateExam, deleteExam } from '../controllers/examController';

const router = Router();

router.use(authenticate);

router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;
