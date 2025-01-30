import { Router } from "express";
const router = Router();
import { bookTicket } from "@/controllers/ticketControllers";

router.post("/bookTicket/:id", bookTicket);

export default router;
