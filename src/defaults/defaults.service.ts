import { Injectable } from '@nestjs/common';
import { Defaults } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

export type DefaultFileType =
  | 'ACCOUNTS'
  | 'STORE_DETAILS'
  | 'TRANSACTIONS'
  | 'EXPIRATION_DATES'
  | 'INVENTORY'
  | 'ATTENDANCE'
  | 'OTHERS';

@Injectable()
export class DefaultsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async setUserDefaultFileByUUID(
    uuid: string,
    type: DefaultFileType,
    path: string,
  ): Promise<Defaults> {
    const user = await this.userService.findUserByUUID(uuid);
    const defaultFile = await this.prismaService.defaults.findFirst({
      where: {
        AND: {
          userId: user.id,
          type: type,
        },
      },
    });

    if (!defaultFile) {
      const createdFile = await this.prismaService.defaults.create({
        data: {
          path,
          userId: user.id,
          type: type,
        },
      });
      return Promise.resolve(createdFile);
    }

    const updatedFile = await this.prismaService.defaults.update({
      where: {
        id: defaultFile.id,
      },
      data: {
        path: path,
      },
    });

    return Promise.resolve(updatedFile);
  }
}
