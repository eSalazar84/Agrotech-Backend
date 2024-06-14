import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { EMAIL_USER } from 'config';
import { IProduct } from 'src/product/interface/product.interface';

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

  async sendPurchaseConfirmationEmail(to: string, invoice: Invoice, products: IProduct[]): Promise<void> {
    try {
      const productsHtml = products.map(product => `
        <p>Producto: ${product.product}</p>
        <p>Precio: ${product.price}</p>
        <p>Cantidad: ${product.amount}</p>
        <p>total: ${product.price * product.amount}</p>
        <hr>
      `).join('');
      console.log(productsHtml);
      

      const mailOptions = await this.mailerService.sendMail({
        from: `"Agrotech" <${EMAIL_USER}>`,
        to,
        subject: 'Confirmación de compra',
        html: `
          <p>Hola ${to},</p>
          <p>Gracias por tu compra. Aquí están los detalles de tu factura:</p>
          <p>Productos comprados: </p>
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
}