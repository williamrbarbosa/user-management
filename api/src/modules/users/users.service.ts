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
import { HashService } from '../common/hash.service';
import { AppError } from '../common/models';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
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
      status: UserStatus.ACTIVE,
      password: hashedPassword,
      //- Creation time cannot be updated but Last update time must always be updated.
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      return this.usersRepository.create(data);
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

    //Validating:
    //- First and Last Name properties cannot be updated if the user is inactive.
    const isNameChangeBlocked =
      user.status === UserStatus.INACTIVE &&
      (updateUserDto.first_name !== user.first_name ||
        updateUserDto.last_name !== user.last_name);
    if (isNameChangeBlocked) {
      throw new BadRequestException(
        'Inactive users cannot update first or last name',
      );
    }

    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      password = await this.hashService.hashPassword(updateUserDto.password);
    }

    const data: Prisma.usersUpdateInput = {
      ...updateUserDto,
      first_name: updateUserDto.first_name,
      last_name: updateUserDto.last_name,
      password,
      status: updateUserDto.status as UserStatus,
      //- Creation time cannot be updated but Last update time must always be updated.
      updated_at: new Date(),
    };

    try {
      return this.usersRepository.update(id, data);
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
      const deletedUser = await this.usersRepository.delete(user.id);

      return deletedUser;
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Error trying to delete user. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 6,
  ): Promise<{
    data: User[];
    meta: { total: number; page: number; lastPage: number };
  }> {
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

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findByEmail(email);
  }
}
