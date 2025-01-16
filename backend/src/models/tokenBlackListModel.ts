import mongoose from "mongoose";
import type Document from "mongoose";

interface IBlackList extends Document {
  token: string;
  createdAt: Date;
}

const blackListSchema = new mongoose.Schema<IBlackList>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const BlackList = mongoose.model("Blacklist", blackListSchema);

export default BlackList;
