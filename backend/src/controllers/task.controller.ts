import { Response } from 'express';
import Task from '../models/Task.model';

// create a New Task
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      userId: req.user.id, // Attached by auth middleware
      title,
      description,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get All User Tasks
export const getTasks = async (req: any, res: Response) => {
  try {
    // Only fetch tasks belonging to the logged-in user
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Delete a Task
export const deleteTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // Ensure the taskbelongs to the user before deleting
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

