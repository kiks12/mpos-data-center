/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class RegistrationService {
  async createDirectory(folderName: string) {
    const directory = join(__dirname, '..', '..', 'public/users', folderName);
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
  }
}
