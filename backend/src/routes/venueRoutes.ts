import { Router } from "express";
import { createNewVenue, signedUrls } from "@/controllers/userControllers";
import { adminCheck } from "@/middleware/adminAccessOnly";
import { validTokenCheck } from "@/middleware/validTokenCheck";

const router = Router();

router.post("/createNewVenue", validTokenCheck, createNewVenue);
router.post("/signedUrls", validTokenCheck, signedUrls);

export default router;
