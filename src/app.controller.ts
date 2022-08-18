import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async root(@Req() req: Request) {
    const uuid = req.cookies.uuid;
    const { lastName, firstName } = await this.appService.getUserFullNameByUUID(
      uuid,
    );
    const directoryName = await this.appService.getDirectoryNameByUUID(uuid);
    const files = await this.appService.getUserDirectoryFiles(directoryName);
    const processedFiles = files.map((file) => {
      return {
        filename: file,
        extension: file.slice(
          (Math.max(0, file.lastIndexOf('.')) || Infinity) + 1,
        ),
      };
    });
    return {
      activePage: 'Home',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
      files: processedFiles,
    };
  }
}
