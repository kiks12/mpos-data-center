import {
  Controller,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
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

  // @Get('')
}
