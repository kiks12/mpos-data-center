import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { LoginMiddleware } from './login/loginMiddleware';
import { BackupModule } from './backup/backup.module';
import { FilesService } from './files/files.service';
import { DefaultsModule } from './defaults/defaults.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    RegistrationModule,
    UsersModule,
    AuthModule,
    LoginModule,
    BackupModule,
    DefaultsModule,
    FilesModule,
  ],
  controllers: [
    AppController,
    RegistrationController,
    BackupController,
    LoginController,
  ],
  providers: [AppService, RegistrationService, PrismaService, AuthService, FilesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes(
        { path: '/', method: RequestMethod.GET },
        { path: 'login', method: RequestMethod.GET },
      );
  }
}
