import { Request, Response } from 'express';
// import { userService } from '../services/userService';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { RegisterInput, LoginInput } from '../types';
import { userService } from '../services/userServices';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name }: RegisterInput = req.body;

      if (!validateEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      if (!validatePassword(password)) {
        res.status(400).json({ error: 'Password must be at least 8 characters long' });
        return;
      }

      if (!validateName(name)) {
        res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
        return;
      }

      const existingUser = await userService.findById(email);
      if (existingUser) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      const user = await userService.register({ email, password, name });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginInput = req.body;

      if (!validateEmail(email) || !validatePassword(password)) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }

      const result = await userService.login({ email, password });
      
      if (!result) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const user = await userService.findById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};