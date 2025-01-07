import mongoose from "mongoose";
import dotenv from "dotenv";

const db = () => {
    dotenv.config();
    
    if (!process.env.MONGO_URI) {
        throw new Error ('Mongo URI is undefined.')
    }
    
    const uri: string = process.env.MONGO_URI;

    mongoose.connect(uri);
    const database = mongoose.connection;
    
    database.on('error', (error) => {
        console.log('Database connection error:', error);
    });
    
    database.once('connected', () => {
        console.log('Database connected successfully');
    });    
}

export default db;




