import './config/env';  
import cookieParser from 'cookie-parser';
import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import connectDB from './config/db';


const app: Application = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}));
app.use(express.json()); 
app.use(cookieParser());

// Database Connection
connectDB();

// Mounting different routes with prefix 
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);

// 4. Start Server
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`Production Server is live on port ${PORT}`);
  } else {
    console.log(`λ Local Server running at http://localhost:${PORT}`);
  }
});