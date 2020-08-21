import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react-lite';
import './index.scss';
import { ClientOnly } from '../../components';
import { ERCXRC, XRCERC, SwitchHeader, CompleteFrame } from './components';
import { useStore } from '../../../common/store';
import { CARD_XRC20_ERC20, CARD_ERC20_XRC20 } from '../../../common/store/base';
import { matchPath, useHistory } from 'react-router-dom';

export const Home = () => {
  const { base } = useStore();
  const history = useHistory();

  const isERCXRC = !!matchPath(history.location.pathname, {
    path: '/eth',
    exact: true,
  });

  useEffect(() => {
    base.setMode(isERCXRC ? CARD_ERC20_XRC20 : CARD_XRC20_ERC20);
  }, [isERCXRC]);

  const switchTo = (path) => () => {
    history.push(path);
  };

  return useObserver(() => (
    <ClientOnly>
      <div className="page__home">
        <div className="page__home__content app_frame">
          {base.showComplete ? (
            <div className="rounded app_frame_shadow">
              <CompleteFrame isERCXRC={isERCXRC} />
            </div>
          ) : (
            <>
              <div
                className={`page__home__content__frame bg-primary rounded-md ${
                  isERCXRC
                    ? 'page__home__content__frame--active'
                    : 'page__home__content__frame--inactive'
                }`}
              >
                <SwitchHeader
                  onSwitch={switchTo('/iotx')}
                  mode={CARD_ERC20_XRC20}
                />
                <ERCXRC />
              </div>
              <div
                className={`page__home__content__frame bg-secondary rounded-md ${
                  isERCXRC
                    ? 'page__home__content__frame--inactive'
                    : 'page__home__content__frame--active'
                }`}
              >
                <SwitchHeader
                  onSwitch={switchTo('/eth')}
                  mode={CARD_XRC20_ERC20}
                />
                <XRCERC />
              </div>
            </>
          )}
        </div>
      </div>
    </ClientOnly>
  ));
};
