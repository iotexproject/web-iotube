import React, { MouseEventHandler, useState } from "react";
import { Modal } from "antd";
import window from "global/window";
import { useStore } from "../../../common/store";
import { AntennaUtils } from "../../../common/utils/antenna";
import { OtherWalletModal } from "../OtherWalletModal";
import { utils } from "../../../common/utils/index";
const IMG_MATAMASK = require("../../static/images/metamask.png");
const IM_TOKEN = require("../../static/images/imtoken.png");
const TRUST_WALLET = require("../../static/images/trustwallet.png");
const TOKEN_POCKET = require("../../static/images/tokenpocket.png");
const OTHER_WALLET = require("../../static/images/other_wallet.png");

interface IComponentProps {
  visible: boolean;
  close: MouseEventHandler;
  changeVisible: Function;
}

const wallets = [
  // { name: "imToken", src: IM_TOKEN, url: "imtokenv2://navigate?screen=DappView&url=https://tube.iotex.io/eth" },
  { name: "Metamask", src: IMG_MATAMASK, url: "https://metamask.app.link/dapp/tube.iotex.io/eth" },
  { name: "Trust Wallet", src: TRUST_WALLET, url: "https://link.trustwallet.com/open_url?coin_id=60&url=https://tube.iotex.io/eth" },
  { name: "Token Pocket", src: TOKEN_POCKET, url: null },
  { name: "Other Wallet", src: OTHER_WALLET, url: null },
];

export const OpenModal = (props: IComponentProps) => {
  const { lang, base } = useStore();
  const [copyModalVisible, setCopyModalVisible] = useState(false);

  const toOpenAppUrl = (item) => {
    if (utils.env.isIoPayMobile()) {
      if (item.url !== null) {
        //@ts-ignore
        AntennaUtils.getAntenna().iotx.signer.toOpenAppUrl(item.url);
      } else {
        setCopyModalVisible(true);
        props.changeVisible(false);
      }
    }
  };

  return (
    <>
      <Modal visible={props.visible} onCancel={props.close} footer={null} style={{ top: 300 }} className="modal__open modal__match_center__page">
        <div className="text-base mb-4 c-white">{lang.t("open_tube_in_desc", { network: base.chainToken.standard })}</div>
        <div className="modal__open__list text-sm font-light">
          <ul>
            {wallets.map((item) => {
              return (
                <li key={item.name} onClick={() => toOpenAppUrl(item)}>
                  <img src={item.src} alt="" />
                  <p>{item.name}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>
      <OtherWalletModal visible={copyModalVisible} close={() => setCopyModalVisible(!copyModalVisible)} />
    </>
  );
};
