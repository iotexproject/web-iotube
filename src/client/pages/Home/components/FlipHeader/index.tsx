import React, { useEffect, MouseEventHandler } from 'react';
import './index.scss';
import { Button } from 'antd';
import { useStore } from '../../../../../common/store';
import { SwapOutlined } from '@ant-design/icons';

interface IComponentProps {
  onFlip: MouseEventHandler;
}

export const FlipHeader = (props: IComponentProps) => {
  const { lang } = useStore();
  return (
    <div className="page__home__component__flip_header flex justify-end">
      <Button
        type="text"
        className="page__home__component__flip_header__btn-flip c-green"
        icon={<SwapOutlined />}
        onClick={props.onFlip}
      >
        {lang.t('flip')}
      </Button>
    </div>
  );
};
