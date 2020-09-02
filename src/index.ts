import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./server/app.module";
import compression from "compression";
import "./server/modules/wildcardAPI";
import { redirectToHTTPS } from "express-http-to-https";
import { SSRFilter } from "./server/modules/ssr/ssr.filter";
import wildcard from "@wildcard-api/server/express";
import cookieParser from "cookie-parser";
import { publicConfig } from "../configs/public";

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.disable("x-powered-by");
  app.use(compression());
  if (publicConfig.FORCE_HTTPS) {
    app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
  }
  app.useStaticAssets(process.env.RAZZLE_PUBLIC_DIR, {
    index: false,
    redirect: false,
  });
  app.useGlobalFilters(new SSRFilter());
  app.use(cookieParser());
  app.use(
    wildcard((req) => {
      return {
        req,
      };
    })
  );

  await app.listen(process.env.PORT || 3000, () => {
    Logger.log(`🚀server is runing on http://localhost:${process.env.PORT || 3000}`);
  });

  if (module.hot) {
    Logger.log("HMR Reloading ...");
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
