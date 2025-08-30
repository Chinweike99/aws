import { Request, Response } from 'express';
// import { todoService } from '../services/todoService';
import { validateTodoTitle } from '../utils/validation';
import { CreateTodoInput, UpdateTodoInput, AuthRequest } from '../types';
import { todoService } from '../services/todoServices';

export const todoController = {
  async createTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const todoData: CreateTodoInput = req.body;

      if (!validateTodoTitle(todoData.title)) {
        res.status(400).json({ error: 'Title must be between 1 and 255 characters' });
        return;
      }

      const todo = await todoService.createTodo(userId, todoData);
      res.status(201).json({ message: 'Todo created successfully', todo });
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getTodos(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const completed = req.query.completed ? req.query.completed === 'true' : undefined;

      const result = await todoService.getTodos(userId, page, limit, completed);
      res.json(result);
    } catch (error) {
      console.error('Get todos error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const todo = await todoService.getTodoById(id, userId);
      
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json({ todo });
    } catch (error) {
      console.error('Get todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updateData: UpdateTodoInput = req.body;

      if (updateData.title && !validateTodoTitle(updateData.title)) {
        res.status(400).json({ error: 'Title must be between 1 and 255 characters' });
        return;
      }

      const todo = await todoService.updateTodo(id, userId, updateData);
      res.json({ message: 'Todo updated successfully', todo });
    } catch (error) {
      console.error('Update todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async deleteTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await todoService.deleteTodo(id, userId);
      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      console.error('Delete todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async toggleTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const todo = await todoService.toggleTodo(id, userId);
      res.json({ message: 'Todo toggled successfully', todo });
    } catch (error) {
      console.error('Toggle todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};