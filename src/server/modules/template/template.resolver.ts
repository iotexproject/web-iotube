import { Resolver, Query } from "@nestjs/graphql";

@Resolver("template")
export class TemplateResolver {
  @Query((_) => String)
  async hello() {
    return "Hello Graphql~";
  }
}
