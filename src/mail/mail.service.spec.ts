import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

const mockMailerService = {
  sendMail: jest.fn(),
};

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

});