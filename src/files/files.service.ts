import { Injectable } from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) {}

  // EXAMPLE path - public/users/Francis James_Tolentino-francistolentino1107@gmail.com/Store-Details/2022-08-22-store-details.csv
  async setFileAsDefaultFileByID(id: number) {
    const defaultFile = await this.prismaService.file.update({
      where: {
        id: id,
      },
      data: {
        isDefault: true,
      },
    });

    return Promise.resolve(defaultFile);
  }

  async getSpecificFileByID(id: number): Promise<File> {
    return await this.prismaService.file.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getUserFileByType(id: number, type: string): Promise<File[]> {
    const files = await this.prismaService.file.findMany({
      where: {
        AND: {
          userId: id,
          type: type,
        },
      },
      orderBy: {
        datetime: 'desc',
      },
    });

    return files;
  }

  async getUserDefaultFilesByID(id: number): Promise<File[]> {
    const files = await this.prismaService.file.findMany({
      where: {
        AND: {
          userId: id,
          isDefault: true,
        },
      },
      orderBy: {
        datetime: 'desc',
      },
    });

    return files;
  }

  // EXAMPLE path - public/users/Francis James_Tolentino-francistolentino1107@gmail.com/Store-Details/2022-08-22-store-details.c
  async deleteUserFile(id: number): Promise<boolean> {
    try {
      await this.prismaService.file.delete({
        where: {
          id: id,
        },
      });
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

  async renameFile(id: number, name: string) {
    try {
      return await this.prismaService.file.update({
        where: {
          id: id,
        },
        data: {
          filename: name,
        },
      });
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async searchFile(filename: string) {
    return await this.prismaService.file.findMany({
      where: {
        filename: {
          contains: filename,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async deleteAllFilesOfUser(id: number) {
    return await this.prismaService.file.deleteMany({
      where: {
        userId: id,
      },
    });
  }
}
