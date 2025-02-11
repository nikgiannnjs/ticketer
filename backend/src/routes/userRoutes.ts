import { Router } from "express";
const router = Router();
import {
  guestUserRegister,
  adminUserRegister,
  login,
  requestAccess,
  acceptRequest,
  logout,
  getAccessRequests,
  rejectRequest,
} from "@/controllers/authControllers";
import { adminCheck } from "@/middleware/adminAccessOnly";
import { superAdminCheck } from "@/middleware/superAdminAccessOnly";
import { validTokenCheck } from "@/middleware/validTokenCheck";

router.post("/guestRegister", guestUserRegister);
router.post("/adminRegister", adminUserRegister);
router.post("/login", login);
router.post("/requestAccess", requestAccess);
router.get(
  "/getAccessRequests",
  validTokenCheck,
  superAdminCheck,
  getAccessRequests
);
router.post("/rejectRequest", validTokenCheck, superAdminCheck, rejectRequest);
router.post("/acceptRequest", validTokenCheck, superAdminCheck, acceptRequest);
router.post("/logout", validTokenCheck, logout);

router.post("/test-token", validTokenCheck, (req, res) => {
  res.status(200).json({ message: "Middleware passed." });
});
router.post("/test-admin", superAdminCheck, (req, res) => {
  res.status(200).json({ message: "Middleware passed." });
});

export default router;
