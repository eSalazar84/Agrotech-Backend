import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Invoice } from '../invoice/entities/invoice.entity';
import { EMAIL_USER } from 'config';
import { IProduct } from '../product/interface/product.interface';

console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`); // Debug


@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendMail(to: string, subject: string, template: string, context: any): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template, // Nombre del archivo de plantilla sin extensión
      context, // Datos para la plantilla
    });
  }

  async sendPurchaseConfirmationEmail(to: string, invoice: Invoice, products: Partial<IProduct>[]): Promise<void> {
    try {
      const productsHtml = products.map(product => `
            <p>Producto: ${product.product}</p>
            <p>Precio: ${product.price}</p>
            <p>Cantidad: ${product.amount}</p>
            <p>Total: ${product.price * product.amount}</p>
            <hr>
        `).join('');

      const mailOptions = await this.mailerService.sendMail({
        from: `"Agrotech" <${EMAIL_USER}>`,
        to,
        subject: 'Confirmación de compra',
        html: `
                <p>Hola ${to},</p>
                <p>Gracias por tu compra. Aquí están los detalles de tu factura:</p>
                <p>Fecha de la factura: ${invoice.invoiceDate}</p>
                <p>Total sin IVA: ${invoice.total_without_iva}</p>
                <p>Total con IVA: ${invoice.total_with_iva}</p>
                <h3>Productos Comprados:</h3>
                ${productsHtml}
                <p>¡Esperamos verte pronto de nuevo!</p>
            `,
      });

      console.log('Correo electrónico enviado correctamente');
      return mailOptions;
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw new HttpException('Error al enviar el correo electrónico', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendContactMail(name: string, email: string, subject: string, message: string) {
    // Email al administrador
    const adminMailOptions = {
      from: email,
      to: EMAIL_USER, // Email del administrador
      subject: `Formulario de contacto motivo: ${subject}`,
      html: `
          <p>Motivo de contacto: ${subject}</p>
          <p>Nombre: ${name}</p>
          <p>Email: ${email}</p>
          <p>Mensaje: ${message}</p>
        `,
    };

    // Email de confirmación al usuario
    const userMailOptions = {
      from: `"Agrotech" <${EMAIL_USER}>`,
      to: email, // Email del usuario
      subject: 'Confirmación de recepción de mensaje',
      html: `
      <p>Hola ${name}!</p>
      <p>Hemos recibido tu mensaje con el asunto: "${subject}".</p>
      <p>Nos pondremos en contacto contigo lo antes posible.</p>
      <p>Gracias,</p>
      <p>El equipo de Soporte de Agrotech</p>
      `
    };

    // Enviar ambos correos electrónicos
    await this.mailerService.sendMail(adminMailOptions);
    await this.mailerService.sendMail(userMailOptions);
  }
}