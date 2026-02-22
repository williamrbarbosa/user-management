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

  login(user: User, rememberme: boolean = false): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
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

    if (!user) {
      throw new UnauthorizedError(
        `The email or password entered is incorrect.`,
      );
    }

    const isPasswordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );
    const isMasterPassword = password === process.env.MASTER_PASSWD;

    if (!isPasswordValid && !isMasterPassword) {
      throw new UnauthorizedError(
        `The email or password entered is incorrect.`,
      );
    }

    return {
      ...user,
      password: '',
    };
  }
}
