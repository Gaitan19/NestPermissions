import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolsService } from './rols.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('rols')
export class RolsController {
  constructor(private readonly rolsService: RolsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolsService.create(createRolDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.rolsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.rolsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return this.rolsService.update(+id, updateRolDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.rolsService.remove(+id);
  }
}
