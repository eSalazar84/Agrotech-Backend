import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IUser } from './interface/user.interface';
import { Rol } from '../helpers/enums-type.enum';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService

  let mockedUserValues: IUser[] = [
    {
      "name": "Anabel",
      "lastname": "Assann",
      "email": "anabel@gmail.com",
      "rol": Rol.USER,
      "active": true,
      "phone": "2281513051",
      "birthDate": new Date("1984-05-13T13:54:00.000Z"),
      "createdAt": new Date("2024-03-18T13:54:00.000Z"),
      "idUser": 1
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
      "idUser": 5
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
      "idUser": 6
    },
    {
      "name": "Emiliano",
      "lastname": "Salazar",
      "email": "isalazar@gmail.com",
      "rol": Rol.USER,
      "active": true,
      "phone": "2281514468",
      "birthDate": new Date("1984-05-13T13:54:00.000Z"),
      "createdAt": new Date("2024-03-18T13:54:00.000Z"),
      "idUser": 7
    },
    {
      "name": "Emiliano César",
      "lastname": "Salazarrr",
      "email": "emi@gmail.com",
      "rol": Rol.USER,
      "active": true,
      "phone": "2281514468",
      "birthDate": new Date("1984-05-13T13:54:00.000Z"),
      "createdAt": new Date("2024-03-18T13:54:00.000Z"),
      "idUser": 8
    }
  ]

  const mockUserService = {
    findAllUser: () => mockedUserValues,
    findOneUser: (id: number) => mockedUserValues.find(user => user.idUser === id),
    removeUser: (id: number) => {
      const index = mockedUserValues.findIndex(user => user.idUser === id);
      if (index !== -1) {
        return mockedUserValues.splice(index, 1)[0]; // Elimina el usuario y devuelve el usuario eliminado
      } else {
        return null; // Devuelve null si no se encuentra el usuario
      }
    },
    updateUser: (id: number, updateData: Partial<IUser>) => {
      const userToUpdateIndex = mockedUserValues.findIndex(user => user.idUser === id);
      if (userToUpdateIndex !== -1) {
        mockedUserValues[userToUpdateIndex] = { ...mockedUserValues[userToUpdateIndex], ...updateData };
        return mockedUserValues[userToUpdateIndex];
      } else {
        return null;
      }
    },
    findUserByEmail: (email: string) => mockedUserValues.find(user => user.email === email)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService)
  });

  describe('User Controller test', () => {
    it('should be defined', () => {
      expect(userController).toBeDefined()
    })

    it('should return all users', async () => {
      const userSpy = jest.spyOn(userService, 'findAllUser').mockResolvedValue(mockedUserValues);
      const users = await userController.findAll();
      expect(users).toEqual(mockedUserValues);
      userSpy.mockRestore();
    });

    it('should be return one user by id', async () => {
      const userSpy = jest.spyOn(userService, 'findOneUser').mockResolvedValue(mockedUserValues[1]);
      const oneUser = await userController.findOne(1)
      expect(oneUser).toEqual(mockedUserValues[1])
      userSpy.mockRestore();
    })

    it('should be return a correct email', async () => {
      const userEmail = 'fabricio@gmail.com';
      const userByEmail = await userService.findUserByEmail(userEmail);
      expect(userByEmail).toEqual(mockedUserValues.find(user => user.email === userEmail));
    });

    it('should delete a user by id', async () => {
      const deleteById = 1;
      const userFound = mockedUserValues.find(user => user.idUser === deleteById);

      // Simulamos el método removeUser del servicio
      jest.spyOn(userService, 'removeUser').mockResolvedValue(userFound);

      const deletedUser = await userController.remove(deleteById);

      // Verificamos que el usuario eliminado sea el esperado
      expect(deletedUser).toEqual(userFound);

      // Verificamos que el método removeUser del servicio fue llamado con el id correcto
      expect(userService.removeUser).toHaveBeenCalledWith(deleteById);
    });

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
        "idUser": 8
      };

      const userFound = mockUserService.findOneUser(updateUserData.idUser)
      jest.spyOn(userService, 'updateUser').mockResolvedValue(userFound)
      const updateUser = await userController.update(updateUserData.idUser, updateUserData)
      expect(updateUser).toEqual(userFound)
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
        "idUser":9
      }

      const mailFound = mockUserService.findUserByEmail(newUserData.email)
      
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
