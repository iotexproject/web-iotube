import { ChainId, Currency, Token } from "@uniswap/sdk";
import { useMemo } from "react";
import { useActiveWeb3React } from "./index";
import { CHAIN_TOKEN_LIST, DEFAULT_IOTEX_CHAIN_ID, ETHEREUM, IOTEX_TOKEN_LIST, IOTEX, TokenInfoPair, IOTX_ETH_PRICE } from "../constants/index";
import { TokenInfo } from "@uniswap/token-lists";
import { parseUnits } from "@ethersproject/units";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { BigNumber } from "@ethersproject/bignumber";
import { publicConfig } from "../../../configs/public";

export enum AmountState {
  ZERO,
  UNAPPROVED,
  APPROVED,
}

export const DEFAULT_TOKEN_DECIMAL = 18;

export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo;
  constructor(tokenInfo: TokenInfo) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name);
    this.tokenInfo = tokenInfo;
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI;
  }
}

export type TokenAddressMap = Readonly<
  {
    [chainId in ChainId]: Readonly<{
      [tokenAddress: string]: WrappedTokenInfo;
    }>;
  }
>;

export function useTokens(network: string): { [p: string]: TokenInfoPair } {
  const { chainId = publicConfig.IS_PROD ? ChainId.MAINNET : ChainId.KOVAN } = useActiveWeb3React();
  return useMemo(() => {
    const tokenList = {};
    if (network === ETHEREUM) {
      if (chainId) {
        CHAIN_TOKEN_LIST[chainId].forEach((aToken, index) => {
          if (aToken.ETHEREUM.address) {
            tokenList[`${index}_${chainId}_${aToken.ETHEREUM.name.toLowerCase()}_${aToken.ETHEREUM.address.toLowerCase()}`] = {
              ETHEREUM: new WrappedTokenInfo(aToken.ETHEREUM),
              IOTEX: aToken.IOTEX,
            };
          }
        });
      }
    } else if (network === IOTEX) {
      (IOTEX_TOKEN_LIST[DEFAULT_IOTEX_CHAIN_ID] || []).forEach((aToken) => {
        if (aToken.IOTEX.address) {
          tokenList[aToken.IOTEX.address.toLowerCase()] = {
            ETHEREUM: new WrappedTokenInfo(aToken.ETHEREUM),
            IOTEX: aToken.IOTEX,
          };
        }
      });
    }
    return tokenList;
  }, [chainId]);
}

export function tryParseAmount(value?: string, currency?: Currency): string {
  if (!value || !currency) {
    return "";
  }
  try {
    return parseUnits(value, currency.decimals).toString();
  } catch (error) {
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  return "";
}

export function getFeeIOTX(iotxFee: BigNumber): string {
  if (IOTX_ETH_PRICE <= 0) {
    return `${fromRau(iotxFee.toString(), "iotx")} IOTX`;
  }
  try {
    const feeInIotx = fromRau(iotxFee.toString(), "iotx");
    const ethConverted = Number(feeInIotx) * IOTX_ETH_PRICE;
    return `${fromRau(iotxFee.toString(), "iotx")} IOTX (~${ethConverted} ETH)`;
  } catch (error) {
    console.debug(`getFeeIOTX: Failed to calculate ETH fee with IOTX_ETH_PRICE ${IOTX_ETH_PRICE}`, error);
    return `${fromRau(iotxFee.toString(), "iotx")} IOTX`;
  }
}

export function amountInAllowance(allowance: BigNumber, amount: string, token: TokenInfo | null): AmountState {
  if (amount && token && allowance.gte(BigNumber.from(0))) {
    try {
      const amountBN = parseUnits(amount, token.decimals);
      return allowance.gte(amountBN) ? AmountState.APPROVED : AmountState.UNAPPROVED;
    } catch (error) {
      console.debug(`amountInAllowance: Failed to parseUnits ${amount} ${token.decimals}`, error);
    }
  }
  return AmountState.ZERO;
}
