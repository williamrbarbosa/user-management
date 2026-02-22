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

  delete(id: string): Promise<User> {
    return this.prismaService.users.delete({ where: { id } });
  }

  findAll(skip: number = 0, take: number = 6): Promise<User[] | null> {
    return this.prismaService.users.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' },
    });
  }

  count() {
    return this.prismaService.users.count();
  }

  findById(id: string): Promise<User | null> {
    return this.prismaService.users.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.users.findUnique({ where: { email } });
  }
}
