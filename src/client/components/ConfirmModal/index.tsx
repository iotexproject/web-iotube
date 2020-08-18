import React, { MouseEventHandler } from 'react';
import { Modal, Avatar } from 'antd';
import { TOKENS } from '../index';
import { useStore } from '../../../common/store';
import { SubmitButton } from '../SubmitButton';

interface IComponentProps {
  visible: boolean;
  onConfirm: MouseEventHandler;
  tubeFee: number;
  networkFee: number;
  depositAmount: number;
  depositToken: string;
  mintAmount: number;
  mintToken: string;
  mintTokenName: string;
}

export const ConfirmModal = (props: IComponentProps) => {
  const { lang } = useStore();
  const depositToken = TOKENS.find(
    (element) => element.id === props.depositToken
  );
  const mintToken = TOKENS.find((element) => element.id === props.mintToken);

  return (
    <Modal title="You are going to deposit">
      <div>
        <span>{props.depositAmount}</span>
        <Avatar size="small" src={depositToken.img} />
        <span>{depositToken.name}</span>
      </div>
      <div>to ioTube and mint</div>
      <div>
        <span>{props.mintAmount}</span>
        <Avatar size="small" src={mintToken.img} />
        <span>{mintToken.name}</span>
      </div>
      <div>on {props.mintTokenName}</div>
      <div className="my-6 c-white text-left c-gray">
        <div className="font-normal text-base mb-3">{lang.t('fee')}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t('fee.tube')}</span>
          <span>0 ({lang.t('free')})</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t('fee.network')}</span>
          <span>0 ({lang.t('free')})</span>
        </div>
      </div>
      <div>
        <SubmitButton title={lang.t('confirm')} onClick={props.onConfirm} />
      </div>
    </Modal>
  );
};
