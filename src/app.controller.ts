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
      const { lastName, firstName } =
        await this.appService.getUserFullNameByUUID(uuid);

      const directoryName = await this.appService.getDirectoryNameByUUID(uuid);
      const storeDetailFiles = await this.appService.getUserDirectoryFiles(
        directoryName,
        'Store-Details',
      );

      const accountFiles = await this.appService.getUserDirectoryFiles(
        directoryName,
        'Accounts',
      );

      const expirationDateFiles = await this.appService.getUserDirectoryFiles(
        directoryName,
        'Expiration-Dates',
      );

      const transactionFiles = await this.appService.getUserDirectoryFiles(
        directoryName,
        'Transactions',
      );

      const inventoryFiles = await this.appService.getUserDirectoryFiles(
        directoryName,
        'Inventory',
      );

      const attendanceFiles = await this.appService.getUserDirectoryFiles(
        directoryName,
        'Attendance',
      );

      const otherFiles = await this.appService.getUserDirectoryFiles(
        directoryName,
        'Others',
      );

      const defaultFiles = await this.appService.getDefaultFiles(uuid);

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
      //
      res.status(400);
      return res.json({
        error: e,
      });
    }
  }
}
