import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService

  let mockedUserValues = [
    {
      "name": "Anabel",
      "lastname": "Assann",
      "email": "anabel@gmail.com",
      "rol": "user",
      "active": true,
      "phone": "2281513051",
      "birthDate": "1984-05-13T13:54:00.000Z",
      "createdAt": "2024-03-18T13:54:00.000Z",
      "idUser": 1
    },
    {
      "name": "Fabricio",
      "lastname": "Cordoba",
      "email": "fabricio@gmail.com",
      "rol": "user",
      "active": true,
      "phone": "2281529854",
      "birthDate": "1984-05-13T13:54:00.000Z",
      "createdAt": "2024-03-18T13:54:00.000Z",
      "idUser": 5
    },
    {
      "name": "Emi",
      "lastname": "Salazar",
      "email": "esalazar@gmail.com",
      "rol": "user",
      "active": true,
      "phone": "2281513051",
      "birthDate": "1984-05-13T13:54:00.000Z",
      "createdAt": "2024-03-18T13:54:00.000Z",
      "idUser": 6
    },
    {
      "name": "Emiliano",
      "lastname": "Salazar",
      "email": "isalazar@gmail.com",
      "rol": "user",
      "active": true,
      "phone": "2281514468",
      "birthDate": "1984-05-13T13:54:00.000Z",
      "createdAt": "2024-03-18T13:54:00.000Z",
      "idUser": 7
    },
    {
      "name": "Emiliano César",
      "lastname": "Salazarrr",
      "email": "emi@gmail.com",
      "rol": "user",
      "active": true,
      "phone": "2281514468",
      "birthDate": "1984-05-13T13:54:00.000Z",
      "createdAt": "2024-03-18T13:54:00.000Z",
      "idUser": 8
    }
  ]

  let mockUserService = {
    users: () => mockUserService
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(mockUserService)
      .useValue(mockedUserValues)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService)
  });

  describe('User Controller test', () => {
    it('should be defined', () => {
      expect(userController).toBeDefined()
    })
  })
});
