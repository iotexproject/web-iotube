import React, { MouseEventHandler } from "react";
import { Button, Modal } from "antd";
import { useStore } from "../../../common/store";
import { Token } from "@uniswap/sdk";
import CurrencyLogo from "../CurrencyLogo/index";
import { useTokens } from "../../hooks/Tokens";

interface IComponentProps {
  visible: boolean;
  onConfirm: MouseEventHandler;
  close: MouseEventHandler;
  tubeFee: number;
  networkFee: number;
  depositAmount: number;
  depositToken: Token | null;
  mintAmount: number;
  mintToken: Token | null;
  mintTokenName: string;
  middleComment: string;
  isERCXRC: boolean;
}

export const ConfirmModal = (props: IComponentProps) => {
  const { lang } = useStore();
  const tokenList = useTokens();
  const depositToken =
    props.depositToken && tokenList
      ? tokenList[props.depositToken.address]
      : undefined;
  const mintToken =
    props.mintToken && tokenList
      ? tokenList[props.mintToken.address]
      : undefined;

  if (!props.visible) return null;

  return (
    <Modal
      title="You are going to deposit"
      visible={props.visible}
      onCancel={props.close}
      footer={null}
      className="modal__confirm_deposit"
    >
      <div className="c-white flex items-center">
        <span className="font-normal text-3xl mr-3">{props.depositAmount}</span>
        <CurrencyLogo currency={depositToken} />
        <span className="text-xl ml-2 font-light">
          {depositToken && depositToken.name}
        </span>
      </div>
      <div className="c-gray font-thin text-base mt-2 mb-5">
        {props.middleComment}
      </div>
      <div className="c-white  flex items-center">
        <span className="font-normal text-3xl mr-3">{props.mintAmount}</span>
        <CurrencyLogo currency={mintToken} />
        <span className="text-xl ml-2 font-light">
          {mintToken && mintToken.name}
        </span>
      </div>
      <div className="c-gray font-thin text-base mt-2 mb-5">
        on {props.mintTokenName}
      </div>
      <div className="my-6 text-left c-gray">
        <div className="font-normal text-base mb-3">{lang.t("fee")}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("fee.tube")}</span>
          <span>0 ({lang.t("free")})</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>
            {lang.t(props.isERCXRC ? "relay_to_iotex" : "relay_to_ethereum")}
          </span>
          <span>0 ({lang.t("free")})</span>
        </div>
      </div>
      <div>
        <Button
          onClick={props.onConfirm}
          className={`modal__confirm_deposit__confirm ${
            props.isERCXRC
              ? "modal__confirm_deposit__confirm--erc-xrc"
              : "modal__confirm_deposit__confirm--xrc-erc"
          } w-full c-white`}
          type="primary"
        >
          {lang.t("confirm")}
        </Button>
      </div>
    </Modal>
  );
};
