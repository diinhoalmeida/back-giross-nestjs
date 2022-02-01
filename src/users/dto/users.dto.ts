import { IsEmail } from 'class-validator';

export class UsersDto {
  id?: number;
  nome?: string;

  @IsEmail(undefined, { message: 'O tipo digitado não é um e-mail.' })
  email?: string;

  idade?: number;
  telefone?: string;
  gen?: string;
}
