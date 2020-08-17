import { Module } from "@nestjs/common";
import { TemplateController } from "./template.controller";
import { TemplateResolver } from "./template.resolver";
import { TemplateService } from "./template.service";

@Module({
  controllers: [TemplateController],
  providers: [TemplateResolver, TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
