import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token =req?.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token){
    res.status(401).json({ message: 'Not authorized' });
    return
  } 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};