import { Router } from "express";
const router = Router();
import { holdTicket, webHookPayment } from "@/controllers/ticketControllers";

router.post("/holdTicket/:id", holdTicket);
router.post("/webhook/payment", webHookPayment);

export default router;
