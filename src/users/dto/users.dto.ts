import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsersDto {
  @IsNotEmpty({ message: 'Você deve informar um nome válido para cadastro.' })
  @IsString({ message: 'O campo de nome aceita apenas letras.' })
  nome?: string;

  @IsEmail(undefined, { message: 'O tipo digitado não é um e-mail.' })
  @IsNotEmpty({ message: 'Você deve digitar um email para cadastro.' })
  email?: string;

  @IsNotEmpty({ message: 'Você deve preencher o campo de idade.' })
  idade?: number;

  @IsNotEmpty({ message: 'Você deve digitar um telefone para cadastro.' })
  telefone?: string;
  
  gen?: string;
}
