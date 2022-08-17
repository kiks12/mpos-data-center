/* eslint-disable prettier/prettier */
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (str: string): Promise<string> => {
  const hashed = await hash(str, SALT_ROUNDS);
  return hashed;
}

export const hashAPIKey = async (str: string): Promise<string> => {
  return await hashPassword(str);
}

export const decryptPassword = async (str: string, encrypted: string): Promise<boolean> => {
  return await compare(str, encrypted);
}

export const decruptAPIKey = async (str: string, encrypted: string): Promise<boolean> => {
  return await compare(str, encrypted);
}