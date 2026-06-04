import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { randomUUID } from 'crypto';
import { SessionsRepository } from './sessions.repository';
import { Prisma, UserStatus } from '@prisma/client';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createInternal(createSessionDto: CreateSessionDto): Promise<Session> {
    const { user_id } = createSessionDto;

    const activeSession = await this.findActiveByUserId(user_id);
    if (activeSession) {
      return activeSession;
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('Inactive users cannot create sessions.');
    }

    const data: Prisma.sessionsCreateInput = {
      id: randomUUID(),
      user: { connect: { id: user.id } },
      created_at: new Date(),
      terminated_at: null,
    };

    try {
      const session = await this.sessionsRepository.create(data);
      await this.usersRepository.updateLoginCount(user.id, user.login_count);
      return session;
    } catch (err) {
      this.logger.error('Error creating session', err);
      throw new BadRequestException('Error trying to create session.');
    }
  }

  async terminate(user_id: string): Promise<Session> {
    const session = await this.findActiveByUserId(user_id);
    if (!session) {
      throw new BadRequestException('There is no active session for this user.');
    }

    try {
      return this.sessionsRepository.terminate(session.id);
    } catch (err) {
      this.logger.error('Error terminating session', err);
      throw new BadRequestException('Error trying to terminate session.');
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

  findActiveByUserId(user_id: string): Promise<Session | null> {
    return this.sessionsRepository.findActiveByUserId(user_id);
  }
}
