import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@example.com', // Cambia esto por tu email
        pass: 'your_password', // Cambia esto por tu contraseña
      },
    });
  }

  private async loadTemplate(templateName: string, variables: any): Promise<string> {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = hbs.compile(source);
    return template(variables);
  }

  async sendMail(to: string, subject: string, templateName: string, variables: any): Promise<void> {
    const html = await this.loadTemplate(templateName, variables);

    const mailOptions = {
      from: '"Emiliano" <salazaremiliano84@gmail.com>', // Cambia esto por tu nombre y email
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
