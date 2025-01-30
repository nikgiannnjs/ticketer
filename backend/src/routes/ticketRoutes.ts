import { Router } from "express";
const router = Router();
import { holdTicket, webHookPayment } from "@/controllers/ticketControllers";
import { addRawBody } from "@/middleware/addRawBody";

router.post("/holdTicket/:id", holdTicket);
router.post("/webhook/payment", webHookPayment);

export default router;
