import { Router } from "express";
import { createNewVenue } from "@/controllers/userControllers";
import { adminCheck } from "@/middleware/adminAccessOnly";
import { validTokenCheck } from "@/middleware/validTokenCheck";

const router = Router();

router.post("/createNewVenue/:id", adminCheck, validTokenCheck, createNewVenue);

export default router;
