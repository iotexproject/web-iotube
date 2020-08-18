import React from 'react';
import './index.scss';
import {EllipsisOutlined} from '@ant-design/icons';
import {Avatar, Button} from 'antd';
import {useStore} from '../../../common/store';
import {useObserver} from 'mobx-react';
import "./index.scss";

const IMG_LOGO = require("../../static/images/logo-iotex.png");
const IMG_TOKEN = require("../../static/images/icon_wallet.png");

export const Header = () => {
  const { wallet, lang } = useStore();
  const onConnectWallet = () => {
    // @ts-ignore
    wallet.init();
  };
  const walletLength = String(wallet.walletAddress || "").length;
  return useObserver(() => (
    <div className="component__header h-10 sm:h-10 md:h-12 lg:h-16">
      <div className="component__header__content app_header_content flex justify-between items-center h-full py-1">
        <img alt="logo" className="h-full" src={IMG_LOGO} />
        <span className="flex items-center c-white font-thin">
          {wallet.walletConnected ? (
            <>
              <span>
                {wallet.walletBalance}&nbsp;{wallet.token}
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="component__header__content__wallet_address w-16 sm:w-20 md:w-24 lg:w-32 flex items-center">
                <span className="component__header__content__wallet_address__ellipse flex-1 overflow-hidden whitespace-no-wrap">
                  {wallet.walletAddress.slice(0, walletLength - 4)}
                </span>
                <span className="overflow-hidden whitespace-no-wrap">
                  {wallet.walletAddress.slice(walletLength - 4)}
                </span>
              </span>
              &nbsp;&nbsp;&nbsp;
              <Avatar src={IMG_TOKEN} size="small" />
            </>
          ) : (
            <Button className="c-white" type="text" onClick={onConnectWallet}>
              {lang.t("header.connect_wallet")}
            </Button>
          )}
          &nbsp;&nbsp;&nbsp;
          <Button
            type="text"
            shape="circle"
            className="component__header__content__more c-white"
          >
            <EllipsisOutlined />
          </Button>
        </span>
      </div>
    </div>
  ));
};
