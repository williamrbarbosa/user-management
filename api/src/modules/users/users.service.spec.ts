import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { users } from 'src/prisma/schema/seeds/Users';
import { HashService } from 'src/common/hash.service';
import { BrokersService } from 'src/brokers/brokers.service';
import { v4 as uuidv4 } from 'uuid';
import { BrokerGroupsService } from 'src/broker_groups/brokerGroups.service';
import { JwtService } from '@nestjs/jwt';

const mockedUser: CreateUserDto = users[0];
const mockedCreateDto: CreateUserDto = users[0];
const mockedExistingDto: CreateUserDto = users[1];

describe('UsersService', () => {
  let usersService: UsersService;

  const prismaServiceMock = {
    users: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        HashService,
        BrokerGroupsService,
        BrokersService,
        JwtService,
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('User Service should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('Should pass on create a new User if CPF is unique for the group', async () => {
      const expectedResult: User = { ...mockedCreateDto };

      prismaServiceMock.users.findFirst.mockResolvedValue(null);
      prismaServiceMock.users.create.mockResolvedValue(expectedResult);

      const createdRecord = await usersService.create(
        mockedCreateDto,
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(createdRecord).toEqual(expectedResult);
      expect(createdRecord.id).toBeDefined();
      expect(createdRecord.broker_groups.id).toEqual(
        mockedUser.broker_group_id,
      );
      expect(createdRecord.brokers.id).toEqual(mockedUser.broker_id);
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          cpf: mockedCreateDto.cpf,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.create).toHaveBeenCalledWith(
        expect.anything(),
      );
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledTimes(2);
      expect(prismaServiceMock.users.create).toHaveBeenCalledTimes(1);
    });

    it('Should return ConflictException on create a new User ("Já existe um usuário com esse CPF.")', async () => {
      prismaServiceMock.users.findFirst.mockResolvedValue(mockedExistingDto);

      await expect(
        usersService.create(
          mockedExistingDto,
          mockedUser.broker_group_id,
          mockedUser.broker_id,
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      await expect(
        usersService.create(
          mockedExistingDto,
          mockedUser.broker_group_id,
          mockedUser.broker_id,
        ),
      ).rejects.toThrow('Já existe um usuário com esse CPF.');

      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          cpf: mockedExistingDto.cpf,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.create).not.toHaveBeenCalled();
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledTimes(2);
    });

    it('Should return ConflictException on create a new User ("Esse e-mail já está em uso.")', async () => {
      prismaServiceMock.users.findFirst.mockImplementation((params) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (params.where && params.where.cpf === mockedExistingDto.cpf) {
          return Promise.resolve(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (params.where && params.where.email === mockedExistingDto.email) {
          return Promise.resolve(mockedExistingDto);
        }
        return Promise.resolve(null);
      });

      await expect(
        usersService.create(
          mockedExistingDto,
          mockedUser.broker_group_id,
          mockedUser.broker_id,
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      await expect(
        usersService.create(
          mockedExistingDto,
          mockedUser.broker_group_id,
          mockedUser.broker_id,
        ),
      ).rejects.toThrow('Esse e-mail já está em uso.');

      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          cpf: mockedExistingDto.cpf,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          email: mockedExistingDto.email,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.create).not.toHaveBeenCalled();
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledTimes(4);
    });
  });

  describe('update', () => {
    it('Should pass on update an User', async () => {
      const changedMockDTO: CreateUserDto = {
        ...mockedExistingDto,
        name: users[2].name,
        email: users[2].email,
        updated_at: new Date(),
      };
      const expectedResult: User = changedMockDTO;

      prismaServiceMock.users.findUnique.mockResolvedValue(mockedExistingDto);
      prismaServiceMock.users.update.mockResolvedValue(expectedResult);

      const updatedRecord = await usersService.update(
        changedMockDTO.id,
        changedMockDTO,
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(updatedRecord).toEqual(expectedResult);
      expect(updatedRecord.broker_groups.id).toEqual(
        mockedUser.broker_group_id,
      );
      expect(updatedRecord.brokers.id).toEqual(mockedUser.broker_id);
      expect(updatedRecord.name).not.toEqual(mockedExistingDto.name);
      expect(updatedRecord.email).not.toEqual(mockedExistingDto.email);
      expect(updatedRecord).not.toEqual(mockedExistingDto);
      expect(updatedRecord.updated_at > updatedRecord.created_at).toBeTruthy();

      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          id: mockedExistingDto.id,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.update).toHaveBeenCalledWith(
        expect.anything(),
      );
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.users.update).toHaveBeenCalledTimes(1);
    });

    it('Should return NotFoundException if User does not exist', async () => {
      const notFoundDTO = {
        ...mockedExistingDto,
        id: uuidv4(),
      };

      prismaServiceMock.users.findUnique.mockResolvedValue(null);

      await expect(
        usersService.update(
          notFoundDTO.id,
          notFoundDTO,
          mockedUser.broker_group_id,
          mockedUser.broker_id,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          id: notFoundDTO.id,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.update).not.toHaveBeenCalled();
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePassword', () => {
    it('Should pass on update an User', async () => {
      const changedMockDTO: CreateUserDto = {
        ...mockedExistingDto,
        password: '123@Changed',
        updated_at: new Date(),
      };

      const expectedResult: { status: number; message: string } = {
        status: 200,
        message: 'Senha alterada com sucesso.',
      };

      prismaServiceMock.users.findUnique.mockResolvedValue(mockedExistingDto);
      prismaServiceMock.users.update.mockResolvedValue(expectedResult);

      const updatedRecord = await usersService.updatePassword(
        changedMockDTO.id,
        changedMockDTO.password,
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(updatedRecord).toEqual(expectedResult);
      expect(updatedRecord.message).toEqual('Senha alterada com sucesso.');
      expect(updatedRecord.status).toEqual(200);
      expect(updatedRecord).not.toEqual(mockedExistingDto);

      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          id: mockedExistingDto.id,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.update).toHaveBeenCalledWith(
        expect.anything(),
      );
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.users.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('Should pass on remove an User', async () => {
      const deleteMockDTO: CreateUserDto = {
        ...mockedCreateDto,
        updated_at: new Date(),
        deleted_at: new Date(),
      };
      const expectedResult: User = deleteMockDTO;

      prismaServiceMock.users.findUnique.mockResolvedValue(deleteMockDTO);
      prismaServiceMock.users.update.mockResolvedValue(expectedResult);

      const deletedRecord = await usersService.remove(
        deleteMockDTO.id,
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(deletedRecord).toEqual(expectedResult);
      expect(deletedRecord.deleted_at).not.toEqual(null);

      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          id: deleteMockDTO.id,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.update).toHaveBeenCalledWith(
        expect.anything(),
      );
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.users.update).toHaveBeenCalledTimes(1);
    });

    it('Should return NotFoundException if User does not exist', async () => {
      const notFoundDTO = {
        ...mockedExistingDto,
        id: uuidv4(),
      };

      prismaServiceMock.users.findUnique.mockResolvedValue(null);

      await expect(
        usersService.remove(
          notFoundDTO.id,
          mockedUser.broker_group_id,
          mockedUser.broker_id,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          id: notFoundDTO.id,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.update).not.toHaveBeenCalled();
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('Should pass on list Users', async () => {
      const expectedBrokersList: User[] = [mockedCreateDto, mockedExistingDto];

      prismaServiceMock.users.findMany.mockResolvedValue([
        mockedCreateDto,
        mockedExistingDto,
      ]);

      const users = await usersService.findAll(
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(users).toEqual(expectedBrokersList);
      expect(prismaServiceMock.users.findMany).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(users.length).toBe(2);
      expect(prismaServiceMock.users.findMany).toHaveBeenCalledTimes(1);
    });

    it('Should return an empty array if no Users are found for Group', async () => {
      const brokerGroupId: string = uuidv4();
      const brokerId: string = uuidv4();

      prismaServiceMock.users.findMany.mockResolvedValue([]);

      const users = await usersService.findAll(brokerGroupId, brokerId);

      expect(users).toEqual([]);
      expect(prismaServiceMock.users.findMany).toHaveBeenCalledWith({
        include: {
          broker_groups: true,
          brokers: true,
        },
        where: {
          broker_group_id: brokerGroupId,
          broker_id: brokerId,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('Should find and return a valid User by id', async () => {
      const expectedResult: User = mockedExistingDto;

      prismaServiceMock.users.findUnique.mockResolvedValue(mockedExistingDto);

      const user = await usersService.findOne(
        mockedExistingDto.id,
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(user).toEqual(expectedResult);
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          id: mockedExistingDto.id,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledTimes(1);
    });

    it('Should throw NotFoundException if user is not found by id', async () => {
      const brokerId: string = uuidv4();

      prismaServiceMock.users.findUnique.mockResolvedValue(null);

      await expect(
        usersService.findOne(
          brokerId,
          mockedUser.broker_group_id,
          mockedUser.broker_id,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          id: brokerId,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCpf', () => {
    it('Should find and return a valid User by CPF', async () => {
      const expectedResult: User = mockedExistingDto;

      prismaServiceMock.users.findFirst.mockResolvedValue(mockedExistingDto);

      const user = await usersService.findByCpf(
        mockedExistingDto.cpf,
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(user).toEqual(expectedResult);
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          cpf: mockedExistingDto.cpf,
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledTimes(1);
    });

    it('Should return an empty array if user is not found by CPF', async () => {
      const expectedResult = null;

      prismaServiceMock.users.findFirst.mockResolvedValue(null);

      const user = await usersService.findByCpf(
        '99999999999',
        mockedUser.broker_group_id,
        mockedUser.broker_id,
      );

      expect(user).toEqual(expectedResult);
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledWith({
        include: { broker_groups: true, brokers: true },
        where: {
          cpf: '99999999999',
          broker_group_id: mockedUser.broker_group_id,
          broker_id: mockedUser.broker_id,
          deleted_at: null,
        },
      });
      expect(prismaServiceMock.users.findFirst).toHaveBeenCalledTimes(1);
    });
  });
});
