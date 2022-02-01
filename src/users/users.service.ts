import { UsersDto } from './dto/users.dto';
import { UserEntity } from './entitys/users.entity';
import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: UserRepository,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    try {
      const list = await this.userRepository.find();
      if (!list.length) {
        throw new NotFoundException({ message: 'Não foram encontrados itens' });
      }
      return list;
    } catch (error) {
      throw new HttpException(error, 404);  
    }
  }

  async findById(id: number): Promise<UserEntity> {
    try {
      const userReturn = await this.userRepository.findOne(id);
      if (!userReturn) {
        throw new NotFoundException({ message: 'Este usuário não existe' });
      }
      return userReturn;
    } catch (error) {
      throw new HttpException(error, 404);    
    }
  }

  async create(dto: UsersDto): Promise<any> {
    try {
      const userCreate = this.userRepository.create(dto);
      

      await this.userRepository.save(userCreate);

      return { message: ` ${userCreate.email} cadastrado com sucesso` };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, dto: UsersDto): Promise<any> {
    try {
      await this.checkDuplicate(dto.email, dto.telefone); 
      await this.userRepository.update({ id }, dto);

      return { message: ` Usuário atualizado com sucesso` };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async delete(id: number): Promise<any> {
    try {
      const userDelete = await this.findById(id);
      await this.userRepository.delete({ id });
      return { message: ` Usuário ${userDelete.nome} deletado com sucesso` };

    } catch (error) {
      throw new HttpException(error, 406);
    }
  }

  async checkDuplicate(email: string, telefone: string) {
    const userExists = await this.userRepository.find({
      where: [
        { email },
        { telefone }
      ]
    });

    if (userExists.length > 0) {
      throw new HttpException({
        status: 409,
        message: 'Email ou telefone já existem.'
      }, 409)
    }

    return;
  }
}
