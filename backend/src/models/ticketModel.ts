import mongoose from "mongoose";
import { Document, Types, Schema } from "mongoose";

interface ITicket extends Document {
  venue: Types.ObjectId;
  status: string;
  qrImage: string;
  price: Number;
  purchaseDate: Date;
  user: Types.ObjectId;
  createdAt: Date;
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
  user: { type: Schema.Types.ObjectId, ref: "Guest" },
  createdAt: { type: Date },
});

const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;
