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
    });
  }

  // async setAPIKey(uuid: string, id: number) {
  //   this.prisma.user.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       apiKey: uuid,
  //     }
  //   });
  // }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
