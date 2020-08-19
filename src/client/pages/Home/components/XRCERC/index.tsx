import React, { useEffect } from 'react';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import './index.scss';
import { ConvertImageSection } from '../ConvertImageSection';
import { useStore } from '../../../../../common/store';
import {
  SubmitButton,
  AddressInput,
  AmountField,
  TokenSelectField,
  ConfirmModal,
} from '../../../../components';

const IMG_IOPAY = require('../../../../static/images/logo_iotex.png');

export const XRCERC = () => {
  const { lang, wallet } = useStore();
  const store = useLocalStore(() => ({
    amount: '',
    token: '',
    address: '',
    showConfirmModal: false,
    setAmount(newAmount) {
      this.amount = newAmount;
    },
    setToken(newToken) {
      this.token = newToken;
    },
    setAddress(newAddress) {
      this.address = newAddress;
    },
    toggleConfirmModalVisible() {
      this.showConfirmModal = !this.showConfirmModal;
    },
  }));
  const onConvert = () => {
    store.toggleConfirmModalVisible();
  };
  const onConfirm = () => {};
  const isEnabled =
    !wallet.walletConnected ||
    (wallet.walletConnected &&
      store.amount !== '' &&
      store.address !== '' &&
      store.token !== '');
  return useObserver(() => (
    <div className="page__home__component__xrc_erc p-4">
      <ConvertImageSection isERCXRC={false} />
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
            label="Ether Address"
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
          title={lang.t(wallet.walletConnected ? 'convert' : 'connect_io_pay')}
          icon={
            !wallet.walletConnected && (
              <img src={IMG_IOPAY} className="h-6 mr-4" />
            )
          }
          onClick={wallet.walletConnected ? onConvert : wallet.init}
          disabled={!isEnabled}
        />
      </div>
      <ConfirmModal
        visible={store.showConfirmModal}
        onConfirm={onConfirm}
        tubeFee={0}
        networkFee={0}
        depositAmount={10}
        depositToken={store.token}
        mintAmount={10}
        mintToken={store.token}
        mintTokenName={'Ethereum'}
        close={store.toggleConfirmModalVisible}
        middleComment="to ioTube and withdraw"
      />
    </div>
  ));
};
