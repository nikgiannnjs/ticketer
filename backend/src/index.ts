import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from './db/dbConnection';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

db();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello World!!" });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
}); 
