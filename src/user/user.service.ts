import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IUser } from './interface/user.interface';
import { MailService } from '../mail/mail.service';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<CreateUserDto>,
    private readonly emailService: MailService
  ) { }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Número de rondas de hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const userFound = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (userFound && userFound.active === false) {
      userFound.active = true;
      createUserDto.password = await this.hashPassword(createUserDto.password)
      await this.userRepository.save(userFound);
      return userFound;
    }
    if (userFound && userFound.active === true) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `NOT VALID`
      }, HttpStatus.BAD_REQUEST);
    }
    createUserDto.password = await this.hashPassword(createUserDto.password)
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser)
    await this.emailService.sendMail(
      createUserDto.email,
      'Bienvenid@!',
      'welcome',
      {
        name: createUserDto.name,
        loginUrl: 'http://localhost:5174/login'
      }
    )
    const { password, ...rest } = newUser
    return rest;
  }

  async findAllUser(): Promise<IUser[]> {
    const allUsers = await this.userRepository.find({ relations: ['invoice'] });
    const aux = allUsers.map((users) => {
      const { password, ...rest } = users
      return rest;
    })
    return aux;
  }

  async findOneUser(id: number): Promise<IUser> {
    const query: FindOneOptions = { where: { idUser: id }, relations: ['invoice'] }
    const userFound = await this.userRepository.findOne(query)
    if (!userFound || userFound.active === false) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `No existe el usuario con el id ${id}`
    }, HttpStatus.NOT_FOUND)
    const { password, ...rest } = userFound
    return rest
  }

  async findUserByEmail(email: string): Promise<CreateUserDto> {
    const userFound = await this.userRepository.findOneBy({ email })
    if (!userFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `Contraseña o Nombre de Usuario Incorrecto`
    }, HttpStatus.NOT_FOUND)
    return userFound
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    const queryFound: FindOneOptions = { where: { idUser: id } }
    const userFound = await this.userRepository.findOne(queryFound);
    if (!userFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `No existe el usuario con el id ${id}`
    }, HttpStatus.NOT_FOUND);

    const existingUserWithEmail = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
    if (existingUserWithEmail && existingUserWithEmail.idUser !== userFound.idUser) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `NOT VALID`
      }, HttpStatus.BAD_REQUEST);
    }

    // Solo hashear la contraseña si se proporciona en la solicitud
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    } else {
      // No actualizar la contraseña
      delete updateUserDto.password;
    }

    const updatedUser = Object.assign(userFound, updateUserDto);
    const savedUser = await this.userRepository.save(updatedUser);
    const { password, ...rest } = savedUser;
    return rest;
  }

  async removeUser(id: number): Promise<IUser> {
    const query: FindOneOptions = { where: { idUser: id } }
    const userFound = await this.userRepository.findOne(query)
    if (!userFound || userFound.active === false) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `No existe el usuario con el id ${id}`
    }, HttpStatus.NOT_FOUND)
    userFound.active = false;
    const removeUser = await this.userRepository.save(userFound)
    const { password, ...rest } = removeUser
    return rest
  }

}