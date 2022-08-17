import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UsersService) {}

  async getUserFullNameByUUID(uuid: string): Promise<any> {
    const { firstName, lastName } = await this.userService.findUserByUUID(uuid);
    return {
      firstName: firstName,
      lastName: lastName,
    };
  }
}
