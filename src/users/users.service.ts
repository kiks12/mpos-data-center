import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUser(email: string) {
    return this.prisma.user.findFirst({
      where: {
        emailAddress: email,
      },
      include: {
        Files: true,
      },
    });
  }

  async findUserByID(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id: id,
      },
      include: {
        Files: true,
      },
    });
  }

  async findUserByUUID(uuid: string) {
    return this.prisma.user.findFirst({
      where: {
        apiKey: uuid,
      },
      include: {
        Files: true,
      },
    });
  }

  async setAPIKey(uuid: string, id: number): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        apiKey: uuid,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: data,
      include: {
        Files: true,
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async changeUserPassword(id: number, password: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: password,
      },
    });
  }
}
