import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/domain/users/entities/user.entity';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): User => {
  return GqlExecutionContext.create(context).getContext().req.user;
});
