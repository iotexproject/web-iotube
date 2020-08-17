import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TemplateModule } from "./modules/template/template.module";
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql",
      path: "/api-gateway",
      playground: {
        settings: {
          "request.credentials": "include",
        },
      },
      context: ({ req }) => ({ req }),
    }),
    TemplateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
