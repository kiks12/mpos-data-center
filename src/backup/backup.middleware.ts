import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BackupMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      res.status(400);
      res.json({
        msg: 'ERROR:',
      });
      return;
    }

    const uuid = authorization.split(' ')[1];
    try {
      const userInformation = await this.userService.findUserByUUID(uuid);
      req.user = userInformation;
      next();
    } catch (e) {
      console.log(e);
    }
  }
}
