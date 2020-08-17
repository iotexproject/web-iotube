import React, { MouseEventHandler } from 'react';
import { Button } from 'antd';
import './index.scss';

interface IComponentProps {
  title: string;
  icon?: React.ReactNode;
  onClick: MouseEventHandler;
}

export const SubmitButton = (props: IComponentProps) => {
  return (
    <Button
      icon={props.icon}
      title={props.title}
      onClick={props.onClick}
      className="component__submit_button"
      type="primary"
      size="large"
    />
  );
};
