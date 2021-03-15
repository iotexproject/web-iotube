import React, { MouseEventHandler, useMemo } from "react";
import { Button, Modal } from "antd";
import { useStore } from "../../../common/store";
import { Token } from "@uniswap/sdk";
import CurrencyLogo from "../CurrencyLogo/index";

interface IComponentProps {
  visible: boolean;
  onConfirm: MouseEventHandler;
  close: MouseEventHandler;
  networkFee?: string;
  depositAmount: number;
  depositToken: Token | null;
  mintAmount: number;
  mintToken: Token | null;
  middleComment: string;
  isERCXRC: boolean;
  toAddress: string;
}

export const ConfirmModal = (props: IComponentProps) => {
  const { lang, base } = useStore();
  if (!props.visible) return null;
  const isETHCurrency = props.depositToken && props.depositToken.name === "ETH";
  const isIOTXECurrency = props.depositToken && props.depositToken.symbol === "IOTX-E";
  const isIOTXCurrency = props.depositToken && props.depositToken.symbol === "IOTX";

  return (
    <Modal
      title={lang.t("you_are_going_to_deposit")}
      visible={props.visible}
      onCancel={props.close}
      footer={null}
      className={`modal__confirm_deposit ${props.isERCXRC ? "modal__confirm_deposit--ercxrc" : "modal__confirm_deposit--xrcerc"}`}
    >
      <div className="c-white flex items-center">
        <span className="font-normal text-3xl mr-3">{props.depositAmount}</span>
        {props.depositToken && (
          <>
            <CurrencyLogo currency={props.depositToken} />
            <span className="text-xl ml-2 font-light">
              {props.depositToken.symbol}&nbsp;&nbsp;
              {!isETHCurrency && !isIOTXCurrency && (props.isERCXRC ? base.chainToken.standard : `${lang.t("xrc_20")}`)}
            </span>
          </>
        )}
      </div>
      <div className="c-gray font-thin text-base mt-2 mb-5">{props.middleComment}</div>
      <div className="c-white flex items-center">
        <span className="font-normal text-3xl mr-3">{props.mintAmount}</span>
        {props.mintToken && (
          <>
            <CurrencyLogo currency={props.mintToken} />
            <span className="text-xl ml-2 font-light">
              {props.mintToken.symbol}&nbsp;&nbsp;
              {!isIOTXECurrency && (props.isERCXRC ? base.chainToken.standard : `${lang.t("xrc_20")}`)}
            </span>
          </>
        )}
      </div>
      <div className="c-gray font-thin text-base mt-2 mb-5">
        on {props.isERCXRC ? lang.t("token.iotex") : lang.t("token.ethereum")} at&nbsp;
        <span className="c-white font-light">{props.toAddress}</span>
      </div>
      <div className="my-6 text-left c-gray">
        <div className="font-normal text-base mb-3">{lang.t("fee")}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("fee.tube")}</span>
          <span>0 ({lang.t("free")})</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          {props.isERCXRC ? <span>{lang.t("relay_to_iotex")}</span> : <span>{lang.t("relay_to_chain", { chain: base.chainToken.name })}</span>}
          <span>{props.isERCXRC ? `0 (${lang.t("free")})` : props.networkFee}</span>
        </div>
      </div>
      <div>
        <Button
          onClick={props.onConfirm}
          className={`modal__confirm_deposit__confirm ${props.isERCXRC ? "modal__confirm_deposit__confirm--erc-xrc" : "modal__confirm_deposit__confirm--xrc-erc"} w-full c-white`}
          type="primary"
        >
          {lang.t("confirm")}
        </Button>
      </div>
    </Modal>
  );
};
