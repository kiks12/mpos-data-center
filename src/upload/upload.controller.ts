import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from 'src/app.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('upload')
  async root(@Req() req: Request) {
    const uuid = req.cookies.uuid;
    const { lastName, firstName, id } =
      await this.appService.getUserFullNameByUUID(uuid);

    const defaultFiles = await this.appService.getDefaultFiles(id);

    return {
      activePage: 'Upload',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
      defaultFiles,
    };
  }
}
