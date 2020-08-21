import React, { MouseEventHandler } from 'react';
import { Button } from 'antd';
import './index.scss';

interface IComponentProps {
  title: string;
  icon?: React.ReactNode;
  onClick: MouseEventHandler;
  disabled?: boolean;
}

export const SubmitButton = (props: IComponentProps) => {
  return (
    <Button
      icon={props.icon}
      onClick={props.onClick}
      className={`component__submit_button w-full ${
        props.disabled ? 'component__submit_button--disabled' : ''
      }`}
      type="primary"
      size="large"
      disabled={props.disabled || false}
    >
      {props.title}
    </Button>
  );
};
