import { Request, Response } from 'express';
import User, { IUser } from '../models/User.model'; 

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id:req.user.id });

    if (user) {

      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
