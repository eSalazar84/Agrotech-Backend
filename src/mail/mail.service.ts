import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Invoice } from '../invoice/entities/invoice.entity';
import { IProduct } from '../product/interface/product.interface';
import { formatPrice } from '../helpers/formatPrice';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendMail(to: string, subject: string, template: string, context: any) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendPurchaseConfirmationEmail(to: string, invoice: Invoice, products: Partial<IProduct>[]) {
    const invoiceDate = new Date(invoice.invoiceDate);
    const formattedDate = invoiceDate.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    try {
      const productsHtml = products.map(product => `
            <p>Producto: ${product.product}</p>
            <p>Precio: ${formatPrice(product.price)}</p>
            <p>Cantidad: ${product.amount}</p>
            <p>Total: ${formatPrice(product.price * product.amount)}</p>
            <hr>
        `).join('');

      const mailOptions = await this.mailerService.sendMail({
        from: `"Agrotech" ${process.env.EMAIL_USER}`,
        to,
        subject: 'Confirmación de compra',
        html: `
                <p>Hola ${to},</p>
                <p>Gracias por tu compra. Aquí están los detalles de tu factura:</p>
                <p>Fecha de la factura: ${formattedDate}</p>
                <p>Total sin IVA: $${formatPrice(invoice.total_without_iva)}</p>
                <p>Total con IVA: $${formatPrice(invoice.total_with_iva)}</p>
                <h3>Productos Comprados:</h3>
                ${productsHtml}
                <p>¡Esperamos verte pronto de nuevo!</p>
            `,
      });

      return mailOptions;
    } catch (error) {
      throw new HttpException(`Error al enviar el correo electrónico`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendContactMail(name: string, email: string, subject: string, message: string) {
    // Email al administrador
    const adminMailOptions = {
      from: email,
      to: 'somos.agrotech@gmail.com', // Email del administrador
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
      from: `"Agrotech" <somos.agrotech@gmail.com>`,
      to: email, // (Email del usuario)
      subject: 'Confirmación de recepción de mensaje',
      html: `
      <p>Hola ${name}!</p>
      <p>Hemos recibido tu mensaje con el asunto: "${subject}".</p>
      <p>Nos pondremos en contacto contigo lo antes posible.</p>
      <p>Gracias,</p>
      <p>El equipo de Soporte de Agrotech</p>
      `
    };

    // Enviamos ambos correos electrónicos
    await this.mailerService.sendMail(adminMailOptions);
    await this.mailerService.sendMail(userMailOptions);
  }
}