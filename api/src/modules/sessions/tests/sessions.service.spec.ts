import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SessionsService } from '../sessions.service';
import { SessionsRepository } from '../sessions.repository';
import { randomUUID } from 'crypto';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UserStatus } from '@prisma/client';
import { User } from 'src/modules/users/entities/user.entity';
import { Session } from '../entities/session.entity';

describe('SessionsService', () => {
  let service: SessionsService;
  let repository: SessionsRepository;
  let usersRepository: UsersRepository;

  const sessionsRepositoryMock = {
    create: jest.fn(),
    terminate: jest.fn(),
    findById: jest.fn(),
    findAllByUserId: jest.fn(),
    findActiveByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: SessionsRepository,
          useValue: sessionsRepositoryMock,
        },
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    repository = module.get<SessionsRepository>(SessionsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create session when user is active and no active session exists', async () => {
    const userId = randomUUID();

    jest.spyOn(usersRepository, 'findById').mockResolvedValue({
      id: userId,
      status: UserStatus.ACTIVE,
    } as User);

    jest.spyOn(repository, 'findActiveByUserId').mockResolvedValue(null);

    const session: Session = {
      id: randomUUID(),
      user_id: userId,
      created_at: new Date(),
      terminated_at: null,
    };
    jest.spyOn(repository, 'create').mockResolvedValue(session);

    const result = await service.createInternal({ user_id: userId });

    expect(result).toHaveProperty('id');
    expect(jest.spyOn(usersRepository, 'findById')).toHaveBeenCalledWith(
      userId,
    );
    expect(jest.spyOn(repository, 'findActiveByUserId')).toHaveBeenCalledWith(
      userId,
    );
    expect(jest.spyOn(repository, 'create')).toHaveBeenCalled();
  });

  it('should throw if user is inactive', async () => {
    const userId = randomUUID();

    jest.spyOn(usersRepository, 'findById').mockResolvedValue({
      id: userId,
      status: UserStatus.INACTIVE,
    } as User);

    await expect(service.createInternal({ user_id: userId })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if user does not exist', async () => {
    const userId = randomUUID();

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

    await expect(service.createInternal({ user_id: userId })).rejects.toThrow(
      NotFoundException,
    );

    expect(jest.spyOn(usersRepository, 'findById')).toHaveBeenCalledWith(
      userId,
    );
    expect(jest.spyOn(repository, 'create')).not.toHaveBeenCalled();
  });

  it('should terminate active session', async () => {
    const userId = randomUUID();
    const sessionId = randomUUID();

    const terminateSession: Session = {
      id: sessionId,
      user_id: userId,
      created_at: new Date(),
      terminated_at: new Date(),
    };

    jest.spyOn(repository, 'findActiveByUserId').mockResolvedValue({
      ...terminateSession,
      terminated_at: null,
    } as Session);

    jest.spyOn(repository, 'terminate').mockResolvedValue(terminateSession);

    const result = await service.terminate(userId);

    expect(result.terminated_at).toBeInstanceOf(Date);
    expect(jest.spyOn(repository, 'findActiveByUserId')).toHaveBeenCalledWith(
      userId,
    );
    expect(jest.spyOn(repository, 'terminate')).toHaveBeenCalledWith(sessionId);
  });

  it('should throw if no active session exists', async () => {
    const userId = randomUUID();

    jest.spyOn(repository, 'findActiveByUserId').mockResolvedValue(null);

    await expect(service.terminate(userId)).rejects.toThrow(
      BadRequestException,
    );

    expect(jest.spyOn(repository, 'findActiveByUserId')).toHaveBeenCalledWith(
      userId,
    );
    expect(jest.spyOn(repository, 'terminate')).not.toHaveBeenCalled();
  });
});
