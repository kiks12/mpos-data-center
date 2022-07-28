/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { generateUUID } from 'src/utils/apiKey';
import { createDirectoryName } from 'src/utils/directory';
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
  constructor(private service: RegistrationService, private userService: UsersService) {}

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
      const uuid = generateUUID();
      const createdUser = await this.userService.createUser({
        firstName: body.firstName,
        lastName: body.lastName,
        middleName: body.middleName,
        contactNumber: body.contactNumber,
        emailAddress: body.emailAddress,
        password: body.password,
        apiKey: uuid,
      });
      if (createdUser) {
        this.service.createDirectory(createDirectoryName(body));
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
