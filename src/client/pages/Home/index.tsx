import React, { useEffect } from 'react';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import './index.scss';
import { useStore } from '../../../common/store/index';
import { ClientOnly } from '../../components';
import { rpcClient } from '../../utils/rpc';
import { ERCXRC, XRCERC, FlipHeader } from './components';

const CARD_ERC20_XRC20 = 'ERC20-XRC20';
const CARD_XRC20_ERC20 = 'XRC20-ERC20';

export const Home = () => {
  const { lang } = useStore();
  const store = useLocalStore(() => ({
    mode: CARD_ERC20_XRC20,
    flipMode() {
      this.mode =
        this.mode === CARD_ERC20_XRC20 ? CARD_XRC20_ERC20 : CARD_ERC20_XRC20;
    },
  }));

  useEffect(() => {
    rpcClient.login('test', '123').then(async () => {
      const me = await rpcClient.me();
      console.log({ me });
      await rpcClient.logout();
      const logoutMe = await rpcClient.me();
      console.log({ me: logoutMe });
    });
  }, []);
  return useObserver(() => (
    <ClientOnly>
      <div className="page__home">
        <div className="page__home__content app_frame">
          <div
            className={`flip_card ${
              store.mode === CARD_XRC20_ERC20 ? 'flip_card--flipped' : ''
            }`}
          >
            <div className="flip_card__inner">
              <div className="flip_card--front bg-primary app_frame_shadow">
                <div className="bg-primary p-4 rounded">
                  <FlipHeader onFlip={store.flipMode} />
                  <ERCXRC />
                </div>
              </div>
              <div className="flip_card--back bg-primary app_frame_shadow">
                <div className="bg-primary p-4 rounded">
                  <FlipHeader onFlip={store.flipMode} />
                  <XRCERC />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  ));
};
