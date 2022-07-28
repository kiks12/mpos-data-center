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
import { hashPassword } from 'src/utils/hashing';

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
      return res.send(req.user);
    }

    const { id } = req.user as any;
    const uuid = generateUUID();
    const { apiKey, ...result } = await this.usersService.setAPIKey(uuid, id);
    const finalAPIKey = await hashPassword(apiKey);

    res.cookie('uuid', finalAPIKey, {
      httpOnly: true,
    });

    res.status(200);
    return res.send({
      result,
      uuid: finalAPIKey,
    });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('uuid', {
      httpOnly: true,
    });
    res.send(true);
  }
}
