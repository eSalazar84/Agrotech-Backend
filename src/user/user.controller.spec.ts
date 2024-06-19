import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IUser } from './interface/user.interface';
import { Rol } from '../helpers/enums-type.enum';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService

  let mockedArrayValues: IUser[] = [
    {
      "name": "Anabel",
      "lastname": "Assann",
      "email": "anabel@gmail.com",
      "rol": Rol.USER,
      "active": true,
      "phone": "2281513051",
      "birthDate": new Date("1984-05-13T13:54:00.000Z"),
      "createdAt": new Date("2024-03-18T13:54:00.000Z"),
      "idUser": 1,
      "address": "Avda. Libertad 200"
    },
    {
      "name": "Fabricio",
      "lastname": "Cordoba",
      "email": "fabricio@gmail.com",
      "rol": Rol.USER,
      "active": true,
      "phone": "2281529854",
      "birthDate": new Date("1984-05-13T13:54:0)0.000Z"),
      "createdAt": new Date("2024-03-18T13:54:00.000Z"),
      "idUser": 2,
      "address": "San Martin 358"
    },
    {
      "name": "Emi",
      "lastname": "Salazar",
      "email": "esalazar@gmail.com",
      "rol": Rol.USER,
      "active": true,
      "phone": "2281513051",
      "birthDate": new Date("1984-05-13T13:54:00.000Z"),
      "createdAt": new Date("2024-03-18T13:54:00.000Z"),
      "idUser": 3,
      "address": "La Rioja 265"
    }
  ]

  const mockUserRepository = {
    createUser: jest.fn((newUser: IUser) => {
      mockedArrayValues.push(newUser);
      return newUser
    }),
    findAllUser: jest.fn(() => mockedArrayValues),
    findOneUser: jest.fn((id: number) => mockedArrayValues.find(user => user.idUser === id)),
    removeUser: jest.fn((id: number) => {
      const index = mockedArrayValues.findIndex(user => user.idUser === id);
      if (index !== -1) {
        return mockedArrayValues.splice(index, 1)[0];
      } else {
        return null;
      }
    }),
    updateUser: jest.fn((id: number, updateData: Partial<IUser>) => {
      const userToUpdateIndex = mockedArrayValues.findIndex(user => user.idUser === id);
      if (userToUpdateIndex !== -1) {
        mockedArrayValues[userToUpdateIndex] = { ...mockedArrayValues[userToUpdateIndex], ...updateData };
        return mockedArrayValues[userToUpdateIndex];
      } else {
        return null;
      }
    }),
    findUserByEmail: jest.fn((email: string) => mockedArrayValues.find(user => user.email === email))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserRepository)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService)
  });

  describe('User Controller test', () => {
    it('should be defined', () => {
      expect(userController).toBeDefined()
    })

    describe('Testing over create method', () => {
      it('should return a new user', async () => {
        const newUserData = {
          "name": "Jorge Anibal",
          "lastname": "Sardon",
          "email": "jsardon@gmail.com",
          "password": "abc123",
          "rol": Rol.ADMIN,
          "active": true,
          "phone": "2494514469",
          "birthDate": new Date("1987-05-13T13:54:00.000Z"),
          "createdAt": new Date(),
          "idUser": 4,
          "address": "Calle false 123"
        }
        const newUserSpy = mockUserRepository.createUser(newUserData);
        const newUserReal = await userController.create(newUserData)
        expect(newUserReal).toEqual(newUserSpy)
      })
    })

    describe('Testing over read method', () => {
      it('should return all users', async () => {
        const userSpy = mockUserRepository.findAllUser();
        const userReal = await userController.findAll()
        expect(userReal).toEqual(userSpy);
      });

      it('should be return one user by id', async () => {
        const oneUserSpy = mockUserRepository.findOneUser(mockedArrayValues[1].idUser);
        const oneUserReal = await userController.findOne(mockedArrayValues[1].idUser);
        expect(oneUserReal).toEqual(oneUserSpy);
      })
    })

    describe('Testing over delete method', () => {
      it('should delete a user by id', async () => {
        const deleteById = 1;
        const userFound = mockedArrayValues.find(user => user.idUser === deleteById);
        const deleteUserSpy = mockUserRepository.removeUser(userFound.idUser);
        const deleteUserReal = await userController.remove(deleteById);
        expect(deleteUserReal).toBeNull();
        expect(deleteUserSpy).toEqual(userFound);
      });
    });

    describe('Testing over patch method', () => {
      it('should be return a update user', async () => {
        const updateUserData = {
          "name": "Emiliano César",
          "lastname": "Salazar",
          "email": "salazaremiliano84@gmail.com",
          "rol": Rol.USER,
          "active": true,
          "phone": "2281514469",
          "birthDate": new Date("1984-05-13T13:54:00.000Z"),
          "createdAt": new Date("2024-03-18T13:54:00.000Z"),
          "idUser": 3,
          "address": "calle falsa 123"
        };

        const updateUserSpy = mockUserRepository.updateUser(updateUserData.idUser, updateUserData)
        const updateUserReal = await userController.update(updateUserData.idUser, updateUserData)
        expect(updateUserReal).toEqual(updateUserSpy);
      });
    })

    it('should be create a new user', async () => {
      const newUserData = {
        "name": "Jorge Anibal",
        "lastname": "Sardon",
        "email": "jsardon@gmail.com",
        "password": "abc123",
        "rol": Rol.ADMIN,
        "active": true,
        "phone": "2494514469",
        "birthDate": new Date("1987-05-13T13:54:00.000Z"),
        "createdAt": new Date(),
        "idUser": 9,
        "address": "calle falsa 123"
      }

      const mailFound = mockUserRepository.findUserByEmail(newUserData.email)

      if (mailFound) {
        jest.spyOn(userService, 'createUser').mockResolvedValue(mailFound)
        const createUser = await userController.create(newUserData)

        expect(createUser).toBeDefined()
      } else {
        expect(newUserData).toBeNull()
      }
    })
  })
});
