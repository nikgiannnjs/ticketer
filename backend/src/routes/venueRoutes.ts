import { Router } from "express";
import {
  createNewVenue,
  signedUrls,
  allVenues,
} from "@/controllers/userControllers";
import { validTokenCheck } from "@/middleware/validTokenCheck";

const router = Router();

router.post("/createNewVenue", validTokenCheck, createNewVenue);
router.get("/getSignedUrls", validTokenCheck, signedUrls);
router.get("/getAllVenues", allVenues);

export default router;
