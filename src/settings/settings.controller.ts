import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from 'src/app.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('settings')
  async root(@Req() req: Request) {
    const uuid = req.cookies.uuid;
    const { lastName, firstName } = await this.appService.getUserFullNameByUUID(
      uuid,
    );
    return {
      activePage: 'Settings',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
    };
  }
}
