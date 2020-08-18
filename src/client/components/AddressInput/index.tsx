import React from 'react';
import './index.scss';
import { Input } from 'antd';

const { TextArea } = Input;

interface IComponentProps {
  address: string;
  label: string;
  onChange: Function;
}

export const AddressInput = (props: IComponentProps) => {
  return (
    <div className="component__address_input bg-secondary c-white rounded px-5 py-4">
      <div className="text-xl font-normal">{props.label}</div>
      <TextArea
        value={props.address}
        rows={2}
        onChange={(event) => {
          event.persist();
          props.onChange(event.target.value);
        }}
      />
    </div>
  );
};
