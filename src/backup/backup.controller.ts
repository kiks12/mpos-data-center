import {
  Controller,
  Post,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Defaults } from '@prisma/client';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { DefaultFileType } from 'src/defaults/defaults.service';
import { FilesService } from 'src/files/files.service';
import { createDirectoryName } from 'src/utils/directory';

@Controller('backup')
export class BackupController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination(req, _file, callback) {
          const { dir } = req.query;
          const directoryName = createDirectoryName(req.user);
          callback(null, `./public/users/${directoryName}/${dir}`);
        },
        filename(_req, file, callback) {
          callback(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadCsv(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const uuid = req.headers.authorization.split(' ')[1];
    const { dir } = req.query;
    const path = files[0].path;
    if (files.length === 0) {
      res.status(400);
      res.json({
        msg: 'ERROR: Files Not Uploaded Properly. Please try again Later',
      });
      return;
    }

    const defaultFile = await this.filesService.setUserDefaultFileByUUID(
      uuid,
      path,
      dir.toString() as DefaultFileType,
    );

    res.status(200);
    res.json({
      msg: 'SUCCESS: Files Uploaded',
      file: defaultFile,
    });
  }

  @Post('set-default')
  async setDefault(@Req() req: Request, @Res() res: Response) {
    try {
      const uuid = req.headers.authorization.split(' ')[1];
      const { path, type } = req.body;
      const defaultFile = await this.filesService.setUserDefaultFileByUUID(
        uuid,
        path,
        type.toString() as DefaultFileType,
      );

      res.status(200);
      res.json({
        msg: `Successfully set this file to be the Default File for your ${type} table`,
        file: defaultFile,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(400);
      res.json({
        msg: `ERROR: ${e}`,
      });
    }
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

  @Get('restore')
  async restoreFiles(@Req() req: Request): Promise<StreamableFile> {
    const { type } = req.query;
    const user = req.user as any;
    const defaultFiles: Defaults[] = user.Defaults;
    const defaultFile: Defaults = defaultFiles.find(
      (file) => file.type === type,
    );
    const file = createReadStream(join(process.cwd(), defaultFile.path));
    return new StreamableFile(file);
  }

  @Delete('delete')
  async deleteFile(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { path } = req.body;
    const deleted = this.filesService.deleteUserFile(path);
    if (!deleted) {
      res.status(400);
      res.json({
        msg: 'There seems to be a problem deleting this file, Please try again later.',
      });
      return;
    }

    res.status(200);
    res.json({
      msg: 'Successfully deleted this file from your data storage',
    });
  }
}
