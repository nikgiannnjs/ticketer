import mongoose from "mongoose";
import Document from 'mongoose';

interface IAdmin extends Document{
    name: String;
    email: String;
    passwordHash: String;
    role: String;
    createdAt: Date;
    updatedAt: Date;
    passwordUpdatedAt: Date;
}


const adminSchema = new mongoose.Schema<IAdmin>({
    name: {type: String , required: true },
    email: {type: String , required: true , unique: true},
    passwordHash: {type: String , required: true },
    role: {type: String , required: true },
    createdAt: {type: Date , default: Date.now },
    updatedAt: {type: Date , default: Date.now},
    passwordUpdatedAt: {type: Date}
});

interface IGuest extends Document {
    email: String
}

const guestSchema = new mongoose.Schema<IGuest>({
    email: {type: String , required: true , unique: true}
});

const Admin = mongoose.model<IAdmin>('Admin' , adminSchema);
const Guest = mongoose.model<IGuest>('Guest' , guestSchema);

export {Admin, Guest};