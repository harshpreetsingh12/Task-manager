import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import connectDB from './config/db';

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

// Database Connection
connectDB();

// Mounting different routes with prefix 
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});