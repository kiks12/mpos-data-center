import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import { FilesService } from 'src/files/files.service';
import { ReadService } from './read.service';

@Controller('read')
export class ReadController {
  constructor(
    private readonly appService: AppService,
    private readonly readService: ReadService,
    private readonly fileService: FilesService,
  ) {}

  @Get()
  async root(@Req() req: Request, @Res() res: Response) {
    const { id, extension, type, filename } = req.query;

    if (extension !== 'csv') {
      // return res.redirect(`/public/users/${directory}/${secondDir}/${file}`);
      return res.redirect(`/`);
    }

    const uuid = req.cookies.uuid;
    const { lastName, firstName } = await this.appService.getUserFullNameByUUID(
      uuid,
    );

    const csv = await this.readService.readCSVFile(
      Number.parseInt(id as string),
    );

    return res.render('read', {
      activePage: 'Read',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
      csv: csv,
      type: type,
      filename: filename,
      extension: extension,
      id: id,
    });
  }
}
