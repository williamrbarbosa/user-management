import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../models/UserPayload';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { UserFromJwt } from '../models/UserFromJwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: UserPayload): UserFromJwt {
    const user: UserFromJwt = {
      id: payload.sub,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      status: payload.status,
      session_id: payload.session_id,
    };

    if (!user) {
      throw new UnauthorizedError(
        'Access Token entered is incorrect or expired.',
      );
    }

    return user;
  }
}
