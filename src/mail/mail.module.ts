import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import * as path from 'path';
import { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD } from 'config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: EMAIL_SERVICE,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"Agrotech" <${EMAIL_USER}>`,
      }/* ,
      template: {
        dir: path.join(__dirname, '../../../src/mail/templates'),
        adapter: new HandlebarsAdapter(), // Utiliza Handlebars como adaptador
        options: {
          strict: true,
        },
      }, */
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule { }
