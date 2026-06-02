import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { HashService } from 'src/modules/common/hash.service';
import { randomUUID } from 'crypto';

describe('UsersService', () => {
  let service: UsersService;

  const usersRepositoryMock = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
  };

  const hashServiceMock = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepositoryMock },
        { provide: HashService, useValue: hashServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    usersRepositoryMock.findByEmail.mockResolvedValue(null);
    hashServiceMock.hashPassword.mockResolvedValue('hashed-password');
    usersRepositoryMock.create.mockResolvedValue({
      id: randomUUID(),
      email: 'test@test.com',
      first_name: 'Test',
      last_name: 'User',
      status: UserStatus.ACTIVE,
    });

    const result = await service.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@test.com',
      password: '123456',
    });

    expect(result).toBeDefined();
    expect(usersRepositoryMock.findByEmail).toHaveBeenCalled();
    expect(hashServiceMock.hashPassword).toHaveBeenCalledWith('123456');
    expect(usersRepositoryMock.create).toHaveBeenCalled();
  });

  it('should throw conflict if email already exists', async () => {
    usersRepositoryMock.findByEmail.mockResolvedValue({ id: randomUUID() });

    await expect(
      service.create({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toThrow(ConflictException);

    expect(usersRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should not allow name update if user is inactive', async () => {
    const userId = randomUUID();
    usersRepositoryMock.findById.mockResolvedValue({
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      status: UserStatus.INACTIVE,
    });

    await expect(
      service.update(userId, {
        first_name: 'Jane',
        last_name: 'Smith',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should allow updating other fields even if user is inactive', async () => {
    const userId = randomUUID();
    usersRepositoryMock.findById.mockResolvedValue({
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      status: UserStatus.INACTIVE,
    });
    usersRepositoryMock.update.mockResolvedValue({ id: userId });

    const result = await service.update(userId, {
      email: 'new@email.com',
      status: UserStatus.ACTIVE,
    });

    expect(result).toBeDefined();
    expect(usersRepositoryMock.update).toHaveBeenCalled();
  });

  it('should not hash password if not provided in update', async () => {
    const userId = randomUUID();
    usersRepositoryMock.findById.mockResolvedValue({
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      status: UserStatus.ACTIVE,
    });
    usersRepositoryMock.update.mockResolvedValue({ id: userId });

    await service.update(userId, { email: 'new@email.com' });

    expect(hashServiceMock.hashPassword).not.toHaveBeenCalled();
  });

  it('should hash password if provided in update', async () => {
    const userId = randomUUID();
    usersRepositoryMock.findById.mockResolvedValue({
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      status: UserStatus.ACTIVE,
    });
    hashServiceMock.hashPassword.mockResolvedValue('new-hashed-password');
    usersRepositoryMock.update.mockResolvedValue({ id: userId });

    await service.update(userId, { password: 'NewPass@123' });

    expect(hashServiceMock.hashPassword).toHaveBeenCalledWith('NewPass@123');
  });

  it('should delete user if not the logged-in user', async () => {
    const userId = randomUUID();
    const loggedUserId = randomUUID();

    usersRepositoryMock.findById.mockResolvedValue({ id: userId });
    usersRepositoryMock.delete.mockResolvedValue({ id: userId });

    const result = await service.remove(userId, loggedUserId);

    expect(result).toBeDefined();
    expect(usersRepositoryMock.delete).toHaveBeenCalledWith(userId);
  });

  it('should throw not found when deleting a non-existing user', async () => {
    const userId = randomUUID();
    const loggedUserId = randomUUID();

    usersRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.remove(userId, loggedUserId)).rejects.toThrow();
  });

  it('should not allow deleting own user account', async () => {
    const userId = randomUUID();

    await expect(service.remove(userId, userId)).rejects.toThrow(
      'Unable to delete your own user account!',
    );
  });

  it('should list users with pagination', async () => {
    const userId = randomUUID();
    usersRepositoryMock.findAll.mockResolvedValue([{ id: userId }]);
    usersRepositoryMock.count.mockResolvedValue(1);

    const result = await service.findAll(1);

    expect(result.data.length).toBe(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.page).toBe(1);
    expect(usersRepositoryMock.findAll).toHaveBeenCalledWith(0, 6);
  });
});
