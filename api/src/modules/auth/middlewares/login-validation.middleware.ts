import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoginRequestBody } from '../models/LoginRequestBody';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const loginRequestBody = plainToInstance(LoginRequestBody, req.body as object);
    const validations = await validate(loginRequestBody);

    if (validations.length) {
      const messages = validations.flatMap((v) =>
        v.constraints ? Object.values(v.constraints) : [],
      );
      throw new BadRequestException(messages);
    }

    next();
  }
}
