import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Task, { IBaseTask } from '../models/Task.model';
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
    const seedTasks=[]
    for(const t of dummyData){
       const textToEmbed = `${t.title} ${t.description || ""}`;
      const embedding = await generateEmbedding(textToEmbed);

      const task: IBaseTask = {
        userId: user._id,
        taskDate: today,
        status: "pending",
        priority: t.priority,
        description_vector: embedding ?? [],
        title: t.title,
        description: t.description,
      };

      seedTasks.push(task);
    }

    await Task.insertMany(seedTasks);
    console.log(`Database seeded: User created and 3 tasks assigned.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

  async function generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(process.env.PYTHON_SERVICE_URI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error("Python AI Service Error:", error);
      throw error;
    }
  }

seedDatabase();

type DummyTask = {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
};

const dummyData:DummyTask[] = [
  // TECH & DEV CLUSTER
  { title: "Fix CSS Grid bug", description: "Alignment issue on the mobile dashboard sidebar.", priority: "medium" },
  { title: "Database Migration", description: "Move legacy user data to the new MongoDB cluster.", priority: "high" },
  { title: "Write Unit Tests", description: "Increase coverage for the Auth middleware logic.", priority: "low" },
  { title: "API Documentation", description: "Update Swagger docs for the vector search endpoints.", priority: "medium" },
  { title: "Dockerize Python Service", description: "Create a Dockerfile for the FastAPI embedding service.", priority: "high" },
  { title: "Refactor Redux Store", description: "Cleanup old state slices and implement RTK Query.", priority: "medium" },
  { title: "Optimize Image Assets", description: "Run squoosh on all landing page hero images.", priority: "low" },
  { title: "Security Audit", description: "Check for dependency vulnerabilities in package-lock.json.", priority: "high" },
  
  // PERSONAL & HEALTH CLUSTER
  { title: "Gym Session", description: "Focus on leg day and 20 minutes of cardio.", priority: "medium" },
  { title: "Buy Groceries", description: "Need almond milk, chicken, spinach, and coffee beans.", priority: "high" },
  { title: "Dentist Appointment", description: "Routine cleaning at 4 PM.", priority: "medium" },
  { title: "Meditation", description: "10 minutes of mindfulness before starting work.", priority: "low" },
  { title: "Call Parents", description: "Catch up on weekend plans.", priority: "low" },
  { title: "Meal Prep", description: "Prepare lunches for the upcoming work week.", priority: "medium" },

  // FINANCE & ADMIN CLUSTER
  { title: "Pay Electricity Bill", description: "Due by the 30th of this month.", priority: "high" },
  { title: "Review Monthly Budget", description: "Track spending in the Excel sheet.", priority: "medium" },
  { title: "Update Portfolio", description: "Add recent RAG project to personal website.", priority: "medium" },
  { title: "File Taxes", description: "Gather all 1099 forms and receipts.", priority: "high" }
  
];