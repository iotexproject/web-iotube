import { AbstractConnector } from "@web3-react/abstract-connector";
import { ChainId, JSBI, Percent, Token } from "@uniswap/sdk";
import {
  fortmatic,
  injected,
  portis,
  walletconnect,
  walletlink,
} from "../connectors";
import { TokenInfo } from "@uniswap/token-lists";
import ROPSTEN_TOKEN_LIST from "./ropsten-token-list.json";
import MAINNET_TOKEN_LIST from "./mainnet-token-list.json";
import { publicConfig } from "../../../configs/public";

export const IMG_LOGO = require("../static/images/logo-iotex.png");
export const IMG_IOTX = require("../static/images/icon_wallet.png");
export const IMG_ETHER = require("../static/images/icon-eth.png");

export const ETHEREUM = "ETHEREUM";
export const IOTEX = "IOTEX";

export const DEFAULT_IOTEX_CHAIN_ID = publicConfig.DEFAULT_IOTEX_CHAIN_ID;

if (typeof DEFAULT_IOTEX_CHAIN_ID === "undefined") {
  throw new Error(
    `DEFAULT_IOTEX_CHAIN_ID must be a defined environment variable`
  );
}

export enum IOChainId {
  MAINNET = 1,
  TESTNET = 2,
}

export type TokenInfoPair = {
  readonly ETHEREUM: TokenInfo;
  readonly IOTEX: TokenInfo;
};

type ChainTokenPairList = {
  readonly [chainId in ChainId]: TokenInfoPair[];
};

type IOTokenPairList = {
  readonly [chainId in IOChainId]: TokenInfoPair[];
};

type ChainContractAddress = {
  readonly [chainId in ChainId]: string;
};

type IOChainContractAddress = {
  readonly [chainId in IOChainId]: string;
};

export const CHAIN_CASHIER_CONTRACT_ADDRESS: ChainContractAddress = {
  [ChainId.MAINNET]:
    publicConfig[`ETH_CASHIER_CONTRACT_ADDRESS_${ChainId[ChainId.MAINNET]}`],
  [ChainId.ROPSTEN]:
    publicConfig[`ETH_CASHIER_CONTRACT_ADDRESS_${ChainId[ChainId.ROPSTEN]}`],
  [ChainId.RINKEBY]: "",
  [ChainId.GÖRLI]: "",
  [ChainId.KOVAN]: "",
};

export const IOTEX_CASHIER_CONTRACT_ADDRESS: IOChainContractAddress = {
  [IOChainId.MAINNET]:
    publicConfig[
      `IOTX_CASHIER_CONTRACT_ADDRESS_${IOChainId[IOChainId.MAINNET]}`
    ],
  [IOChainId.TESTNET]:
    publicConfig[
      `IOTX_CASHIER_CONTRACT_ADDRESS_${IOChainId[IOChainId.TESTNET]}`
    ],
};

export const CHAIN_TOKEN_LIST: ChainTokenPairList = {
  [ChainId.MAINNET]: Object.values(MAINNET_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: ChainId.MAINNET } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: ChainId.MAINNET } as TokenInfo,
    };
  }),
  [ChainId.ROPSTEN]: Object.values(ROPSTEN_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: ChainId.ROPSTEN } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: ChainId.ROPSTEN } as TokenInfo,
    };
  }),
  [ChainId.RINKEBY]: [],
  [ChainId.GÖRLI]: [],
  [ChainId.KOVAN]: [],
};

export const IOCHAIN_TOKEN_LIST: IOTokenPairList = {
  [IOChainId.MAINNET]: Object.values(MAINNET_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: IOChainId.MAINNET } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: IOChainId.MAINNET } as TokenInfo,
    };
  }),
  [IOChainId.TESTNET]: Object.values(ROPSTEN_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: IOChainId.TESTNET } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: IOChainId.TESTNET } as TokenInfo,
    };
  }),
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    iconName: "arrow-right.svg",
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: "WalletConnect",
    iconName: "walletConnectIcon.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    href: null,
    color: "#4196FC",
    mobile: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: "Coinbase Wallet",
    iconName: "coinbaseWalletIcon.svg",
    description: "Use Coinbase Wallet app on mobile device",
    href: null,
    color: "#315CF5",
  },
  COINBASE_LINK: {
    name: "Open in Coinbase Wallet",
    iconName: "coinbaseWalletIcon.svg",
    description: "Open in Coinbase Wallet app.",
    href: "https://go.cb-w.com/mtUDhEZPy1",
    color: "#315CF5",
    mobile: true,
    mobileOnly: true,
  },
  FORTMATIC: {
    connector: fortmatic,
    name: "Fortmatic",
    iconName: "fortmaticIcon.png",
    description: "Login using Fortmatic hosted wallet",
    href: null,
    color: "#6748FF",
    mobile: true,
  },
  Portis: {
    connector: portis,
    name: "Portis",
    iconName: "portisIcon.png",
    description: "Login using Portis hosted wallet",
    href: null,
    color: "#4A6C9B",
    mobile: true,
  },
};

export const ETH_NETWORK_NAMES = {
  [ChainId.MAINNET]: "MAINNET",
  [ChainId.ROPSTEN]: "ROPSTEN",
  [ChainId.RINKEBY]: "RINKEBY",
  [ChainId.GÖRLI]: "GÖRLI",
  [ChainId.KOVAN]: "KOVAN",
};

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(
  JSBI.BigInt(75),
  JSBI.BigInt(10000)
);

export const TRANSACTION_REJECTED = 4001;
