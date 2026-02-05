import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
