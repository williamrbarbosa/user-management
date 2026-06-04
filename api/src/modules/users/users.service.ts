import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Prisma, UserStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { HashService } from '../common/hash.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );

    const data: Prisma.usersCreateInput = {
      id: randomUUID(),
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password: hashedPassword,
      status: createUserDto.status ?? UserStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      return this.usersRepository.create(data);
    } catch (err) {
      this.logger.error('Error creating user', err);
      throw new BadRequestException('Error trying to create user.');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const isNameChangeBlocked =
      user.status === UserStatus.INACTIVE &&
      (
        (updateUserDto.first_name !== undefined && updateUserDto.first_name !== user.first_name) ||
        (updateUserDto.last_name !== undefined && updateUserDto.last_name !== user.last_name)
      );

    if (isNameChangeBlocked) {
      throw new BadRequestException(
        'Inactive users cannot update first or last name.',
      );
    }

    const hashedPassword = updateUserDto.password
      ? await this.hashService.hashPassword(updateUserDto.password)
      : undefined;

    const data: Prisma.usersUpdateInput = {
      first_name: updateUserDto.first_name,
      last_name: updateUserDto.last_name,
      email: updateUserDto.email,
      password: hashedPassword,
      status: updateUserDto.status,
      updated_at: new Date(),
    };

    try {
      return this.usersRepository.update(id, data);
    } catch (err) {
      this.logger.error('Error updating user', err);
      throw new BadRequestException('Error trying to update user.');
    }
  }

  async remove(id: string, loggedUserId: string): Promise<User> {
    if (id === loggedUserId) {
      throw new ConflictException('Unable to delete your own user account!');
    }

    const user = await this.findOne(id);

    try {
      return this.usersRepository.delete(user.id);
    } catch (err) {
      this.logger.error('Error deleting user', err);
      throw new BadRequestException('Error trying to delete user.');
    }
  }

  async findAll(page: number = 1): Promise<{
    data: User[];
    meta: { total: number; page: number; lastPage: number };
  }> {
    const limit = 6;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.usersRepository.findAll(skip, limit),
      this.usersRepository.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findOneWithSessions(id: string): Promise<User> {
    const user = await this.usersRepository.findByIdWithSessions(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
}
