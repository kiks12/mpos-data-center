import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async root(@Req() req: Request, @Res() res: Response) {
    try {
      const uuid = req.cookies.uuid;
      const { lastName, firstName, id } =
        await this.appService.getUserFullNameByUUID(uuid);

      const storeDetailFiles = await this.appService.getUserFilesByType(
        id,
        'STORE_DETAILS',
      );

      const accountFiles = await this.appService.getUserFilesByType(
        id,
        'ACCOUNTS',
      );

      const expirationDateFiles = await this.appService.getUserFilesByType(
        id,
        'EXPIRATION_DATES',
      );

      const transactionFiles = await this.appService.getUserFilesByType(
        id,
        'TRANSACTIONS',
      );

      const inventoryFiles = await this.appService.getUserFilesByType(
        id,
        'INVENTORY',
      );

      const attendanceFiles = await this.appService.getUserFilesByType(
        id,
        'ATTENDANCE',
      );

      const otherFiles = await this.appService.getUserFilesByType(id, 'OTHERS');

      const defaultFiles = await this.appService.getDefaultFiles(id);

      res.status(200);
      return res.render('index', {
        activePage: 'Home',
        fullname: `${lastName}, ${firstName}`,
        thumbnailLetter: firstName[0],
        storeDetailFiles,
        accountFiles,
        expirationDateFiles,
        transactionFiles,
        inventoryFiles,
        attendanceFiles,
        otherFiles,
        defaultFiles,
      });
    } catch (e) {
      res.status(400);
      return res.json({
        error: e,
      });
    }
  }
}
