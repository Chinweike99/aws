import { PrismaClient, Todo } from '@prisma/client';
import { CreateTodoInput, UpdateTodoInput } from '../types';

const prisma = new PrismaClient();

export const todoService = {
  async createTodo(userId: string, todoData: CreateTodoInput): Promise<Todo> {
    return prisma.todo.create({
      data: {
        ...todoData,
        userId,
      },
    });
  },

  async getTodos(userId: string, page: number = 1, limit: number = 10, completed?: boolean) {
    const skip = (page - 1) * limit;
    const where = { userId, ...(completed !== undefined && { completed }) };

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.todo.count({ where }),
    ]);

    return {
      todos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getTodoById(id: string, userId: string): Promise<Todo | null> {
    return prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  async updateTodo(id: string, userId: string, updateData: UpdateTodoInput): Promise<Todo> {
    return prisma.todo.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteTodo(id: string, userId: string): Promise<void> {
    await prisma.todo.deleteMany({
      where: {
        id,
        userId,
      },
    });
  },

  async toggleTodo(id: string, userId: string): Promise<Todo> {
    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    return prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });
  },
};