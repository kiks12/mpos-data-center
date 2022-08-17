import {
  Controller,
  Post,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { getDateToday } from 'src/utils/dateGetter';
import { createDirectoryName } from 'src/utils/directory';

@Controller('backup')
export class BackupController {
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination(req, file, callback) {
          const directoryName = createDirectoryName(req.user);
          callback(null, `./public/users/${directoryName}`);
        },
        filename(req, file, callback) {
          callback(null, `${getDateToday()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadCsv(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    if (!files) {
      res.status(400);
      res.json({
        msg: 'ERROR: Files Not Uploaded Properly. Please try again Later',
      });
      return;
    }

    res.status(200);
    res.json({
      msg: 'SUCCESS: Files Uploaded',
    });
  }

  @Post('download')
  async getFile(@Req() req: Request): Promise<StreamableFile> {
    const { filename } = req.body;
    const userDirectoryName = createDirectoryName(req.user);
    const file = createReadStream(
      join(process.cwd(), `/public/users/${userDirectoryName}/${filename}`),
    );
    return new StreamableFile(file);
  }
}
