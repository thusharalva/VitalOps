// User Management Service
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateUser(userId: string, data: any) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        role: data.role,
        isActive: data.isActive,
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });
  }

  async deactivateUser(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
}



