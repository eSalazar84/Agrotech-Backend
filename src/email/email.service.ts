import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Email } from './providers/email';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailProvider: Email
  ) { }

  async sendEmail(emailBody: CreateEmailDto) {
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
  }
}
