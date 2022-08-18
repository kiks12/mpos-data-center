import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import * as fs from 'fs';
import { join } from 'path';
import { createDirectoryName } from './utils/directory';

@Injectable()
export class AppService {
  constructor(private readonly userService: UsersService) {}

  async getUserFullNameByUUID(uuid: string): Promise<any> {
    const { firstName, lastName } = await this.userService.findUserByUUID(uuid);
    return {
      firstName,
      lastName,
    };
  }

  async getDirectoryNameByUUID(uuid: string): Promise<string> {
    const user = await this.userService.findUserByUUID(uuid);
    return createDirectoryName(user);
  }

  async getUserDirectoryFiles(
    directoryName: string,
    secondDir: string,
  ): Promise<any> {
    const files = fs.readdirSync(
      join(__dirname, '..', 'public/users/', directoryName, secondDir),
    );

    return files.map((file) => {
      return {
        filename: file,
        extension: file.slice(
          (Math.max(0, file.lastIndexOf('.')) || Infinity) + 1,
        ),
      };
    });
  }
}
