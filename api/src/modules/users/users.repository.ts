import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.usersCreateInput): Promise<User> {
    return this.prismaService.users.create({ data });
  }

  update(id: string, data: Prisma.usersUpdateInput): Promise<User> {
    return this.prismaService.users.update({ where: { id }, data });
  }

  updateLoginCount(id: string, userLoginCount: number): Promise<User> {
    const loginCount = userLoginCount + 1;
    return this.prismaService.users.update({
      where: { id },
      data: { login_count: loginCount },
    });
  }

  delete(id: string): Promise<User> {
    return this.prismaService.users.delete({ where: { id } });
  }

  findAll(skip: number = 0, take: number = 6): Promise<User[] | []> {
    return this.prismaService.users.findMany({
      skip,
      take,
      orderBy: [{ first_name: 'asc' }, { last_name: 'asc' }],
    });
  }

  count() {
    return this.prismaService.users.count();
  }

  findById(id: string): Promise<User | null> {
    return this.prismaService.users.findUnique({ where: { id } });
  }

  findByIdWithSessions(id: string): Promise<User | null> {
    return this.prismaService.users.findUnique({
      where: { id },
      include: { sessions: { take: 6, orderBy: { created_at: 'desc' } } },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.users.findUnique({ where: { email } });
  }
}
