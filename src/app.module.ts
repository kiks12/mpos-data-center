import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrationController } from './registration/registration.controller';
import { RegistrationService } from './registration/registration.service';
import { RegistrationModule } from './registration/registration.module';
import { PrismaService } from './prisma/prisma.service';
import { BackupController } from './backup/backup.controller';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';

@Module({
  imports: [RegistrationModule, UsersModule, AuthModule, LoginModule],
  controllers: [
    AppController,
    RegistrationController,
    BackupController,
    LoginController,
  ],
  providers: [AppService, RegistrationService, PrismaService, AuthService],
})
export class AppModule {}
