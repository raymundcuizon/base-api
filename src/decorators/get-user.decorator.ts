import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

export interface ExtendedRequest extends Request {
  user: JwtPayload;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendedRequest>();
    return request.user;
  },
);
