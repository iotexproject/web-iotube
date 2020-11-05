import React, { useCallback } from "react";
import "./index.scss";
import { Select } from "antd";
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import CurrencyLogo from "../CurrencyLogo/index";
import { useTokens } from "../../hooks/Tokens";
import { ETHEREUM, TokenInfoPair } from "../../constants/index";
import { getTokenLink } from "../../utils/index";
import { publicConfig } from "../../../../configs/public";
import { ChainId } from "@uniswap/sdk";
import { useActiveWeb3React } from "../../hooks/index";

interface IComponentProps {
  onChange: Function;
  network: string;
}

const { Option } = Select;

export const TokenSelectField = (props: IComponentProps) => {
  const { chainId = publicConfig.IS_PROD ? ChainId.MAINNET : ChainId.KOVAN } = useActiveWeb3React();
  const { network = ETHEREUM, onChange } = props;
  const tokenList = useTokens(network);
  return (
    <Select
      key={`token-select-${chainId}`}
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
          <Option
            key={`${chainId}-${tokenInfoPair[network].name.toLowerCase()}_${tokenInfoPair[network].address.toLowerCase()}`}
            value={`${chainId}-${tokenInfoPair[network].name.toLowerCase()}_${tokenInfoPair[network].address.toLowerCase()}`}
            className="flex bg-secondary c-white items-center"
          >
            <CurrencyLogo currency={tokenInfoPair[network]} />
            <span className="flex-1 text-xl text-left ml-2 font-thin">{`${tokenInfoPair[network].name}(${tokenInfoPair[network].symbol})`}</span>
            <a href={getTokenLink(network, tokenInfoPair[network].address)} target="_blank">
              <InfoCircleOutlined style={{ color: "#9398A2" }} />
            </a>
          </Option>
        ))}
    </Select>
  );
};
