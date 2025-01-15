import { Router } from "express";
import { createNewVenue, updateVenue } from "@/controllers/userControllers";
import { adminCheck } from "@/middleware/adminAccessOnly";
import { validTokenCheck } from "@/middleware/validTokenCheck";

const router = Router();

router.post("/createNewVenue/:id", adminCheck, validTokenCheck, createNewVenue);
router.post("/updateVenue", adminCheck, validTokenCheck, updateVenue);

export default router;
