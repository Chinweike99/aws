import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
      const authHeader = req.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};