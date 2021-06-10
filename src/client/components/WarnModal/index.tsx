import React, { MouseEventHandler } from "react";
import { Button, Modal } from "antd";
import { useStore } from "../../../common/store";
import { publicConfig } from "../../../../configs/public";
import { ChainId } from "@uniswap/sdk";
import { useActiveWeb3React } from "../../hooks/index";

interface IComponentProps {
  visible: boolean;
  close: MouseEventHandler;
  isERCXRC: boolean;
}

export const WarnModal = (props: IComponentProps) => {
  const { lang, base, wallet } = useStore();
  const { chainId } = useActiveWeb3React();
  if (!props.visible) return null;

  return (
    <Modal title={lang.t("warning")} visible={props.visible} onCancel={props.close} footer={null} className={`modal__warn ${props.isERCXRC ? "modal__warn--ercxrc" : "modal__warn--xrcerc"}`}>
      <div className="text-sm c-white font-light mb-6">
        {props.isERCXRC ? (
          <div className="text-base mb-2">{lang.t("warning.chainId.comment", { currentNetwork: wallet.metaMaskConnected ? base.targetChainToken?.network : base.chainToken.network })}</div>
        ) : (
          <>
            <div className="text-base mb-2">{lang.t("warning.iotx.comment.mobile", { chainStandard: base.chainToken.standard })}</div>
            <div className="text-base mb-2">
              {lang.t("warning.iotx.comment.desktop1")}&nbsp;
              <a href="https://iopay.iotex.io/desktop">{lang.t("warning.iotx.comment.desktop2")}</a>
              &nbsp;
              {lang.t("warning.iotx.comment.desktop3")}
            </div>
          </>
        )}
      </div>
      <div>
        <Button onClick={props.close} className={`modal__warn__confirm w-full c-white`} type="primary">
          {lang.t("ok")}
        </Button>
      </div>
    </Modal>
  );
};
