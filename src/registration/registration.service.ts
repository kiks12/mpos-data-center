import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegistrationService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async createDirectory(folderName: string) {
    const directory = join(__dirname, '..', '..', 'public/users', folderName);
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
  }
}
