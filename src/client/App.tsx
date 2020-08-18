import window from "global/window";
import React, { useEffect } from 'react';
import { Route, Switch} from 'react-router-dom';
import { Home } from './pages/Home';
import './App.scss';
import { useStore } from '../common/store/index';
import { MainLayout } from './layouts';
import {createWeb3ReactRoot, Web3ReactProvider} from "@web3-react/core";
import {NetworkContextName} from "./constants/index";
import {Web3Provider} from "@ethersproject/providers";
import store from './state'
import { Provider } from 'react-redux'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  // @ts-ignore
  (window.ethereum as any).autoRefreshOnNetworkChange = false
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  return library
}

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
    </>
  )
}

const App = () => {
  //@ts-ignore
  const { lang } = useStore();
  useEffect(() => {
    lang.initLang();
  }, []);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <Updaters />
          <MainLayout>
            <Switch>
              <Route exact={true} path="/" component={Home} />
            </Switch>
          </MainLayout>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default App;
