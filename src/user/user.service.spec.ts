import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Rol } from '../helpers/enums-type.enum';

export const mockedUserValues = [
  {
    idUser: 1,
    name: 'Anabel',
    lastname: 'Assann',
    email: 'anabel@gmail.com',
    phone: '2281513051',
    birthDate: new Date('1984-05-13T13:54:00.000Z'),
    createdAt: new Date('2024-03-18T13:54:00.000Z'),
    active: true,
    rol: 'user',
  },
  {
    idUser: 5,
    name: 'Fabricio',
    lastname: 'Cordoba',
    email: 'fabricio@gmail.com',
    phone: '2281529854',
    birthDate: new Date('1984-05-13T13:54:00.000Z'),
    createdAt: new Date('2024-03-18T13:54:00.000Z'),
    active: true,
    rol: 'user',
  },
];

const mockUserRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  find: jest.fn().mockResolvedValue(mockedUserValues),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn().mockResolvedValue(mockedUserValues[0]), 
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should return all users', async () => {
    const users = await userService.findAllUser()
    expect(users).toEqual(mockedUserValues);
  });

  it('should return a user by id', async () => {
    const userId = 1;
    mockUserRepository.findOne.mockResolvedValue(mockedUserValues[0]);
    const user = await userService.findOneUser(userId);
    expect(user).toEqual(mockedUserValues[0]);
  });

  it('should delete a user by id', async () => {
    const userIdToDelete = 1;
    const mockUserToDelete = {
      ...mockedUserValues[0],
      active: false,
    };

    mockUserRepository.findOne.mockResolvedValue(mockedUserValues[0]);
    mockUserRepository.save.mockResolvedValue(mockUserToDelete);

    const deletedUser = await userService.removeUser(userIdToDelete);

    expect(deletedUser).toEqual(mockUserToDelete);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserToDelete);
  });

  it('should create a new user', async () => {
    const newUser: CreateUserDto = {
      idUser: 6,
      name: 'Emiliano',
      lastname: 'Salazar',
      email: 'esalazar@gmail.com',
      phone: '2281514468',
      password: 'abc123',
      birthDate: new Date('1984-05-13T13:54:00.000Z'),
      createdAt: new Date('2024-03-18T13:54:00.000Z'),
      active: true,
      rol: Rol.USER,
      address: "La Rioja 265"
    };

    mockUserRepository.create.mockResolvedValue(newUser)
    const createUser = await userService.createUser(newUser)
    expect(createUser).toBeDefined()
  })

  describe('Testing over update user', () => {
    it('should update a user', async () => {
      const updateUser: CreateUserDto = {
        idUser: 6,
        name: 'Emiliano',
        lastname: 'Salazar',
        email: 'esalazar@gmail.com',
        phone: '2281514468',
        password: 'abc123',
        birthDate: new Date('1984-05-13T13:54:00.000Z'),
        createdAt: new Date('2024-03-18T13:54:00.000Z'),
        active: true,
        rol: Rol.USER,
        address: "La Rioja 265"
      };

      const userFound = { idUser: 6, ...updateUser };

      mockUserRepository.findOne.mockResolvedValue(updateUser)
      mockUserRepository.save.mockResolvedValue({
        ...userFound,
        ...updateUser
      })
      const userReal = await userService.updateUser(updateUser.idUser, updateUser)

      const { password, ...rest } = updateUser;

      expect(userReal).toEqual(expect.objectContaining(rest));;

      expect(userReal).toEqual(expect.objectContaining(rest));
      expect(userReal).toEqual(rest);
    })
  })
})