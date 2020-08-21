import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import React from 'react';
import App from '../../../client/App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Request, Response } from 'express';
import { BaseStore } from '../../../common/store/base';
import { publicConfig } from '../../../../configs/public';

let assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);

@Catch(NotFoundException)
export class SSRFilter implements ExceptionFilter {
  async catch(
    exception: NotFoundException,
    host: ArgumentsHost
  ): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const rootStore = {
      base: {
        ...publicConfig,
      } as Partial<BaseStore>,
    };
    const context = {};

    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );
    res.send(`<!doctype html>
    <html lang="">
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>ioTube</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script>
        window.__ROOT__STORE__ = ${JSON.stringify(rootStore)};
      </script>
      <link rel="stylesheet" href="/tailwind.css">
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" rel="stylesheet">
      ${
        assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ''
      }
      ${
        process.env.NODE_ENV === 'production'
          ? `<script src="${assets.client.js}" defer></script>`
          : `<script src="${assets.client.js}" defer crossorigin></script>`
      }
    </head>
    <body>
      <div id="root">${markup}</div>
    </body>
  </html>`);
  }
}
