import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AppError } from '../common/models';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const { user_id, ...sessionDto } = createSessionDto;

    const session = await this.findByActivebyUserId(user_id);
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
      const createdSession = await this.prismaService.sessions.create({
        data,
      });

      return createdSession;
    } catch (err) {
      const error = err as AppError;
      throw new BadRequestException(
        'Error trying to create session. ' + error.message,
        { cause: error, description: error.message },
      );
    }
  }

  async findAllByUserId(user_id: string): Promise<Session[]> {
    const sessions = await this.prismaService.sessions.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });

    return sessions;
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.prismaService.sessions.findUnique({
      where: {
        id,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found.');
    }

    return session;
  }

  async findByActivebyUserId(user_id: string): Promise<Session> {
    const session = await this.prismaService.sessions.findFirst({
      where: {
        user_id,
        terminated_at: null,
      },
    });

    return session;
  }
}
