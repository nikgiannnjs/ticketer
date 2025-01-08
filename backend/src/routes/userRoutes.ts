import {Router} from 'express';
const router = Router();
import {guestUserRegister} from '@/controllers/userControllers'

router.post('/guestRegister', guestUserRegister);

export default router;