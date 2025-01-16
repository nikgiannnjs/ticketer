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
import { superAdminCheck } from "@/middleware/superAdminAccessOnly";

router.post("/guestRegister", guestUserRegister);
router.post("/adminRegister", adminCheck, adminUserRegister);
router.post("/login", adminCheck, login);
router.post("/requestAccess", requestAccess);
router.post("/acceptRequest/:id", superAdminCheck, acceptRequest);

export default router;
