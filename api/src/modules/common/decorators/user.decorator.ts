import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserFromJwt => {
    const request = ctx.switchToHttp().getRequest<Request & { user: UserFromJwt }>();
    return request.user;
  },
);
