import { utils } from '../utils/index';
import { extendObservable } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import React from 'react';
import { BaseStore } from './base';
import { LangStore } from './lang';
import { WalletStore } from './wallet';

if (utils.env.isSSR()) {
  useStaticRendering(true);
}

export const createRootStore = () => {
  return {
    base: new BaseStore(),
    lang: new LangStore(),
    wallet: new WalletStore(),
  };
};

export function getRootStore() {
  if (utils.env.isSSR()) {
    return createRootStore();
  }

  const rootStore = createRootStore();
  Object.keys(rootStore).forEach((key) => {
    rootStore[key] = extendObservable(
      rootStore[key],
        //@ts-ignore
      window.__ROOT__STORE__[key]
    );
  });
  return rootStore;
}

export const StoresContext = React.createContext(getRootStore());

export const useStore = () => React.useContext(StoresContext);
