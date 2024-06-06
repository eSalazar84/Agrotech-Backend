import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailService: MailerService
  ) { }

  async sendWelcomeEmail(email:string){
    await this.emailService.sendMail({
      to: email,
      subject: 'Confirma tu cuenta',
      template: './welcome',
      context: {
        loginUrl: 'http://localhost:5173/login'
      }
    })
  }

  
  /* async sendEmail(emailBody: CreateEmailDto) {
    const { from, subjectEmail, sendTo } = emailBody
    const html = this.getTemplate(emailBody)
    await this.emailProvider.sendEmail(from, subjectEmail, sendTo, html)
  }

  async getTemplate(emailBody) {
    const template = this.getTemplateFile(emailBody.template)
    const html = template.fillTemplate(emailBody)
    return html

  }

  async getTemplateFile(template) {
    const path = '../../templates'
    const templateFile = require(`${path}/${template}`)
    return templateFile
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  } */
}
