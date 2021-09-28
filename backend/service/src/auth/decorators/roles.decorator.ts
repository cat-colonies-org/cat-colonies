import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/domain/roles/entities/role.entity';

export const hasRoles = (...hasRoles: Roles[]) => SetMetadata('roles', hasRoles);
