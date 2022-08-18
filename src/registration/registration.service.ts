/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const NEEDED_DIRS = ['Store-Details', 'Accounts', 'Transactions', 'Inventory', 'Expiration-Dates', 'Attendance'];

@Injectable()
export class RegistrationService {
  async createDirectory(folderName: string) {
    const directory = join(__dirname, '..', '..', 'public/users', folderName);
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
  }

  async createSecondLevelDirs(directoryName: string) {
    NEEDED_DIRS.forEach((dir: string) => {
      const directory = join(__dirname, '..', '..', 'public/users', directoryName, dir);
      if (!existsSync(directory)) {
        mkdirSync(directory);
      }
    })
  }
}
