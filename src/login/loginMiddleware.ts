/* eslint-disable prettier/prettier */

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/' && !req.cookies.uuid) {
      res.redirect('/login');
      return;
    }
    if (req.path === '/login' && req.cookies.uuid) {
      res.redirect('/');
      return;
    } 
    next();
  }
}