import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RolsService {
  constructor(
    @InjectRepository(Rol)
    private rolsRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto) {
    const rol = this.rolsRepository.create(createRolDto);

    return await this.rolsRepository.save(rol);
  }

  async findRolls(rolsId: number[]) {
    const rols = await this.rolsRepository.findBy({ id: In(rolsId) });
    if (rols.length < rolsId.length) {
      throw new BadRequestException('Rol not found');
    }
    return rols;
  }

  async findAll() {
    return await this.rolsRepository.find({ relations: { users: true } });
  }

  async findOne(id: number) {
    const rol = await this.rolsRepository.findOne({
      where: { id },
      relations: { users: true },
    });
    if (!rol) {
      throw new NotFoundException('Rol not found');
    }

    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    return await this.rolsRepository.update(id, updateRolDto);
  }

  async remove(id: number) {
    return await this.rolsRepository.delete(id);
  }
}
