import mongoose from "mongoose";
import { Document, Types, Schema } from "mongoose";

interface ITicket extends Document {
  venue: Types.ObjectId;
  status: string;
  qrImage: string;
  price: Number;
  purchaseDate: Date;
  user: string;
  email: string;
}

const ticketSchema = new mongoose.Schema<ITicket>({
  venue: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
  status: {
    type: String,
    enum: ["available", "bought", "on hold"],
    default: "available",
  },
  qrImage: { type: String },
  price: { type: Number, required: true },
  purchaseDate: { type: Date },
  user: { type: String, required: true },
  email: { type: String, required: true, trime: true },
});

const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;
