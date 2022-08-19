import { Injectable } from '@nestjs/common';
import {
  DefaultFileType,
  DefaultsService,
} from 'src/defaults/defaults.service';

@Injectable()
export class FilesService {
  constructor(private readonly defaultService: DefaultsService) {}

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
}
