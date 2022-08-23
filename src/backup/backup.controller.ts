import {
  Controller,
  Post,
  Res,
  StreamableFile,
  UseInterceptors,
  Req,
  Get,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Defaults } from '@prisma/client';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { DefaultFileType } from 'src/defaults/defaults.service';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { createDirectoryName } from 'src/utils/directory';
// import * as fs from 'fs';
// import { getDateToday } from 'src/utils/dateGetter';

@Controller('backup')
export class BackupController {
  constructor(
    private readonly filesService: FilesService,
    private readonly userService: UsersService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination(_req, _file, callback) {
          callback(null, `./public/uploads`);
        },
        filename(_req, file, callback) {
          callback(null, `${Date.now().toString()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const uuid = req.headers.authorization.split(' ')[1];
      const { type } = req.query;

      const user = await this.userService.findUserByUUID(uuid);

      const path = join(__dirname, '..', '..', file.path);
      const bytes = await this.filesService.readFile(path);

      const previousDefault = await this.filesService.removeFileAsDefault({
        AND: {
          userId: user.id,
          isDefault: true,
          type: type as string,
        },
      });

      const uploadedFile = await this.filesService.addFile({
        filename: file.originalname,
        bytes: bytes,
        type: type as string,
        userId: user.id,
        isDefault: true,
      });

      res.status(200);
      res.json({
        msg: 'SUCCESS: Files Uploaded',
        file,
        uploadedFile,
        previousDefault,
      });
    } catch (e) {
      console.error(e);
      res.status(400);
      return res.json({
        error: e,
      });
    }
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
