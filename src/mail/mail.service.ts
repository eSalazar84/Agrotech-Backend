import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, template: string, context: any): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template, // Nombre del archivo de plantilla sin extensión
      context, // Datos para la plantilla
    });
  }
}