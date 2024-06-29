import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Invoice]),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  //Export hace que sea visible userService a los demas modulos,
  //especialmente al modulo auth donde autenticaremos
  exports: [UserService]
})
export class UserModule { }
