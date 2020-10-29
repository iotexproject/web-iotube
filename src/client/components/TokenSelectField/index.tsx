import React from "react";
import "./index.scss";
import { Select } from "antd";
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import CurrencyLogo from "../CurrencyLogo/index";
import { useTokens } from "../../hooks/Tokens";
import { ETHEREUM, TokenInfoPair } from "../../constants/index";
import { getTokenLink } from "../../utils/index";

interface IComponentProps {
  onChange: Function;
  network: string;
}

const { Option } = Select;

export const TokenSelectField = (props: IComponentProps) => {
  const { network = ETHEREUM, onChange } = props;
  const tokenList = useTokens(network);
  return (
    <Select
      className="component__token_select w-full c-white"
      suffixIcon={<RightOutlined className="c-gray-10 text-base mr-2" />}
      dropdownClassName="component__token_select__dropdown"
      onChange={(value: string) => {
        if (tokenList && value) {
          onChange(tokenList[value.toLowerCase()]);
        }
      }}
    >
      {tokenList &&
        Object.values(tokenList).map((tokenInfoPair: TokenInfoPair) => (
          <Option key={tokenInfoPair[network].address} value={tokenInfoPair[network].address} className="flex bg-secondary c-white items-center">
            <CurrencyLogo currency={tokenInfoPair[network]} />
            <span className="flex-1 text-xl text-left ml-2 font-thin">{`${tokenInfoPair[network].name}(${tokenInfoPair[network].symbol})`}</span>
            <a href={getTokenLink(network,tokenInfoPair[network].address )} target="_blank">
              <InfoCircleOutlined style={{ color: "#9398A2" }} />
            </a>
          </Option>
        ))}
    </Select>
  );
};
