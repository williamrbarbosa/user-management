import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository, UsersRepository],
  exports: [SessionsService],
})
export class SessionsModule {}
