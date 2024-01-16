import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { RolsModule } from '../rols/rols.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsService } from '../permissions/permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolsModule, PermissionsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersService, PermissionsService],
  exports: [TypeOrmModule],
})
export class UsersModule { }
