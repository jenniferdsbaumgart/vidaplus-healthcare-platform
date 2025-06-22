import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', reportController.getAllReports);
router.get('/:id', (req, res, next) => {
	reportController.getReportById(req, res, next).catch(next);
});
router.post('/', reportController.createReport);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);

export default router;