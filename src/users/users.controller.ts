import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @Post()
  async create(@Body() dto: UsersDto) {
    return await this.usersService.create(dto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UsersDto) {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
}
