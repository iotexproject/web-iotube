import React, { useEffect } from 'react';
import './index.scss';
import { DashOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useStore } from '../../../common/store';
import { useObserver } from 'mobx-react';

const IMG_LOGO = require('../../static/images/logo-iotex.png');

export const Header = () => {
  const {
    wallet: {
      walletConnected,
      walletAddress,
      walletBalance,
      token,
      connectWallet,
    },
    lang,
  } = useStore();
  const onConnectWallet = () => {
    connectWallet();
  };
  return useObserver(() => (
    <div className="component__header h-10 sm:h-10 md:h-12 lg:h-16">
      <div className="component__header__content app_header_content flex justify-between items-center h-full py-1">
        <img alt="logo" className="h-full" src={IMG_LOGO} />
        <span className="flex items-center c-white">
          {walletConnected ? (
            <>
              <span>
                {walletBalance}&nbsp;{token}
              </span>
              <span>{walletAddress}</span>
            </>
          ) : (
            <Button className="c-white" type="text" onClick={onConnectWallet}>
              {lang.t('header.connect_wallet')}
            </Button>
          )}
          <Button
            type="text"
            shape="circle"
            className="c-white component__header__content__more"
          >
            <DashOutlined />
          </Button>
        </span>
      </div>
    </div>
  ));
};
