import {Router} from 'express';
const router = Router();
import {guestUserRegister, adminUserRegister} from '@/controllers/userControllers'

router.post('/guestRegister', guestUserRegister);
router.post('/adminRegister', adminUserRegister);

export default router;