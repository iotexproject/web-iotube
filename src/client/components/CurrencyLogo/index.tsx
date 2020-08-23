import { Currency, ETHER, Token } from "@uniswap/sdk";
import React, { useState } from "react";
import styled from "styled-components";

import uriToHttp from "../../utils/index";
import { Avatar } from "antd";
import { WrappedTokenInfo } from "../../hooks/Tokens";

const EthereumLogo = require("../../static/images/icon-eth.png");

const getTokenLogoURL = (address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
const BAD_URIS: { [tokenAddress: string]: true } = {};

const Emoji = styled.span<{ size?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-bottom: -4px;
`;

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

export default function CurrencyLogo({
  currency,
  size = "24px",
  ...rest
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const [, refresh] = useState<number>(0);

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} {...rest} />;
  }

  if (currency instanceof Token) {
    let uri: string | undefined;

    if (currency instanceof WrappedTokenInfo) {
      if (currency.logoURI&&currency.logoURI.startsWith("data:image")){
        return <Avatar src={currency.logoURI} size="small" />;
      }

      if (currency.logoURI && !BAD_URIS[currency.logoURI]) {
        uri = uriToHttp(currency.logoURI).filter((s) => !BAD_URIS[s])[0];
      }
    }

    if (!uri) {
      const defaultUri = getTokenLogoURL(currency.address);
      if (!BAD_URIS[defaultUri]) {
        uri = defaultUri;
      }
    }

    if (uri) {
      return <Avatar src={uri} size="small" />;
    }
  }

  return (
    <Emoji {...rest} size={size}>
      <span role="img" aria-label="Thinking">
        🤔
      </span>
    </Emoji>
  );
}
