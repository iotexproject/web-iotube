import React from 'react';
import 'mobx-react/batchingForReactDom';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import 'antd/dist/antd.css';

import App from './App';

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
