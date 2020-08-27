import { Currency, Token } from "@uniswap/sdk";
import React, { useState } from "react";
import styled from "styled-components";
import { TokenInfo } from "@uniswap/token-lists";

import uriToHttp from "../../utils/index";
import { Avatar } from "antd";
import { WrappedTokenInfo } from "../../hooks/Tokens";

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

export default function CurrencyLogo({
  currency,
  size = "24px",
  ...rest
}: {
  currency?: Currency | TokenInfo;
  size?: string;
  style?: React.CSSProperties;
}) {
  if (currency instanceof Token) {
    let uri: string | undefined;

    if (currency instanceof WrappedTokenInfo) {
      if (currency.logoURI && currency.logoURI.startsWith("data:image")) {
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

  if (currency["logoURI"]) {
    return <Avatar src={currency["logoURI"]} size="small" />;
  }

  return (
    <Emoji {...rest} size={size}>
      <span role="img" aria-label="Thinking" />
    </Emoji>
  );
}
