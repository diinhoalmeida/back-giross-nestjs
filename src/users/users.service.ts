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

  async create(dto: UsersDto): Promise<any> {
    const userCreate = this.userRepository.create(dto);

    //VALIDATE ALL TEXTFIELDS
    if (!dto.email || !dto.gen || !dto.idade || !dto.nome || !dto.telefone) {
      return {
        errorBlank: `Você precisa preencher todos os campos para realizar cadastro.`,
      };
    }

    //FIND DUPLICATE ITEMS
    const theList = this.getAll();
    const emailExists = (await theList).find(
      (item) => item.email === dto.email,
    );

    const phoneExists = (await theList).find(
      (item) => item.telefone === dto.telefone,
    );

    if (emailExists) {
      return { errorMessage: `E-mail já existe no banco de dados.` };
    }

    if (phoneExists) {
      return { errorMessage: `Telefone já existe no banco de dados.` };
    }

    await this.userRepository.save(userCreate);
    return { message: ` ${userCreate.email} cadastrado com sucesso` };
  }

  async update(id: number, dto: UsersDto): Promise<any> {
    //FIND DUPLICATE ITEMS
    const theList = this.getAll();

    const emailExists = (await theList).find(
      (item) => item.email === dto.email && item.id !== dto.id,
    );

    const phoneExists = (await theList).find(
      (item) => item.telefone === dto.telefone && item.id !== dto.id,
    );

    if (emailExists) {
      return { errorMessage: `E-mail já existe no banco de dados.` };
    }

    if (phoneExists) {
      return { errorMessage: `Telefone já existe no banco de dados.` };
    }

    await this.userRepository.update({ id }, dto);
    return { message: ` Usuário atualizado com sucesso` };
  }

  async delete(id: number): Promise<any> {
    const userDelete = await this.findById(id);
    await this.userRepository.delete({ id });
    return { message: ` Usuário ${userDelete.nome} deletado com sucesso` };
  }
}
