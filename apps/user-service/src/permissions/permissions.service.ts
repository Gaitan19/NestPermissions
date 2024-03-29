/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from '../rols/entities/rol.entity';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Rol)
    private rolsRepository: Repository<Rol>,

    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) { }

  async create(createPermissionDto: CreatePermissionDto) {
    const { rolsId, ...validDto } = createPermissionDto;

    const rols = await this.rolsRepository.findBy({ id: In(rolsId) });
    if (rols.length < rolsId.length) {
      throw new BadRequestException('Rol not found');
    }

    const Permission = this.permissionsRepository.create({
      ...validDto,
      rols,
    });

    return await this.permissionsRepository.save(Permission);
  }

  async findAll() {
    return await this.permissionsRepository.find({
      relations: {
        rols: true,
      },
    });
  }

  async checkPermissions(endpoint: string, method: string, roles: string[]): Promise<boolean> {
    const permissions = await this.permissionsRepository.find({
      relations: ['rols'],
    });

    return permissions.some(permission =>
      roles.every(role => permission.rols.some(rol => rol.rolName === role)) &&
      permission.endpoints.includes(endpoint) &&
      permission.method.includes(method),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  async remove(id: number) {
    return await this.permissionsRepository.delete(id);
  }
}
