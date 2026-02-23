import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { v4 as uuidv4 } from 'uuid';
import { SessionsRepository } from './sessions.repository';
import { AppError } from '../common/models';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const { user_id, ...sessionDto } = createSessionDto;

    const session = await this.findActiveByUserId(user_id);
    if (session) {
      throw new ConflictException('This user already has an active Session.');
    }

    const data: Prisma.sessionsCreateInput = {
      ...sessionDto,
      id: uuidv4(),
      user: {
        connect: {
          id: user_id,
        },
      },
      created_at: new Date(),
      terminated_at: null,
    };

    try {
      return this.sessionsRepository.create(data);
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Error trying to create session. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async terminateSession(user_id: string): Promise<Session> {
    const session = await this.findActiveByUserId(user_id);
    if (!session) {
      throw new ConflictException('There is no active Session for this user.');
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
