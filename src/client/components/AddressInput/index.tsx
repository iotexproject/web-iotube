import React from "react";
import "./index.scss";
import { Input } from "antd";

const { TextArea } = Input;

interface IComponentProps {
  address: string;
  label: string;
  onChange?: Function;
  readOnly?: boolean;
}

export const AddressInput = (props: IComponentProps) => {
  return (
    <div className="component__address_input bg-secondary c-white rounded px-5 py-4">
      <div className="text-xl font-thin">{props.label}</div>
      <TextArea
        readOnly={props.readOnly || false}
        value={props.address}
        rows={2}
        onChange={(event) => {
          event.persist();
          if (props.onChange) props.onChange(event.target.value);
        }}
      />
    </div>
  );
};
