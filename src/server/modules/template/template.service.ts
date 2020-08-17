import { Resolver, Query } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplateService {
  hello() {
    return "Hello Wordld~";
  }
}
