import mongoose from "mongoose";
import Document from 'mongoose';

interface IAdmin extends Document{
    name: string;
    email: string;
    passwordHash: string;
    role: string;
}


const adminSchema = new mongoose.Schema<IAdmin>({
    name: {type: String , required: true },
    email: {type: String , required: true , unique: true},
    passwordHash: {type: String , required: true },
    role: {type: String , required: true }
});

interface IGuest extends Document {
    email: string
}

const guestSchema = new mongoose.Schema<IGuest>({
    email: {type: String , required: true , unique: true}
});

const Admin = mongoose.model<IAdmin>('Admin' , adminSchema);
const Guest = mongoose.model<IGuest>('Guest' , guestSchema);

export {Admin , Guest, IAdmin, IGuest};