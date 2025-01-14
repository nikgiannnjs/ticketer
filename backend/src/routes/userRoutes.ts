import { Router } from "express";
const router = Router();
import {
  guestUserRegister,
  adminUserRegister,
  login,
  requestAccess,
  acceptRequest,
  logout,
} from "@/controllers/authControllers";
import { adminCheck } from "@/middleware/adminAccessOnly";
import { superAdminCheck } from "@/middleware/superAdminAccessOnly";
import { validTokenCheck } from "@/middleware/validTokenCheck";

router.post("/guestRegister", guestUserRegister);
router.post("/adminRegister/:id", adminCheck, adminUserRegister);
router.post("/login/:id", adminCheck, login);
router.post("/requestAccess", requestAccess);
router.post("/acceptRequest/:id", superAdminCheck, acceptRequest);
router.post("/logout", validTokenCheck, logout);
export default router;
