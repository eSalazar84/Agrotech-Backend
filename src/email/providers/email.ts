import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'

@Injectable()
export class Email {
    //manejar por variables de entorno
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "maddison53@ethereal.email",
            pass: "jn7jnAPss4f63QBp6D",
        },
    });

    async sendEmail(from, subjectEmail, sendTo, html) {
        try {

            const info = await this.transporter.sendMail({
                from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
                to: "bar@example.com, baz@example.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

            console.log("Message sent: %s", info.messageId);

        } catch (error) {

        }
    }
}