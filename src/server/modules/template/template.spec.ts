  
import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';

describe('Template', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateService]
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service.hello()).toBe("Hello Wordld~")
  });
});