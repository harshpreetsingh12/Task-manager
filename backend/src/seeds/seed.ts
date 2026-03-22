import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Task from '../models/Task.model';
import User from '../models/User.model';
import dotenv from 'dotenv';

dotenv.config();

const SEED_USER = {
  email: 'test@gmail.com',
  password: 'test123', // Raw password for the script 
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB for seeding...');

    // Create or Update the Test User
    const hashedPassword = await bcrypt.hash(SEED_USER.password, 10);
    
    const user = await User.findOneAndUpdate(
      { email: SEED_USER.email },
      { 
        name:'Test User',
        email: SEED_USER.email, 
        password: hashedPassword 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Test user ${user.email} is ready.`);

    // Clear existing tasks for this user
    await Task.deleteMany({ userId: user._id });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Create the Sample Tasks
    const seedTasks = [
      {
        userId: user._id,
        title: 'Complete Rubico Tech Task',
        description: 'Finalize the seed script and technical documentation.',
        priority: 'high',
        taskDate: today,
        status: 'pending'
      },
      {
        userId: user._id,
        title: 'Review System Architecture',
        description: 'Prepare to explain the ESM pivot and SSE streaming logic.',
        priority: 'high',
        taskDate: today,
        status: 'pending'
      },
      {
        userId: user._id,
        title: 'Implement Smart Search (Phase 2)',
        description: 'Next steps: MongoDB Atlas Vector Search and Gemini embeddings.',
        priority: 'medium',
        taskDate: today,
        status: 'pending'
      }
    ];

    await Task.insertMany(seedTasks);
    console.log(`Database seeded: User created and 3 tasks assigned.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();