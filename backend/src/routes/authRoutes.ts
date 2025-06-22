import { register, login, getMe } from '../controllers/authController';
import { Router } from 'express';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);

export default router;