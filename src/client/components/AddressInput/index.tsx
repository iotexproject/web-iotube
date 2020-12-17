import React, { useEffect, useState } from "react";
import "./index.scss";
import { Input } from "antd";
import { useStore } from "../../../common/store/index";

const { TextArea } = Input;

interface IComponentProps {
  address?: string;
  label: string;
  onChange?: Function;
  readOnly?: boolean;
}

export const AddressInput = (props: IComponentProps) => {
  const { lang } = useStore();
  const [currentAddress, setCurrentAddress] = useState(props.address);

  const onChange = (address) => {
    setCurrentAddress(address);
    if (props.onChange) props.onChange(address);
  };

  return (
    <div>
      <div className="text-base font-thin c-gray-20">
        <span>{props.label}</span>
        {currentAddress && (
          <span
            className="page__home__component__erc_xrc__max c-green-20 border-green-20 px-1 mx-2 leading-5 font-light text-sm cursor-pointer"
            onClick={() => {
              setCurrentAddress(null);
            }}
          >
            {lang.t("reset_destination")}
          </span>
        )}
      </div>
      <div className={"component__address_input bg-secondary c-white rounded px-5 py-4"}>
        <TextArea
          value={currentAddress}
          rows={3}
          onChange={(event) => {
            event.persist();
            onChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
};
