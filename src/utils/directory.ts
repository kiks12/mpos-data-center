/* eslint-disable prettier/prettier */

export const createDirectoryName = (body : any) => {
  return `${body.firstName}_${body.lastName}-${body.emailAddress}`;
}