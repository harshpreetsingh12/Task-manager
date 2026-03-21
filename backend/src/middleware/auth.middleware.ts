import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token =req?.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};