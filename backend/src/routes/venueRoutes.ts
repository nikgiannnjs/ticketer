import { Router } from "express";
import {
  createNewVenue,
  signedUrls,
  allVenues,
  getVenue,
  updateVenue,
  deleteVenue,
  searchVenue,
} from "@/controllers/userControllers";
import { validTokenCheck } from "@/middleware/validTokenCheck";

const router = Router();

router.post("/createNewVenue", validTokenCheck, createNewVenue);
router.get("/getSignedUrls", validTokenCheck, signedUrls);
router.get("/getAllVenues", allVenues);
router.get("/getVenue/:id", getVenue);
router.put("/updateVenue/:id", validTokenCheck, updateVenue);
router.delete("/deleteVenue/:id", validTokenCheck, deleteVenue);
router.post("/searchVenue", searchVenue);

export default router;
