import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// 3. Routes
app.get('/', (req, residences) => {
  residences.send('Smart Task Manager API is running...');
});

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});