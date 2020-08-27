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

export enum IotexChainId {
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

type IotexTokenPairList = {
  readonly [chainId in IotexChainId]: TokenInfoPair[];
};

type ChainContractAddress = {
  readonly [chainId in ChainId]: string;
};

type IotexChainContractAddress = {
  readonly [chainId in IotexChainId]: string;
};

export const ETH_CHAIN_CASHIER_CONTRACT_ADDRESS: ChainContractAddress = {
  // ETH CHAIN ID
  [ChainId.MAINNET]:
    publicConfig[`ETH_CASHIER_CONTRACT_ADDRESS_${ChainId[ChainId.MAINNET]}`],
  [ChainId.ROPSTEN]:
    publicConfig[`ETH_CASHIER_CONTRACT_ADDRESS_${ChainId[ChainId.ROPSTEN]}`],
  [ChainId.RINKEBY]: "",
  [ChainId.GÖRLI]: "",
  [ChainId.KOVAN]: "",
};

export const IOTEX_CASHIER_CONTRACT_ADDRESS: IotexChainContractAddress = {
  [IotexChainId.MAINNET]:
    publicConfig[
      `IOTX_CASHIER_CONTRACT_ADDRESS_${IotexChainId[IotexChainId.MAINNET]}`
    ],
  [IotexChainId.TESTNET]:
    publicConfig[
      `IOTX_CASHIER_CONTRACT_ADDRESS_${IotexChainId[IotexChainId.TESTNET]}`
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

export const IOTEX_TOKEN_LIST: IotexTokenPairList = {
  [IotexChainId.MAINNET]: Object.values(MAINNET_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: IotexChainId.MAINNET } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: IotexChainId.MAINNET } as TokenInfo,
    };
  }),
  [IotexChainId.TESTNET]: Object.values(ROPSTEN_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: IotexChainId.TESTNET } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: IotexChainId.TESTNET } as TokenInfo,
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

export const TRANSACTION_REJECTED = 4001;
