import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-email')
  async sendEmail() {
    await this.mailService.sendMail(
      'recipient@example.com', // Cambia esto por el email del destinatario
      'Welcome!',
      'welcome',
      { name: 'John Doe' },
    );
    return 'Email sent successfully';
  }
}
