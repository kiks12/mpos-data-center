import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SettingsMiddleware } from 'src/settings.middleware';
import { SettingsService } from './settings.service';

@Module({
  providers: [SettingsService],
})
export class SettingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SettingsMiddleware)
      .forRoutes(
        '/settings/update-profile/',
        '/settings/delete/',
        '/settings/clear-files',
        '/settings/change-password',
      );
  }
}
