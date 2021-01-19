import React, { MouseEventHandler, useState } from "react";
import { Button, Modal, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useStore } from "../../../common/store";

interface IComponentProps {
  visible: boolean;
  close: MouseEventHandler;
}

export const OtherWalletModal = (props: IComponentProps) => {
  const { lang } = useStore();
  if (!props.visible) return null;

  const onClickCopyButton = () => {
    const copyEle = document.querySelector(".contentText"); // 获取要复制的节点
    const range = document.createRange(); // 创造range
    window.getSelection().removeAllRanges(); //清除页面中已有的selection
    range.selectNode(copyEle); // 选中需要复制的节点
    window.getSelection().addRange(range); // 执行选中元素
    const copyStatus = document.execCommand("Copy"); // 执行copy操作
    // 对成功与否定进行提示
    if (copyStatus) {
      message.success("复制成功");
    } else {
      message.error("复制失败");
    }
    window.getSelection().removeAllRanges(); //清除页面中已有的selection
  };
  return (
    <Modal title={lang.t("warning")} visible={props.visible} onCancel={props.close} footer={null} className="modal__warn modal__warn--ercxrc">
      <div className="text-sm c-white font-light mb-6">
        <div className="text-base mb-2">
          <div>{lang.t("other.wallet.tips")}</div>
          <div className="flex items-center">
            <a className="contentText" href="https://tube.iotex.io/eth">
              {lang.t("other.wallet.link")}
            </a>
            <CopyOutlined onClick={onClickCopyButton} style={{ marginLeft: 15 }} />
          </div>
        </div>
      </div>
      <div>
        <Button onClick={props.close} className={`modal__warn__confirm w-full c-white`} type="primary">
          {lang.t("ok")}
        </Button>
      </div>
    </Modal>
  );
};
