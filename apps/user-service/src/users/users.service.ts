/* eslint-disable prettier/prettier */
import { Rol } from './../rols/entities/rol.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Rol)
    private rolsRepository: Repository<Rol>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { rolsId, ...validDto } = createUserDto;

    const rols = await this.rolsRepository.findBy({ id: In(rolsId) });
    if (rols.length < rolsId.length) {
      throw new BadRequestException('Rol not found');
    }

    const user = this.usersRepository.create({
      ...validDto,
      rols,
    });

    return await this.usersRepository.save(user);


  }

  async findAll() {
    return await this.usersRepository.find({
      relations: ['rols', "rols.permissions"],
    });
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: {
        rols: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email }, relations: ['rols', "rols.permissions"],
    });
    console.log('user :>> ', user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { rolsId, ...validDto } = updateUserDto;

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    let rols;
    if (rolsId) {
      rols = await this.rolsRepository.findBy({ id: In(rolsId) });
      if (rols.length < rolsId.length) {
        throw new BadRequestException('Rol not found');
      }
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...validDto,
      rols,
    });

    return await updatedUser;
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
