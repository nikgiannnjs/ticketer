import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import venueRoutes from "./routes/venueRoutes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use("/venues", venueRoutes);

export default app;
