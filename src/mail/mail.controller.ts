import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Get('send-email')
  /* async sendEmail() {
    await this.mailService.sendMail(
      'fabricio.cbe@gmail.com', // Cambia esto por el email del destinatario
      'Bienvendid@ a Agrotech!',
      'welcome',
      {
        name: 'Fabriiiii!!',
        loginUrl: 'http://localhost:5173/login'
      }
    );
    return 'Email sent successfully';
  } */

  @Post('send-email')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('template') template: string,
    @Body('context') context: any
  ) {
    await this.mailService.sendMail(to, subject, template, context);
    return 'Email sent successfully';
  } 
}
