import React, { useEffect } from 'react';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import './index.scss';
import { ConvertImageSection } from '../ConvertImageSection';
import {
  AmountField,
  SubmitButton,
  TokenSelectField,
  AddressInput,
} from '../../../../components';
import { useStore } from '../../../../../common/store';

const IMG_MATAMASK = require('../../../../static/images/metamask.png');

export const ERCXRC = () => {
  const { lang, wallet } = useStore();
  const store = useLocalStore(() => ({
    amount: '',
    token: '',
    address: '',
    setAmount(newAmount) {
      this.amount = newAmount;
    },
    setToken(newToken) {
      this.token = newToken;
    },
    setAddress(newAddress) {
      this.address = newAddress;
    },
  }));
  const onConvert = () => {};
  return useObserver(() => (
    <div className="page__home__component__erc_xrc p-4">
      <ConvertImageSection isERCXRC />
      <div className="my-6">
        <TokenSelectField token={store.token} onChange={store.setToken} />
      </div>

      <AmountField
        amount={store.amount}
        label={lang.t('amount')}
        onChange={store.setAmount}
      />
      {store.amount && (
        <div className="my-6 text-left">
          <div className="text-base c-gray-20">
            You will receive {store.token} tokens at
          </div>
          <AddressInput
            address={store.address}
            onChange={store.setAddress}
            label="IOTX Address"
          />
        </div>
      )}
      <div className="my-6 c-white text-left c-gray">
        <div className="font-normal text-base mb-3">{lang.t('fee')}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t('fee.tube')}</span>
          <span>0 ({lang.t('free')})</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t('fee.network')}</span>
          <span>0 ({lang.t('free')})</span>
        </div>
      </div>
      <div>
        <SubmitButton
          title={lang.t(
            wallet.walletConnected ? 'convert' : 'connect_metamask'
          )}
          icon={
            !wallet.walletConnected && (
              <img src={IMG_MATAMASK} className="h-6 mr-4" />
            )
          }
          onClick={wallet.walletConnected ? onConvert : wallet.connectWallet}
        />
      </div>
    </div>
  ));
};
