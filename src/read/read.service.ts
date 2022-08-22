import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ReadService {
  async readCSVFile(path: string): Promise<string[][]> {
    const file = fs.readFileSync(
      join(__dirname, '..', '..', 'public', 'users', path),
      { encoding: 'utf8', flag: 'r' },
    );

    const firstLevelSplit = file.split('\n');
    const secondLevelSplit = firstLevelSplit.map((file) => file.split(','));
    return Promise.resolve(secondLevelSplit);
  }
}
