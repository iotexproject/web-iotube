import React from "react";
import "./index.scss";
import { Select } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Token } from "@uniswap/sdk";
import CurrencyLogo from "../CurrencyLogo/index";
import { useTokens } from "../../hooks/Tokens";

interface IComponentProps {
  onChange: Function;
}

const { Option } = Select;

export const TokenSelectField = (props: IComponentProps) => {
  const tokenList = useTokens();
  return (
    <Select
      className="component__token_select w-full c-white"
      suffixIcon={<RightOutlined className="c-gray-10 text-base mr-2" />}
      dropdownClassName="component__token_select__dropdown"
      onChange={(value: string) => {
        if (tokenList && value) {
          props.onChange(tokenList[value.toLowerCase()]);
        }
      }}
    >
      {tokenList &&
        Object.values(tokenList).map((token: Token) => (
          <Option
            key={token.address}
            value={token.address}
            className="flex bg-secondary c-white items-center"
          >
            <CurrencyLogo currency={token} />
            <span className="flex-1 text-xl text-left ml-4 font-thin">
              {`${token.name}(${token.symbol})`}
            </span>
          </Option>
        ))}
    </Select>
  );
};
