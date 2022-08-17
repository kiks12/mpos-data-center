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
    return {
      activePage: 'Home',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
    };
  }
}
