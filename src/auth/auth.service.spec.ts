import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthGuard } from './guard/auth.guard';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { IAccess_token } from './interface/auth.interface';
import { Rol } from '../helpers/enums-type.enum';
import { LoginDto } from './dto/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthGuard),
          useValue: Repository
        },
        JwtService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService)
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@gmail.com',
        password: 'abc123',
      };

      const mockUser = {
        idUser: 123,
        email: 'test@gmail.com',
        name: 'Test User',
        lastname: 'lastname fantasy',
        password: 'abc123',
        rol: Rol.USER,
        active: true,
        createdAt: new Date(),
        phone: '02281458596',
        birthDate: new Date('1984-09-20'),
        address: "La Rioja 265"
      };

      const mockAccessToken: IAccess_token = {
        access_token: 'fakeToken123',
        email: 'test@gmail.com',
        name: 'Test User',
        rol: Rol.USER,
        id: 123,
        active: true,
        address: 'La Rioja 265'
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('fakeToken123');

      const result = await authService.login(loginDto);
      expect(result).toEqual(mockAccessToken);
    });

    it('should throw an exception when password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@gmail.com',
        password: 'abc123',
      };

      const mockUser = {
        idUser: 123,
        email: 'test@gmail.com',
        name: 'Test User',
        lastname: 'lastname fantasy',
        password: 'hashedPassword',
        rol: Rol.USER,
        active: false,
        createdAt: new Date(),
        phone: '02281458596',
        birthDate: new Date('1984-09-20'),
        address: "calle falsa 123"
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
      await expect(authService.login(loginDto)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
        response: {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Contraseña o email incorrecto',
        },
      });
    });

    describe('Compare Password', () => {
      it('should be password matched', async () => {
        const loginDto: LoginDto = {
          email: 'test@gmail.com',
          password: 'abc123',
        };


        const mockUser = {
          idUser: 123,
          email: 'test@gmail.com',
          name: 'Test User',
          lastname: 'lastname fantasy',
          password: 'abc123',
          rol: Rol.USER,
          active: false,
          createdAt: new Date(),
          phone: '02281458596',
          birthDate: new Date('1984-09-20')
        };

        const hashedPassword = await bcrypt.hash(mockUser.password, 10)

        jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true)

        const result = await authService.comparePasswords(loginDto.password, hashedPassword)

        expect(result).toBe(true)
      })

      
    })
  });
});
