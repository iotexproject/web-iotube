import React from "react";
import "./index.scss";
import { Button } from "antd";
import { useStore } from "../../../../../common/store";
import copy from "copy-to-clipboard";
import { CheckOutlined } from "@ant-design/icons";
import { useObserver } from "mobx-react";
import message from "antd/lib/message";

const IMG_COPY = require("../../../../static/images/icon_copy.png");

interface IComponentProps {
  isERCXRC: boolean;
}

export const CompleteFrame = (props: IComponentProps) => {
  const { lang, base } = useStore();
  const onCopyAddress = () => {
    copy(base.address);
    message.success(lang.t("address_copied"));
  };
  const onCopyTransactionId = () => {
    copy(base.link);
    message.success(lang.t("transaction_link_copied"));
  };
  return useObserver(() => (
    <div
      className={`page__home__component__complete_frame  text-left p-8 rounded ${
        props.isERCXRC ? "bg-primary" : "bg-secondary"
      }`}
    >
      <div className="page__home__component__complete_frame__top_bar flex items-center mb-4">
        <div
          className={`page__home__component__complete_frame__top_bar__circle page__home__component__complete_frame__top_bar__circle--first bg-green flex items-center justify-center ${
            props.isERCXRC ? "border-primary" : "border-secondary"
          }`}
        >
          <CheckOutlined
            className={`text-2xl ${
              props.isERCXRC ? "c-primary" : "c-secondary"
            }`}
          />
        </div>
        <div className="page__home__component__complete_frame__top_bar__circle page__home__component__complete_frame__top_bar__circle--second  bg-green" />
        <div className="page__home__component__complete_frame__top_bar__bar" />
      </div>
      <div className="c-white text-lg font-thin">
        {lang.t(
          props.isERCXRC
            ? "broadcast_transaction_successfully_eth"
            : "broadcast_transaction_successfully_iotx"
        )}
      </div>
      <div className="c-gray-30 font-thin mt-3 text-sm">
        {props.isERCXRC
          ? lang.t("complete.tx_broadcast_network")
          : lang.t("complete.tx_broadcast_network.xrc20", {
              tokenName: base.tokenName,
            })}
      </div>
      <div className="c-gray-30 font-normal flex items-center text-base flex-wrap">
        <span>{base.address}</span>
        &nbsp;&nbsp;
        <img
          src={IMG_COPY}
          onClick={onCopyAddress}
          className="page__home__component__complete_frame__btn--copy cursor-pointer"
        />
      </div>
      <div className="c-white text-base font-thin mt-10 flex items-center">
        {lang.t(
          props.isERCXRC ? "complete.your_tx_eth" : "complete.your_tx_iotx"
        )}
        &nbsp;
      </div>
      <div className="text-base font-thin">
        <a
          className="page__home__component__complete_frame__link c-green"
          href={base.link}
          target="_blank"
        >
          <u>{base.hash}</u>
        </a>
        &nbsp;&nbsp;
        <img
          src={IMG_COPY}
          onClick={onCopyTransactionId}
          className="page__home__component__complete_frame__btn--copy cursor-pointer"
        />
      </div>
      <div className="c-gray-30 font-light mt-3 mb-20 text-sm">
        {lang.t("complete.check_status_comment")}
      </div>
      <Button
        className={`page__home__component__complete_frame__btn--complete bg-green-10 w-full ${
          props.isERCXRC ? "c-primary" : "c-secondary"
        }`}
        onClick={() => {
          base.toggleComplete();
        }}
      >
        {lang.t("complete")}
      </Button>
    </div>
  ));
};
