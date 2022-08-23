import { Injectable } from '@nestjs/common';
import { Defaults, Prisma } from '@prisma/client';
import { join } from 'path';
import * as fs from 'fs';
import {
  DefaultFileType,
  DefaultsService,
} from 'src/defaults/defaults.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly defaultService: DefaultsService,
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  // EXAMPLE path - public/users/Francis James_Tolentino-francistolentino1107@gmail.com/Store-Details/2022-08-22-store-details.csv
  async setUserDefaultFileByUUID(
    uuid: string,
    path: string,
    type: DefaultFileType,
  ) {
    const defaultFile = await this.defaultService.setUserDefaultFileByUUID(
      uuid,
      type,
      path,
    );

    return Promise.resolve(defaultFile);
  }

  async getUserDefaultFilesByID(id: number): Promise<Defaults[]> {
    const user = await this.userService.findUserByID(id);
    return Promise.resolve(user.Defaults);
  }

  // EXAMPLE path - public/users/Francis James_Tolentino-francistolentino1107@gmail.com/Store-Details/2022-08-22-store-details.c
  async deleteUserFile(path: string): Promise<boolean> {
    const finalPath = join(__dirname, '..', '..', path);
    try {
      fs.unlinkSync(finalPath);
      return Promise.resolve(true);
    } catch (e) {
      console.error(e);
      return Promise.resolve(false);
    }
  }

  async addFile(data: Prisma.FileUncheckedCreateInput) {
    try {
      return await this.prismaService.file.create({
        data: data,
        include: {
          user: true,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async removeFileAsDefault(where: any) {
    try {
      return await this.prismaService.file.updateMany({
        where: where,
        data: {
          isDefault: false,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async readFile(path: string) {
    return Promise.resolve(fs.readFileSync(path));
  }
}
