import { MailerOptions } from "@nestjs-modules/mailer";
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const emailConfig: MailerOptions = {
    transport: {
        service: 'gmail',
        auth: {
            user: 'somos.agrotech@gmail.com',
            pass: 'agrotechefa'
        },
    },
    defaults: {
        from: '"Agrotech" <somos.agrotech@gmail.com>',
    },
    template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true
        }
    }
}