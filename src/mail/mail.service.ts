import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendMail() {
        await this.mailerService.sendMail({
            to: 'assannanabel@gmail.com',
            from: 'salazaremiliano84@gmail.com',
            subject: 'Testing Nest MailerModule',
            template: './welcome',
        })
    }
}
