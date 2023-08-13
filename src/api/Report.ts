import { Router } from 'express';
import reportController from '../controller/reportController';

const router = Router();

router.post('/report', reportController.addReport);
router.get('/', reportController.getReports);
router.get('/:id_report', reportController.getReport);
router.delete('/:id', reportController.deleteReport);

export default router;