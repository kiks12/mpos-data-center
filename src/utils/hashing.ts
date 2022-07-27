/* eslint-disable prettier/prettier */
import { hash } from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (str: string): Promise<string> => {
  const hashed = await hash(str, SALT_ROUNDS);
  return hashed;
}
