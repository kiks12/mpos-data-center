import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { generateUUID } from 'src/utils/apiKey';
import { decryptPassword } from 'src/utils/hashing';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);
    const passwordMatch = await decryptPassword(password, user.password);
    if (user && passwordMatch) {
      const { password, ...result } = user;
      const uuid = generateUUID();
      return result;
    }

    return null;
  }
}
