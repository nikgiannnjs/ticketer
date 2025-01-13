import { Router } from "express";
const router = Router();
import {
  guestUserRegister,
  adminUserRegister,
  login,
  requestAccess,
  acceptRequest,
} from "@/controllers/authControllers";
import { adminCheck } from "@/middleware/adminAccessOnly";

router.post("/guestRegister", guestUserRegister);
router.post("/adminRegister/:id", adminCheck, adminUserRegister);
router.post("/login/:id", adminCheck, login);
router.post("/requestAccess", requestAccess);
router.post("/acceptRequest/:id", acceptRequest);

export default router;
