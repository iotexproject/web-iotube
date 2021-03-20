import window from "global/window";
import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Home } from "./pages/Home";
import { Tutorial } from "./pages/Tutorial";
import "./App.scss";
import { useStore } from "../common/store/index";
import { MainLayout } from "./layouts";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import store from "./state";
import { Provider } from "react-redux";
import ApplicationUpdater from "./state/application/updater";
import MulticallUpdater from "./state/multicall/updater";
import { Web3ProviderNetwork } from "../common/utils/create-web3";
import { utils } from "../common/utils/index";

if ("ethereum" in window) {
  // @ts-ignore
  (window.ethereum as any).autoRefreshOnNetworkChange = false;
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000;
  return library;
}

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
    </>
  );
}

const App = () => {
  //@ts-ignore
  const { lang, base } = useStore();
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
              <Route exact={true} path="/*" component={Home} />
              <Route exact={true} path="/tutorial" component={Tutorial} />
              {utils.env.isIoPayMobile() ? <Redirect to={`/iotx-${base.chainToken.key}`} /> : <Redirect to={`/${base.chainToken.key}-iotx`} />}
            </Switch>
          </MainLayout>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default App;
