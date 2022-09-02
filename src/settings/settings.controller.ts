import {
  Controller,
  Delete,
  Get,
  Patch,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly fileService: FilesService,
  ) {}

  @Get()
  @Render('settings')
  async root(@Req() req: Request) {
    const uuid = req.cookies.uuid;
    const { lastName, firstName, id } =
      await this.appService.getUserFullNameByUUID(uuid);

    const user = await this.userService.findUserByUUID(uuid);
    const defaultFiles = await this.appService.getDefaultFiles(id);

    return {
      activePage: 'Settings',
      fullname: `${lastName}, ${firstName}`,
      thumbnailLetter: firstName[0],
      defaultFiles,
      user,
    };
  }

  @Patch('update-profile')
  async updateProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const uuid = req.headers.authorization.split(' ')[1];
      const { lastName, firstName, middleName, contactNumber, emailAddress } =
        req.body;
      const user = await this.userService.findUserByUUID(uuid);

      if (!user) {
        res.status(400);
        res.json({
          error: 'User cannot be found. Incorrect API key.',
        });
        return;
      }

      const updatedUser = await this.userService.updateUser(user.id, {
        lastName: lastName ?? user.lastName,
        firstName: firstName ?? user.firstName,
        middleName: middleName ?? user.middleName,
        contactNumber: contactNumber ?? user.contactNumber,
        emailAddress: emailAddress ?? user.emailAddress,
      });

      res.status(200);
      res.json({
        msg: 'Successfully updated your profile.',
        updatedUser,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(500);
      res.json({
        error: e,
      });
      return;
    }
  }

  @Delete('delete')
  async deleteAccount(@Req() req: Request, @Res() res: Response) {
    try {
      const uuid = req.headers.authorization.split(' ')[1];
      const user = await this.userService.findUserByUUID(uuid);

      if (!user) {
        res.status(400);
        res.json({
          error: 'User cannot be found. Incorrect API key.',
        });
        return;
      }

      const deletedUser = await this.userService.deleteUser(user.id);
      res.status(200);
      res.json({
        msg: 'Successfully deleted your Account.',
        deletedUser,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(500);
      res.json({
        error: e,
      });
    }
  }

  @Delete('clear-files')
  async clearFiles(@Req() req: Request, @Res() res: Response) {
    try {
      const uuid = req.headers.authorization.split(' ')[1];
      const user = await this.userService.findUserByUUID(uuid);
      if (!user) {
        res.status(400);
        res.json({
          error: 'User cannot be found. Incorrent API key.',
        });
        return;
      }

      const deletedFiles = await this.fileService.deleteAllFilesOfUser(user.id);
      res.status(200);
      res.json({
        msg: 'Successfully deleted all your Files.',
        deletedFiles,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(500);
      res.json({
        error: e,
      });
      return;
    }
    //
  }
}
