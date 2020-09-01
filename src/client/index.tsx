import React from 'react';
import 'mobx-react/batchingForReactDom';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { utils } from "../common/utils/index";
import { publicConfig } from "../../configs/public";

import 'antd/dist/antd.css';

import App from './App';

utils.env.onBrowser(() => {
  if(publicConfig.SENTRY_DSN){
    Sentry.init({
      dsn: publicConfig.SENTRY_DSN,
      environment: `client-${publicConfig.NODE_ENV}`,
    });
  }
});

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

renderMethod(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
