import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';

@Module({
  imports: [],
  controllers: [LoginController],
})
export class LoginModule {}
