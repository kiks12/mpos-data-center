import { Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ReadService {
  constructor(private readonly fileService: FilesService) {}

  async readCSVFile(id: number): Promise<string[][]> {
    const fileFromDB = await this.fileService.getSpecificFileByID(id);
    const buffer = Buffer.from(fileFromDB.bytes);
    const file = buffer.toString();

    const firstLevelSplit = file.split('\n');
    const secondLevelSplit = firstLevelSplit.map((file) => file.split(','));
    return Promise.resolve(secondLevelSplit);
  }
}
