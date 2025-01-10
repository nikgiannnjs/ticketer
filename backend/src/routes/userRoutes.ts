import { Router } from "express";
const router = Router();
import {
  guestUserRegister,
  adminUserRegister,
  login,
  requestAccess,
  acceptRequest,
} from "@/controllers/authControllers";

router.post("/guestRegister", guestUserRegister);
router.post("/adminRegister", adminUserRegister);
router.post("/login/:id", login);
router.post("/requestAccess", requestAccess);
router.post("/acceptRequest/:id", acceptRequest);

export default router;
