import { Controller, Get } from "@nestjs/common";

@Controller()
export class TemplateController {
  @Get("/test")
  test() {
    return "ok";
  }
}
