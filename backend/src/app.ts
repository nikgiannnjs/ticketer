import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import venueRoutes from "./routes/venueRoutes";

const app = express();

// Handle raw body for webhook
app.use('/tickets/webhook/payment', express.raw({ type: 'application/json' }));

// Use JSON parser for all other routes
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl !== '/tickets/webhook/payment') {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use(cors());

app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use("/venues", venueRoutes);

export default app;
