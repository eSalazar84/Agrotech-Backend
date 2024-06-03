import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { Email } from './email';

@Module({
  controllers: [EmailController],
  providers: [EmailService, Email],
})
export class EmailModule {}
