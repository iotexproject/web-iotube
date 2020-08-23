import React, { useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import "./index.scss";
import "./index.scss";
import { useStore } from "../../../../../common/store";
import {
  AddressInput,
  AmountField,
  ConfirmModal,
  SubmitButton,
  TokenSelectField,
} from "../../../../components";
import { ChainId } from "@uniswap/sdk";
import { IOTX_TOKEN_INFO } from "../../../../constants/index";

const IMG_IOPAY = require("../../../../static/images/icon-iotex-black.png");

export const XRCERC = () => {
  const { lang, wallet } = useStore();
  const [token, setToken] = useState(null);
  const store = useLocalStore(() => ({
    amount: "",
    address: "",
    showConfirmModal: false,
    approved: false,
    setApprove() {
      this.approved = true;
    },
    setAmount(newAmount) {
      this.amount = newAmount;
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
  const onApprove = () => {
    store.setApprove();
  };
  const onConfirm = () => {};
  const isEnabled = store.amount !== "" && token !== null;
  return useObserver(() => (
    <div className="page__home__component__xrc_erc p-8 pt-6">
      <div className="my-6">
        <TokenSelectField onChange={setToken} />
      </div>

      <AmountField
        amount={store.amount}
        label={lang.t("amount")}
        onChange={store.setAmount}
      />
      {store.amount && (
        <div className="my-6 text-left">
          <div className="text-base c-gray-20">
            You will receive {token.name} tokens at
          </div>
          <AddressInput
            address={store.address}
            onChange={store.setAddress}
            label="Ether Address"
          />
        </div>
      )}
      <div className="my-6 text-left c-gray-30">
        <div className="font-normal text-base mb-3">{lang.t("fee")}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("fee.tube")}</span>
          <span>0 ({lang.t("free")})</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("relay_to_ethereum")}</span>
          <span>0 ({lang.t("free")})</span>
        </div>
      </div>
      <div>
        {!wallet.walletConnected && (
          <SubmitButton
            title={lang.t("connect_io_pay")}
            icon={<img src={IMG_IOPAY} className="h-6 mr-4" />}
            onClick={wallet.init}
          />
        )}
        {wallet.walletConnected && (
          <div className="page__home__component__xrc_erc__button_group flex items-center">
            <SubmitButton
              title={lang.t("approve")}
              onClick={onApprove}
              disabled={store.approved || !isEnabled}
            />
            <SubmitButton
              title={lang.t("convert")}
              onClick={onConvert}
              disabled={!store.approved}
            />
          </div>
        )}
      </div>
      <ConfirmModal
        visible={store.showConfirmModal}
        onConfirm={onConfirm}
        tubeFee={0}
        networkFee={0}
        depositAmount={10}
        depositToken={IOTX_TOKEN_INFO[ChainId.ROPSTEN]}
        mintAmount={10}
        mintToken={token}
        close={store.toggleConfirmModalVisible}
        middleComment="to ioTube and withdraw"
        isERCXRC={false}
      />
    </div>
  ));
};
