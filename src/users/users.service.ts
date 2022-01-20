import { UsersDto } from './dto/users.dto';
import { UserEntity } from './users.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { listenerCount } from 'process';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: UserRepository,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    const list = await this.userRepository.find();
    if (!list.length) {
      throw new NotFoundException({ message: 'Não foram encontrados itens' });
    }
    return list;
  }

  async findById(id: number): Promise<UserEntity> {
    const userReturn = await this.userRepository.findOne(id);
    if (!userReturn) {
      throw new NotFoundException({ message: 'Este usuário não existe' });
    }
    return userReturn;
  }

  async findByName(nome: string): Promise<UserEntity> {
    const userReturn = await this.userRepository.findOne(nome);
    if (!userReturn) {
      throw new NotFoundException({ message: 'Este usuário não existe' });
    }
    return userReturn;
  }

  async create(dto: UsersDto): Promise<any> {
    const userCreate = this.userRepository.create(dto);
    await this.userRepository.save(userCreate);
    return { message: ` ${userCreate.email} cadastrado com sucesso` };
  }

  async update(id: number, dto: UsersDto): Promise<any> {
    const user = await this.findById(id);
    dto.email ? (user.email = dto.email) : (user.email = user.email);
    dto.idade ? (user.idade = dto.idade) : (user.idade = user.idade);
    dto.nome ? (user.nome = dto.nome) : (user.nome = user.nome);
    dto.sexo ? (user.sexo = dto.sexo) : (user.sexo = user.sexo);
    dto.telefone
      ? (user.telefone = dto.telefone)
      : (user.telefone = user.telefone);
    await this.userRepository.save(user);
    return { message: ` ${user.email} atualizado com sucesso` };
  }

  async delete(id: number): Promise<any> {
    const userDelete = await this.findById(id);
    await this.userRepository.delete(userDelete);
    return { message: ` ${userDelete.email} deletado com sucesso` };
  }
}
