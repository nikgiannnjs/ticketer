import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users' , userRoutes);

export default app;

