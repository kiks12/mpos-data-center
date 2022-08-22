import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import { ReadService } from './read.service';

@Controller('read')
export class ReadController {
  constructor(
    private readonly appService: AppService,
    private readonly readService: ReadService,
  ) {}

  @Get()
  async root(@Req() req: Request, @Res() res: Response) {
    const { file, secondDir, directory, extension } = req.query;

    if (extension !== 'csv') {
      return res.redirect(`/public/users/${directory}/${secondDir}/${file}`);
    }

    const uuid = req.cookies.uuid;
    const { lastName, firstName } = await this.appService.getUserFullNameByUUID(
      uuid,
    );

    const csv = await this.readService.readCSVFile(
      `${directory}/${secondDir}/${file}`,
    );

    return res.render('read', {
      activePage: 'Read',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
      csv: csv,
      type: secondDir,
    });
  }
}
