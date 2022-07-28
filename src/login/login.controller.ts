import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';

@Controller('login')
export class LoginController {
  @Get()
  @Render('login')
  root() {
    return null;
  }

  @UseGuards(LocalAuthGuard)
  @Post('callback')
  loginCallback(@Req() req: Request, @Session() session: Record<string, any>) {
    req.session.cookie.httpOnly = true;
    session.uuid = req.user;
    return req.user;
  }
}
