import { Router } from "express";
import {
  createNewVenue,
  signedUrls,
  allVenues,
  getVenue,
} from "@/controllers/userControllers";
import { validTokenCheck } from "@/middleware/validTokenCheck";

const router = Router();

router.post("/createNewVenue", validTokenCheck, createNewVenue);
router.get("/getSignedUrls", validTokenCheck, signedUrls);
router.get("/getAllVenues", allVenues);
router.get("/getVenue/:id", getVenue);

export default router;
