import React, { useEffect } from 'react';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import './index.scss';
import { ConvertImageSection } from '../ConvertImageSection';
import { AmountField } from '../../../../components';
import { useStore } from '../../../../../common/store';
import { TokenSelectField } from '../../../../components/TokenSelectField';
import { AddressInput } from '../../../../components/AddressInput';
import { Button } from 'antd';

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
        <div className="font-normal text-base mb-3">Fee</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>Tube Fee</span>
          <span>0(Free)</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>Network Fee</span>
          <span>0(Free)</span>
        </div>
      </div>
      <div>
        {wallet.walletConnected ? (
          <Button size="large" type="primary" className="w-full">
            Convert
          </Button>
        ) : (
          <Button size="large" type="primary" className="w-full">
            Connect Metamask
          </Button>
        )}
      </div>
    </div>
  ));
};
