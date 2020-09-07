import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import "./index.scss";
import { ClientOnly } from "../../components";
import { useStore } from "../../../common/store";
import { CARD_XRC20_ERC20, CARD_ERC20_XRC20 } from "../../../common/store/base";
import { matchPath, useHistory } from "react-router-dom";

export const Tutorial = () => {
  return useObserver(() => (
    <ClientOnly>
      <div className="page__tutorial h-full">
        <div className="container mx-auto">
          <h1 className="text-6xl text-left c-green-20">ioTube Tutorial</h1>
          <p>
            ioTube is the cross-chain + multi-asset bridge to connect IoTeX to the blockchain universe! ioTube will enable new assets and liquidity from other blockchains to flow into IoTeX and
            position IoTeX to deliver unique IoT assets to other blockchains in the future. Convert your ERC20 assets and bring new liquidity to the IoTeX Network now at: https://tube.iotex.io 4
          </p>
        </div>
      </div>
    </ClientOnly>
  ));
};
