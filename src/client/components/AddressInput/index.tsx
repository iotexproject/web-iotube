import React, { useEffect, useState } from "react";
import "./index.scss";
import { Input } from "antd";
import { useStore } from "../../../common/store/index";

const { TextArea } = Input;

interface IComponentProps {
  address: string;
  label: string;
  onChange?: Function;
  readOnly?: boolean;
}

export const AddressInput = (props: IComponentProps) => {
  const { lang } = useStore();
  const [mappingAddress, setMappingAddress] = useState(true);
  const [currentAddress, setCurrentAddress] = useState(props.address);

  const onChange = (address) => {
    setCurrentAddress(address);
    if (props.onChange) props.onChange(address);
  };

  useEffect(() => {
    if( mappingAddress){
      onChange(props.address)
    }
  }, [mappingAddress]);

  return (
    <div>
      <div className="text-base font-thin c-gray-20">
        <span>{props.label}</span>
        <span
          className="page__home__component__erc_xrc__max c-green-20 border-green-20 px-1 mx-2 leading-5 font-light text-sm cursor-pointer"
          onClick={() => {
            setMappingAddress(!mappingAddress);
          }}
        >
        {mappingAddress?lang.t("change_destination"):lang.t("reset_destination")}
        </span>
      </div>
      <div className={`component__address_input ${mappingAddress?"bg-gray-400":"bg-secondary"} c-white rounded px-5 py-4`}>
        <TextArea
          readOnly={mappingAddress}
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
