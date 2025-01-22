import { Router } from "express";
import { createNewVenue, signedUrls } from "@/controllers/userControllers";
import { validTokenCheck } from "@/middleware/validTokenCheck";

const router = Router();

router.post("/createNewVenue", validTokenCheck, createNewVenue);
router.get("/getSignedUrls", validTokenCheck, signedUrls);

export default router;
