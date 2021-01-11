import React, { MouseEventHandler } from "react";
import { Modal } from "antd";
import window from "global/window";
import { useStore } from "../../../common/store";
const IMG_MATAMASK = require("../../static/images/metamask.png");
const IM_TOKEN = require("../../static/images/imToken.png");
const TRUST_WALLET = require("../../static/images/trustwallet.png");
const TOKEN_POCKET = require("../../static/images/tokenpocket.png");
const OTHER_WALLET = require("../../static/images/other_wallet.png");

interface IComponentProps {
  visible: boolean;
  close: MouseEventHandler;
}

const wallets = [
  { name: "imToken", src: IM_TOKEN, url: "imtokenv2://navigate?screen=DappView&url=https://tube.iotex.io/eth" },
  { name: "Metamask", src: IMG_MATAMASK, url: "https://metamask.app.link/dapp/tube.iotex.io/eth" },
  { name: "Trust Wallet", src: TRUST_WALLET, url: "https://link.trustwallet.com/open_url?coin_id=60&url=https://tube.iotex.io/eth" },
  { name: "Token Pocket", src: TOKEN_POCKET, url: "" },
  { name: "Other Wallet", src: OTHER_WALLET, url: "" },
];

export const OpenModal = (props: IComponentProps) => {
  const { lang } = useStore();
  if (!props.visible) return null;

  const toOpenAppUrl = (url: String) => {
    if (window.openOtherApp) {
      window.openOtherApp(url);
    } else {
      window.console.log("not found openOtherApp Function");
    }
  };

  return (
    <Modal visible={props.visible} onCancel={props.close} footer={null} style={{ top: 300 }} className="modal__open">
      <div className="text-base mb-4 c-white">{lang.t("open_tube_in_desc")}</div>
      <div className="modal__open__list text-sm font-light">
        <ul>
          {wallets.map((item) => {
            return (
              <li key={item.name} onClick={() => toOpenAppUrl(item.url)}>
                <img src={item.src} alt="" />
                <p>{item.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
};
