import { IsEmail } from 'class-validator';

export class UsersDto {
  id?: number;
  nome?: string;

  @IsEmail()
  email?: string;

  idade?: number;
  telefone?: string;
  gen?: string;
}
