import {Router} from 'express';
const router = Router();
import {guestUserRegister, adminUserRegister, login} from '@/controllers/authControllers';

router.post('/guestRegister', guestUserRegister);
router.post('/adminRegister', adminUserRegister);
router.post('/login/:id', login);

export default router;