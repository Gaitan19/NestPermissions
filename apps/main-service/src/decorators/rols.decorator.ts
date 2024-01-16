import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'rols';
export const Rols = (rols: Role[]) => SetMetadata(ROLES_KEY, rols);
