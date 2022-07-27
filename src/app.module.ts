import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrationController } from './registration/registration.controller';
import { RegistrationService } from './registration/registration.service';
import { RegistrationModule } from './registration/registration.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [RegistrationModule],
  controllers: [AppController, RegistrationController],
  providers: [AppService, RegistrationService, PrismaService],
})
export class AppModule {}
