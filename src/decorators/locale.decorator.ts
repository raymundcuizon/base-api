// locale.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Locale = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers['locale'] || "en"; // Replace 'locale' with the actual header key where the locale is stored in your headers.
});
