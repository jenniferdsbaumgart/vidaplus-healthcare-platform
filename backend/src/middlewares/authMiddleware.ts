import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    console.log("🪪 Decoded JWT payload:", decoded);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("🚨 Error verifying JWT:", error);
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};
