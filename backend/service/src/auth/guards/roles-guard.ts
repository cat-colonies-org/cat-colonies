import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role, Roles } from 'src/domain/roles/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, //@Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler());
    if (!roles || roles.length == 0) return true;

    const request = GqlExecutionContext.create(context).getContext().req;
    const role: Role = await request.user.role;

    if (role.id == Roles.Administrator) return true;
    if (roles.indexOf(role.id) != -1) return true;

    return false;
  }
}
