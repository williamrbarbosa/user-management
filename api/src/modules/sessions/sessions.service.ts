import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { randomUUID } from 'crypto';
import { SessionsRepository } from './sessions.repository';
import { AppError } from '../common/models';
import { Prisma, UserStatus } from '@prisma/client';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createInternal(createSessionDto: CreateSessionDto): Promise<Session> {
    const { user_id, ...sessionDto } = createSessionDto;

    const session = await this.findActiveByUserId(user_id);
    if (session) {
      return session;
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('Inactive users cannot create sessions.');
    }

    const data: Prisma.sessionsCreateInput = {
      ...sessionDto,
      id: randomUUID(),
      user: {
        connect: {
          id: user.id,
        },
      },
      created_at: new Date(),
      terminated_at: null,
    };

    try {
      const session = await this.sessionsRepository.create(data);

      if (session) {
        await this.usersRepository.updateLoginCount(user.id, user.login_count);
      }

      return session;
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Error trying to create session. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async terminate(user_id: string): Promise<Session> {
    const session = await this.findActiveByUserId(user_id);
    if (!session) {
      throw new BadRequestException(
        'There is no active Session for this user.',
      );
    }

    try {
      return this.sessionsRepository.terminate(session.id);
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Error trying to create session. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionsRepository.findById(id);

    if (!session) {
      throw new NotFoundException('Session not found.');
    }

    return session;
  }

  findAllByUserId(user_id: string): Promise<Session[]> {
    return this.sessionsRepository.findByUserId(user_id);
  }

  findActiveByUserId(user_id: string): Promise<Session> {
    return this.sessionsRepository.findActiveByUserId(user_id);
  }
}
