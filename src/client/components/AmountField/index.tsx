import React from 'react';
import './index.scss';
import { Input } from 'antd';

interface IComponentProps {
  amount: string;
  label: string;
  onChange: Function;
}

export const AmountField = (props: IComponentProps) => {
  return (
    <Input
      className="component__amount_field bg-secondary c-white"
      prefix={<span className="text-xl">{props.label}</span>}
      placeholder="0.0"
      value={props.amount}
      onChange={(event) => {
        event.persist();
        props.onChange(event.target.value);
      }}
    />
  );
};
