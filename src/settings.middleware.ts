import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SettingsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      res.status(500);
      res.json({
        error: 'Unauthorized access to API.',
      });
      return;
    }
    next();
  }
}
