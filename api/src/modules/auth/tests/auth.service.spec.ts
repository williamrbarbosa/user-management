import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { HashService } from '../../common/hash.service';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from '../../sessions/sessions.service';
import { UserStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { RegisterDto } from '../dto/register.dto';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const hashServiceMock = {
    comparePassword: jest.fn(),
  };

  const sessionsServiceMock = {
    createInternal: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: HashService, useValue: hashServiceMock },
        { provide: SessionsService, useValue: sessionsServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate user successfully', async () => {
    const user = {
      id: randomUUID(),
      email: 'user.email@gmail.com',
      password: 'hashed-passwd',
      status: UserStatus.ACTIVE,
    };

    usersServiceMock.findByEmail.mockResolvedValue(user);
    hashServiceMock.comparePassword.mockResolvedValue(true);

    const result = await service.validateUser(user.email, '123');

    expect(result.password).toBe('');
    expect(result.id).toBe(user.id);
    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(hashServiceMock.comparePassword).toHaveBeenCalled();
  });

  it('should throw if user not found', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    await expect(
      service.validateUser('caeser.doe@gmail.com', '123456'),
    ).rejects.toThrow(UnauthorizedError);

    expect(usersServiceMock.findByEmail).toHaveBeenCalled();
  });

  it('should throw if user is inactive', async () => {
    const user = {
      id: randomUUID(),
      email: 'caeser.doe@gmail.com',
      password: 'hashed-passwd',
      status: UserStatus.INACTIVE,
    };

    usersServiceMock.findByEmail.mockResolvedValue(user);

    await expect(
      service.validateUser(user.email, user.password),
    ).rejects.toThrow(UnauthorizedError);

    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(user.email);
  });

  it('should throw if password is invalid', async () => {
    const user = {
      id: randomUUID(),
      email: 'jane.doe@gmail.com',
      password: 'hashed-passwd',
      status: UserStatus.ACTIVE,
    };

    usersServiceMock.findByEmail.mockResolvedValue(user);

    hashServiceMock.comparePassword.mockResolvedValue(false);

    await expect(service.validateUser(user.email, '123456')).rejects.toThrow(
      UnauthorizedError,
    );

    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(hashServiceMock.comparePassword).toHaveBeenCalled();
  });

  it('should login and create session', async () => {
    const user = {
      id: randomUUID(),
      first_name: 'Will',
      last_name: 'Barbosa',
      email: 'will.b@gmail.com',
      status: UserStatus.ACTIVE,
    };

    sessionsServiceMock.createInternal.mockResolvedValue({
      id: randomUUID(),
    });

    jwtServiceMock.sign.mockReturnValue('jwt-token');

    const result = await service.login(user, false);

    expect(sessionsServiceMock.createInternal).toHaveBeenCalled();
    expect(jwtServiceMock.sign).toHaveBeenCalled();
    expect(result.accessToken).toBe('jwt-token');
  });

  it('should change expiration when rememberme = true', async () => {
    const user = {
      id: randomUUID(),
      first_name: 'Will',
      last_name: 'Barbosa',
      email: 'will.b@gmail.com',
      status: UserStatus.ACTIVE,
    };

    sessionsServiceMock.createInternal.mockResolvedValue({
      id: randomUUID(),
    });

    jwtServiceMock.sign.mockReturnValue('jwt-token');

    const result = await service.login(user, true);

    expect(result.expiresIn).toBe(86400);
  });

  it('should register user', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);
    usersServiceMock.create.mockResolvedValue({ email: 'a@a.com' });

    const result = await service.register({
      email: 'a@a.com',
      first_name: 'Will',
      last_name: 'Barbosa',
      user_password: '123',
      user_confirm_password: '123',
    });

    expect(result.status).toBe(200);
    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith('a@a.com');
  });

  it('should throw if email already exists', async () => {
    const user: RegisterDto = {
      first_name: 'Achilleus',
      last_name: 'Trojan',
      email: 'try.achilleus@gmail.com',
      user_password: '1234@ChangeIt',
      user_confirm_password: '1234@ChangeIt',
    };
    usersServiceMock.findByEmail.mockResolvedValue({});

    await expect(service.register(user)).rejects.toThrow(ConflictException);

    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(user.email);
  });
});
