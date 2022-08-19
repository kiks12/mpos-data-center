import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { DefaultsService } from './defaults.service';

@Module({
  providers: [DefaultsService, PrismaService, UsersService],
  exports: [DefaultsService],
})
export class DefaultsModule {}
