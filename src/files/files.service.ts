import { Injectable } from '@nestjs/common';
import { Defaults } from '@prisma/client';
import {
  DefaultFileType,
  DefaultsService,
} from 'src/defaults/defaults.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly defaultService: DefaultsService,
    private readonly userService: UsersService,
  ) {}

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
}
