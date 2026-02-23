import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.sessionsCreateInput): Promise<Session> {
    return this.prismaService.sessions.create({ data });
  }

  terminate(id: string): Promise<Session> {
    return this.prismaService.sessions.update({
      where: { id },
      data: { terminated_at: new Date() },
    });
  }

  findById(id: string): Promise<Session | null> {
    return this.prismaService.sessions.findUnique({ where: { id } });
  }

  findByUserId(user_id: string): Promise<Session[] | []> {
    return this.prismaService.sessions.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
  }

  findActiveByUserId(user_id: string): Promise<Session | null> {
    return this.prismaService.sessions.findFirst({
      where: { user_id, terminated_at: null },
    });
  }
}
