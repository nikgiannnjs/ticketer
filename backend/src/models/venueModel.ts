import mongoose from 'mongoose';
import {Document, Types, Schema} from 'mongoose';

interface IVenue extends Document {
    title: string;
    description: string;
    country: string;
    city: string;
    address: string;
    datetime: Date;
    price: number;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
    image: string;
    admin: Types.ObjectId;    
}

const venueSchema = new mongoose.Schema<IVenue>({
    admin:{type: Schema.Types.ObjectId, ref: 'Admin', required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    address: {type: String, required: true},
    datetime: {type: Date, required: true},
    price: {type: Number, required: true},
    capacity: {type: Number, required: true},
    image: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

const Venue = mongoose.model<IVenue>("Venue" , venueSchema);

export default Venue;