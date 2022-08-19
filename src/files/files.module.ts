import { Module } from '@nestjs/common';
import { DefaultsService } from 'src/defaults/defaults.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { FilesService } from './files.service';

@Module({
  providers: [DefaultsService, FilesService, PrismaService, UsersService],
  exports: [FilesService],
})
export class FilesModule {}
