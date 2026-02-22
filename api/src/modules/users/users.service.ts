import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Prisma, UserStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from '../common/hash.service';
import { AppError } from '../common/models';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );

    const data: Prisma.usersCreateInput = {
      ...createUserDto,
      id: uuidv4(),
      status: 'ACTIVE',
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      const createdUser = await this.prismaService.users.create({
        data,
      });

      return createdUser;
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Error trying to create user. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const hashedPassword = await this.hashService.hashPassword(
      updateUserDto.password,
    );
    const userPassword =
      updateUserDto.password === undefined ||
      updateUserDto.password === user.password
        ? updateUserDto.password
        : hashedPassword;

    const data: Prisma.usersUpdateInput = {
      ...updateUserDto,
      password: userPassword,
      status: updateUserDto.status as UserStatus,
      updated_at: new Date(),
    };

    try {
      const updatedUser = await this.prismaService.users.update({
        where: { id },
        data,
      });

      return updatedUser;
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Error trying to update user. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async remove(id: string, loggedUserId: string): Promise<User> {
    if (id === loggedUserId) {
      throw new ConflictException('Unable to delete your own user account!');
    }

    const user = await this.findOne(id);

    try {
      const updatedUser = await this.prismaService.users.delete({
        where: { id: user.id },
      });

      return updatedUser;
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Erro ao tentar excluir Usuário. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.users.findMany();

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });

    return user;
  }
}
