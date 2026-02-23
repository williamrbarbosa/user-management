import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { UsersService } from 'src/modules/users/users.service';
import { HashService } from 'src/modules/common/hash.service';
import { AppError } from 'src/modules/common/models';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { UserStatus } from '@prisma/client';
import { SessionsService } from '../sessions/sessions.service';
import { CreateSessionDto } from '../sessions/dto/create-session.dto';

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
    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new ConflictException('A user with this email already exists.');
    }

    if (registerDto.user_password !== registerDto.user_confirm_password) {
      throw new BadRequestException('Password confirmation does not match.');
    }

    try {
      const createUserDto: CreateUserDto = {
        id: uuidv4(),
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        email: registerDto.email,
        password: registerDto.user_password,
        status: UserStatus.ACTIVE,
        login_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const user = await this.usersService.create(createUserDto);

      const maskedEmail = user.email.replace(/(.{1}).+(.{1}@.+)/, '$1****$2');

      return {
        status: 200,
        email: maskedEmail,
        message:
          'Registro realizado com sucesso. Por favor, verifique seu e-mail para ativar sua conta.',
      };
    } catch (err) {
      const error = err as AppError;
      throw new HttpException(
        'Erro ao finalizar seu Registro. ' + error.message,
        HttpStatus.BAD_REQUEST,
        { cause: error, description: error.message },
      );
    }
  }

  async login(user: User, rememberme: boolean = false): Promise<UserToken> {
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

    const jwtToken = this.jwtService.sign(payload);

    return {
      tokenType: 'Bearer',
      expiresIn: rememberme ? 86400 : 3600,
      accessToken: jwtToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    const standardLoginErrorMessage = `The email or password entered is incorrect.`;

    if (!user) {
      throw new UnauthorizedError(standardLoginErrorMessage);
    }

    //Validating:
    //- Inactive users cannot create sessions.
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
      throw new UnauthorizedError(standardLoginErrorMessage);
    }

    return {
      ...user,
      password: '',
    };
  }
}
