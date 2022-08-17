import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BackupMiddleware } from './backup.middleware';

@Module({
  imports: [UsersModule],
})
export class BackupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BackupMiddleware).forRoutes('/backup/');
  }
}
