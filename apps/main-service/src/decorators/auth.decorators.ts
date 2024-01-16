/* eslint-disable prettier/prettier */
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../guard/rols.guard';
import { Rols } from './rols.decorator';

export function Auth(role: Role[]) {
    return applyDecorators(Rols(role), UseGuards(AuthGuard, RolesGuard));
}
