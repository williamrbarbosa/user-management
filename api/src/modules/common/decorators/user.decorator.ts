import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromJwt => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user;
  },
);
