import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { UsersService } from 'src/users/users.service';
import { generateUUID } from 'src/utils/apiKey';

@Controller('login')
export class LoginController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Render('login')
  root() {
    return null;
  }

  @UseGuards(LocalAuthGuard)
  @Post('callback')
  async loginCallback(@Req() req: Request, @Res() res: Response) {
    if (typeof req.user === 'string') {
      res.status(400);
      return res.send({
        msg: req.user,
      });
    }

    const { id } = req.user as any;
    const uuid = generateUUID();
    const { apiKey, password, ...result } = await this.usersService.setAPIKey(
      uuid,
      id,
    );

    res.cookie('uuid', apiKey, {
      httpOnly: true,
    });

    res.status(200);
    return res.send({
      ...result,
      uuid: apiKey,
    });
  }

  @Post('logout')
  async postLogout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('uuid', {
      httpOnly: true,
    });
    res.send(true);
  }

  @Get('logout')
  async getLogout(@Res() res: Response) {
    res.clearCookie('uuid', {
      httpOnly: true,
    });
    res.redirect('/');
  }
}
