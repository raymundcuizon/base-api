// import { SetMetadata } from '@nestjs/common';
// import { Role } from './role.enum';

// export const ROLES_KEY = 'roles';
// export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from '@nestjs/common';

export const AllowedRoles = (...allowedRoles: string[]) =>
  SetMetadata('allowedRoles', allowedRoles);
