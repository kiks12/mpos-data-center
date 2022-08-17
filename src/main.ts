/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as cookie from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
// import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    session({
    secret: 'dfjkasdfsdaf.jkhrgkeyuerothi2378623.fgskjhsdfg.53453443fjsdfgsdf',
    saveUninitialized: false,
    resave: false,
    }),
  );
  app.use(cookie());
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
