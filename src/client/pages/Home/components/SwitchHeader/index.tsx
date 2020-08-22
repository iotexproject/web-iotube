import React, { useEffect, MouseEventHandler } from 'react';
import './index.scss';
import { Button } from 'antd';
import { useStore } from '../../../../../common/store';
import { SwapOutlined } from '@ant-design/icons';
import { useObserver } from 'mobx-react';
import { CARD_XRC20_ERC20 } from '../../../../../common/store/base';

const IMG_ETH = require('../../../../static/images/logo-ethereum.png');
const IMG_IOTEX = require('../../../../static/images/logo-iotex.png');
const IMG_SWITCH = require('../../../../static/images/icon-arrow.png');

interface IComponentProps {
  onSwitch: MouseEventHandler;
  mode: string;
}

export const SwitchHeader = (props: IComponentProps) => {
  const { lang } = useStore();
  const { mode, onSwitch } = props;
  const isERCXRC = mode !== CARD_XRC20_ERC20;
  return useObserver(() => (
    <div
      className={`page__home__component__switch_header flex items-center ${
        !isERCXRC ? 'flex-row-reverse' : ''
      }`}
    >
      <div className="flex-1 flex flex-col justify-center items-center bg-primary c-white py-8">
        <div
          className={`flex items-center flex-col ${
            !isERCXRC ? 'cursor-pointer' : ''
          }`}
          onClick={!isERCXRC ? onSwitch : null}
        >
          <img src={IMG_ETH} className="h-20" />
          <div className="text-xl font-light -mt-2">
            {lang.t('token.ethereum')}
          </div>
        </div>
      </div>
      <img
        src={IMG_SWITCH}
        className="page__home__component__switch_header__switch cursor-pointer"
        onClick={onSwitch}
      />
      <div className="flex-1 flex flex-col justify-center items-center bg-secondary c-white py-8">
        <div
          className={`flex items-center flex-col ${
            isERCXRC ? 'cursor-pointer' : ''
          }`}
          onClick={isERCXRC ? onSwitch : null}
        >
          <img src={IMG_IOTEX} className="h-20" />
          <div className="text-xl font-light -mt-2">
            {lang.t('token.iotex')}
          </div>
        </div>
      </div>
    </div>
  ));
};
