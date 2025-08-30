import { PrismaClient, User } from '@prisma/client';
import argon2 from 'argon2';
import { RegisterInput, LoginInput } from '../types';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const userService = {
  async register(userData: RegisterInput): Promise<Omit<User, 'password'>> {
    const hashedPassword = await argon2.hash(userData.password);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  async login(credentials: LoginInput): Promise<{ user: Omit<User, 'password'>; token: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user || !(await argon2.verify(user.password, credentials.password))) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
    //   token: require('../utils/jwt').generateToken({ id: user.id, email: user.email }),
        token: generateToken({ id: user.id, email: user.email }),

    };
  },

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async updateAvatar(userId: string, avatarUrl: string): Promise<Omit<User, 'password'>> {
    return prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};