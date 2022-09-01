import { Injectable } from '@nestjs/common';
import { FilesService } from './files/files.service';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UsersService,
    private readonly fileService: FilesService,
  ) {}

  async getUserFullNameByUUID(uuid: string): Promise<any> {
    const { firstName, lastName, id } = await this.userService.findUserByUUID(
      uuid,
    );
    return {
      firstName,
      lastName,
      id,
    };
  }

  async getUserFilesByType(id: number, type: string): Promise<any> {
    const files = await this.fileService.getUserFileByType(id, type);

    return files.map((file) => {
      return {
        id: file.id,
        filename: file.filename,
        extension: file.filename.slice(
          (Math.max(0, file.filename.lastIndexOf('.')) || Infinity) + 1,
        ),
        type: type,
        default: file.isDefault,
      };
    });
  }

  async getDefaultFiles(id: number): Promise<any> {
    const defaultFiles = await this.fileService.getUserDefaultFilesByID(id);

    return defaultFiles.map((file) => {
      const filename = file.filename;
      return {
        id: file.id,
        filename,
        extension: filename.slice(
          (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
        ),
        type: file.type,
        default: file.isDefault,
      };
    });
  }

  async searchFiles(filename: string): Promise<any> {
    const searchedFiles = await this.fileService.searchFile(filename);

    return searchedFiles.map((file) => {
      const filename = file.filename;
      return {
        id: file.id,
        filename,
        extension: filename.slice(
          (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
        ),
        type: file.type,
        default: file.isDefault,
      };
    });
  }
}
