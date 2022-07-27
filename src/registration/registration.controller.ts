import { Controller, Get, Render } from '@nestjs/common';

@Controller('registration')
export class RegistrationController {
  @Get()
  @Render('registration')
  root() {
    return;
  }
}
