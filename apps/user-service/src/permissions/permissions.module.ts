import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { RolsModule } from '../rols/rols.module';
import { RolsService } from '../rols/rols.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), RolsModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, RolsService],
  exports: [TypeOrmModule],
})
export class PermissionsModule { }
