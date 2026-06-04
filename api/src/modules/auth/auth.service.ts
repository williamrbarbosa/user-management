import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserPayload } from './models/UserPayload';
import { UserResponseLogin } from './models/UserResponseLogin';
import { UsersService } from 'src/modules/users/users.service';
import { HashService } from 'src/modules/common/hash.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { UserStatus } from '@prisma/client';
import { SessionsService } from '../sessions/sessions.service';
import { CreateSessionDto } from '../sessions/dto/create-session.dto';
import { Session } from '../sessions/entities/session.entity';

type RegisterResponse = {
  status: number;
  email: string;
  message: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly sessionsService: SessionsService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists.');
    }

    if (registerDto.user_password !== registerDto.user_confirm_password) {
      throw new BadRequestException('Password confirmation does not match.');
    }

    const createUserDto: CreateUserDto = {
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      email: registerDto.email,
      password: registerDto.user_password,
      status: UserStatus.ACTIVE,
    };

    const user = await this.usersService.create(createUserDto);
    const maskedEmail = user.email.replace(/(.{1}).+(.{1}@.+)/, '$1****$2');

    return {
      status: 201,
      email: maskedEmail,
      message: 'Your account was created successfully.',
    };
  }

  async login(
    user: User,
    rememberme: boolean = false,
  ): Promise<UserResponseLogin> {
    const session = await this.sessionsService.createInternal({
      user_id: user.id,
    } as CreateSessionDto);

    const payload: UserPayload = {
      sub: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
      session_id: session.id,
    };

    const expiresIn = rememberme ? 86400 : 3600;
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    return {
      tokenType: 'Bearer',
      expiresIn,
      accessToken,
      sessionId: session.id,
      user,
    };
  }

  async logout(user: User): Promise<Session> {
    return this.sessionsService.terminate(user.id);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const standardError = 'The email or password entered is incorrect.';

    if (!user) {
      throw new UnauthorizedError(standardError);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedError(
        "Your user is inactive and can't sign in. Contact the support.",
      );
    }

    const isPasswordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(standardError);
    }

    return { ...user, password: '' };
  }
}
