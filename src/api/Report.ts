import reportController from '../controller/reportController';
import { Router } from 'express';
import { body } from 'express-validator';
import { verifyToken, isModerator } from '../middlewares/authJWT'

const router = Router();
//[verifyToken, isModerator],
router.post('/report', reportController.addReport);
router.get('/', reportController.getReports);
router.get('/:id_report', reportController.getReport);

router.delete('/:id', reportController.deleteReport);
export default router;