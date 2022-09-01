import { Controller, Get, Patch, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import { UsersService } from 'src/users/users.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @Render('settings')
  async root(@Req() req: Request) {
    const uuid = req.cookies.uuid;
    const { lastName, firstName, id } =
      await this.appService.getUserFullNameByUUID(uuid);

    const user = await this.userService.findUserByUUID(uuid);
    const defaultFiles = await this.appService.getDefaultFiles(id);

    return {
      activePage: 'Settings',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
      defaultFiles,
      user,
    };
  }

  @Patch('updateProfile')
  async updateProfile(@Req() req: Request, @Res() res: Response) {
    const { uuid } = req.cookies;
    if (!uuid) {
      res.redirect('/login/');
      return;
    }
    //
  }
}
