import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthGuard } from './guard/auth.guard';
import { Repository } from 'typeorm';
import { IAccess_token } from './interface/auth.interface';
import { Rol } from '../helpers/enums-type.enum';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthGuard),
          useValue: Repository,
        },
        JwtService, 
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(), // Mockea los métodos utilizados en AuthService
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService)
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Testing over login', () => {
    it('should be login successfully', async () => {
      const mockLogin: IAccess_token = {
        access_token: 'fakeToken123',
        email: 'test@gmail.com',
        name: 'Test User',
        rol: Rol.USER,
        id: 123
      };

      const mockLoginAnsPass = {
        ...mockLogin,
        password: 'abc123'
      }

      const loginService = jest.spyOn(authService, 'login').mockResolvedValue(mockLogin)
      const result = await authController.login(mockLoginAnsPass)
      expect(result).toEqual(mockLogin);
      expect(loginService).toBeDefined()
    })
  })
});
