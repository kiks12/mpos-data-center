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
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';

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
      const { type, isDefault } = req.query;

      const user = await this.userService.findUserByUUID(uuid);

      const path = join(__dirname, '..', '..', file.path);
      const bytes = await this.filesService.readFile(path);
      let previousDefault = null;

      if (isDefault == 'true') {
        previousDefault = await this.filesService.removeFileAsDefault({
          AND: {
            userId: user.id,
            isDefault: true,
            type: type as string,
          },
        });
      }

      const uploadedFile = await this.filesService.addFile({
        filename: file.originalname,
        bytes: bytes,
        type: type as string,
        userId: user.id,
        isDefault: isDefault == 'true',
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
      const user = await this.userService.findUserByUUID(uuid);
      const { type, id } = req.body;

      const previousDefault = await this.filesService.removeFileAsDefault({
        AND: {
          userId: user.id,
          isDefault: true,
          type: type as string,
        },
      });

      const defaultFile = await this.filesService.setFileAsDefaultFileByID(id);

      res.status(200);
      return res.json({
        msg: `Successfully set this file to be the Default File for your ${type} table`,
        file: defaultFile,
        previousDefault,
      });
    } catch (e) {
      console.error(e);
      res.status(400);
      return res.json({
        msg: `ERROR: ${e}`,
      });
    }
  }

  @Get('download')
  async getFile(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { id } = req.query;
    // const uuid = req.headers.authorization.split(' ')[1];
    const file = await this.filesService.getSpecificFileByID(
      Number.parseInt(id.toString()),
    );
    const buffer = Buffer.from(file.bytes);

    return new StreamableFile(buffer);
  }

  @Get('restore')
  async restoreFiles(@Req() req: Request): Promise<StreamableFile> {
    const { type } = req.query;
    const uuid = req.headers.authorization.split(' ')[1];
    const user = await this.userService.findUserByUUID(uuid);
    const defaultFile = user.Files.find(
      (file) => file.type == type && file.isDefault,
    );
    const buffer = Buffer.from(defaultFile.bytes);

    return new StreamableFile(buffer);
  }

  @Delete('delete')
  async deleteFile(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { id } = req.body;
    const deleted = this.filesService.deleteUserFile(id);
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

  @Post('rename')
  async renameFile(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { id, name } = req.body;
    const renamedFile = await this.filesService.renameFile(id, name);
    if (renamedFile) {
      res.json({
        msg: 'Successfully renamed your file.',
        renamedFile,
      });
      return;
    }
    res.json({
      msg: 'There seems to be a problem renaming your file. Please try again later.',
    });
    return;
  }
}
