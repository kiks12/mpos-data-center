import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { decryptPassword } from 'src/utils/hashing';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);

    if (!user) {
      return 'Account not Found';
    }

    const passwordMatch = await decryptPassword(password, user.password);
    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }

    return 'Incorrect Password';
  }
}
