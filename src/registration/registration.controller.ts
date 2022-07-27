import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { hashPassword } from 'src/utils/hashing';
import { RegistrationService } from './registration.service';

interface CreateUserRequestBody {
  firstName: string;
  middleName: string;
  lastName: string;
  contactNumber: string;
  emailAddress: string;
  password: string;
}

@Controller('registration')
export class RegistrationController {
  constructor(private service: RegistrationService) {}

  @Get()
  @Render('registration')
  root() {
    return;
  }

  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    const body: CreateUserRequestBody = req.body;
    body.password = await hashPassword(body.password);
    try {
      const createdUser = await this.service.createUser({
        firstName: body.firstName,
        lastName: body.lastName,
        middleName: body.middleName,
        contactNumber: body.contactNumber,
        emailAddress: body.emailAddress,
        password: body.password,
      });
      if (createdUser) {
        res.status(200);
        res.json({
          msg: 'User Created Successfully',
          user: createdUser,
        });
        return;
      }
      res.status(500);
      return res.json({
        msg: 'There seems to be a problem in the server. Try again later',
      });
    } catch (e) {
      if (e.code === 'P2002' && e.meta.target[0] === 'emailAddress') {
        res.status(400);
        res.json({
          msg: 'This Email Address is used already!',
        });
        return;
      }
    }
  }
}
