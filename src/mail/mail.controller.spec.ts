import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

const mockMailService = {
  sendMail: jest.fn(),
};

describe('MailController', () => {
  let mailController: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    mailController = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(mailController).toBeDefined();
  });

  // Añade aquí tus pruebas para MailController
});
