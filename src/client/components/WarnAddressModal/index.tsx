import React, { MouseEventHandler } from "react";
import { Button, Modal } from "antd";
import { useStore } from "../../../common/store";
import { useActiveWeb3React } from "../../hooks/index";

interface IComponentProps {
  visible: boolean;
  close: MouseEventHandler;
  isERCXRC: boolean;
  onConfirm: MouseEventHandler;
  address: string;
  warningName: string;
}

export const WarnAddressModal = (props: IComponentProps) => {
  const { lang } = useStore();
  if (!props.visible) return null;

  return (
    <Modal title={lang.t("warning")} visible={props.visible} onCancel={props.close} footer={null} className={`modal__warn ${props.isERCXRC ? "modal__warn--ercxrc" : "modal__warn--xrcerc"}`}>
      <div className="text-sm c-white font-light mb-6">
        <>
          <div className="text-base mb-2">
            {lang.t("warning.address.convert", {
              address: props.address,
              name: props.warningName,
            })}
          </div>
        </>
      </div>
      <div>
        <div className="page__home__component__xrc_erc__button_group flex items-center">
          <Button onClick={props.close} className={`modal__warn__confirm w-full c-white`} type="primary">
            {lang.t("cancel")}
          </Button>
          &nbsp;
          <Button onClick={props.onConfirm} className={`modal__warn__confirm w-full c-white`} type="primary">
            {lang.t("confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
