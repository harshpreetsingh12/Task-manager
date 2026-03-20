import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}));
app.use(express.json()); 

// 2. Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas',MONGODB_URI))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Mounting different routes with prefix 
app.use('/api/auth', authRoutes);

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});