import React, { MouseEventHandler } from 'react';
import { Modal, Avatar, Button } from 'antd';
import { TOKENS } from '../index';
import { useStore } from '../../../common/store';
const TOKEN_IMG = require('../../static/images/icon-eth.png');

interface IComponentProps {
  visible: boolean;
  onConfirm: MouseEventHandler;
  close: MouseEventHandler;
  tubeFee: number;
  networkFee: number;
  depositAmount: number;
  depositToken: string;
  mintAmount: number;
  mintToken: string;
  mintTokenName: string;
  middleComment: string;
  isERCXRC: boolean;
}

export const ConfirmModal = (props: IComponentProps) => {
  const { lang } = useStore();
  const depositToken = TOKENS.find(
    (element) => element.id === props.depositToken
  );
  const mintToken = TOKENS.find((element) => element.id === props.mintToken);

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
        <Avatar size="small" src={depositToken && TOKEN_IMG} />
        <span className="text-xl ml-2 font-light">
          {depositToken && depositToken.name}
        </span>
      </div>
      <div className="c-gray font-thin text-base mt-2 mb-5">
        {props.middleComment}
      </div>
      <div className="c-white  flex items-center">
        <span className="font-normal text-3xl mr-3">{props.mintAmount}</span>
        <Avatar size="small" src={mintToken && TOKEN_IMG} />
        <span className="text-xl ml-2 font-light">
          {mintToken && mintToken.name}
        </span>
      </div>
      <div className="c-gray font-thin text-base mt-2 mb-5">
        on {props.mintTokenName}
      </div>
      <div className="my-6 text-left c-gray">
        <div className="font-normal text-base mb-3">{lang.t('fee')}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t('fee.tube')}</span>
          <span>0 ({lang.t('free')})</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>
            {lang.t(props.isERCXRC ? 'relay_to_iotex' : 'relay_to_ethereum')}
          </span>
          <span>0 ({lang.t('free')})</span>
        </div>
      </div>
      <div>
        <Button
          onClick={props.onConfirm}
          className={`modal__confirm_deposit__confirm ${
            props.isERCXRC
              ? 'modal__confirm_deposit__confirm--erc-xrc'
              : 'modal__confirm_deposit__confirm--xrc-erc'
          } w-full c-white`}
          type="primary"
        >
          {lang.t('confirm')}
        </Button>
      </div>
    </Modal>
  );
};
