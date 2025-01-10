import mongoose from "mongoose";
import Document from "mongoose";

interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  status: string;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  name: { type: String, trim: true },
  email: { type: String, required: true, trim: true },
  passwordHash: { type: String, select: false },
  status: {
    type: String,
    enum: ["default", "requested", "active", "super-admin"],
    required: true,
    default: "default",
    trim: true,
  },
});

interface IGuest extends Document {
  email: string;
}

const guestSchema = new mongoose.Schema<IGuest>({
  email: { type: String, required: true, unique: true, trim: true },
});

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
const Guest = mongoose.model<IGuest>("Guest", guestSchema);

export { Admin, Guest, IAdmin, IGuest };
