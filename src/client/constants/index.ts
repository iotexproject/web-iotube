import { AbstractConnector } from "@web3-react/abstract-connector";
import { ChainId } from "@uniswap/sdk";
import { fortmatic, injected, portis, walletconnect, walletlink } from "../connectors";
import { TokenInfo } from "@uniswap/token-lists";
import KOVAN_TOKEN_LIST from "./kovan-token-list.json";
import MAINNET_TOKEN_LIST from "./mainnet-token-list.json";
import BSC_TOKEN_LIST from "./bsc-token-list.json";

import { publicConfig } from "../../../configs/public";

export const IMG_LOGO = require("../static/images/logo_iotube.svg");
export const IMG_IOTX = require("../static/images/icon_wallet.png");
export const IMG_ETHER = require("../static/images/icon-eth.png");

import cashierABI from "./abis/erc20_xrc20.json";
import tokenListABI from "./abis/token_list.json";

export const ETHEREUM = "ETHEREUM";
export const IOTEX = "IOTEX";

export const DEFAULT_IOTEX_CHAIN_ID = publicConfig.DEFAULT_IOTEX_CHAIN_ID;
export const IOTX_ETH_PRICE = typeof publicConfig.IOTX_ETH_PRICE === "undefined" ? 0 : publicConfig.IOTX_ETH_PRICE;

if (typeof DEFAULT_IOTEX_CHAIN_ID === "undefined") {
  throw new Error(`DEFAULT_IOTEX_CHAIN_ID must be a defined environment variable`);
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


export const IOTEXSCAN_URL = {
  [IotexChainId.MAINNET]: "https://iotexscan.io/",
  [IotexChainId.TESTNET]: "https://testnet.iotexscan.io/",
};

export type ChianMapType = typeof chianMap;

export const chianMap = {
  eth: {
    [ChainId.MAINNET]: {
      contract: {
        cashier: {
          address: "0xa0fd7430852361931b23a31f84374ba3314e1682",
          abi: cashierABI,
        },
        mintableTokenList: {
          address: "0x73ffdfc98983ad59fb441fc5fe855c1589e35b3e",
          abi: tokenListABI,
        },
        standardTokenList: {
          address: "0x7c0bef36e1b1cbeb1f1a5541300786a7b608aede",
          abi: tokenListABI,
        },
      },
    },
    [ChainId.KOVAN]: {
      contract: {
        cashier: {
          address: "0xd3aaa7e009d2982164e82b855d0ce87c7dd364db",
          abi: cashierABI,
        },
        mintableTokenList: {
          address: "0xaf5e19fbac85ff5ef94cacc79d085efb6b146d89",
          abi: tokenListABI,
        },
        standardTokenList: {
          address: "0xaf2873b71574758b4b5a8f005561f13ca59573f2",
          abi: tokenListABI,
        },
      },
    },
    56:{
      contract: {
        cashier: {
          address: "0x082020Ae0B38fD1bef48895c6cFf4428e420F400",
          abi: cashierABI,
        },
        mintableTokenList: {
          address: "0xa6ae9312D0AA3CC74d969Fcd4806d7729A321EE3",
          abi: tokenListABI,
        },
        standardTokenList: {
          address: "0x0d793F4D4287265B9bdA86b7a4083193E8743b34",
          abi: tokenListABI,
        },
      },
    }
  },
  iotex: {
    [IotexChainId.MAINNET]: {
      contract: {
        cashier: {
          address: "io1gsr52ahqzklaf7flqar8r0269f2utkw9349qg8",
          abi: cashierABI,
        },
        mintableTokenList: {
          address: "io1dn8nqk3pmmll990xz6a94fpradtrljxmmx5p8j",
          abi: tokenListABI,
        },
        standardTokenList: {
          address: "io1t89whrwyfr0supctsqcx9n7ex5dd8yusfqhyfz",
          abi: tokenListABI,
        },
      },
    },
    [IotexChainId.TESTNET]: {
      contract: {
        cashier: {
          address: "io1m5lxrn8q604fz4zqv05ly4ehykzs0g0a2ksmcg",
          abi: cashierABI,
        },
        mintableTokenList: {
          address: "io1d6vjmu2862e6ax50nquygh56xn2jpmfavhpwv2",
          abi: tokenListABI,
        },
        standardTokenList: {
          address: "io1rsaswmmm8sps83ncumtsefz0hxq7anr78xtxvw",
          abi: tokenListABI,
        },
      },
    },
  },
};

export const CHAIN_TOKEN_LIST: ChainTokenPairList = {
  [ChainId.MAINNET]: Object.values(MAINNET_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: ChainId.MAINNET } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: ChainId.MAINNET } as TokenInfo,
    };
  }),
  [ChainId.KOVAN]: Object.values(KOVAN_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: ChainId.KOVAN } as TokenInfo,
      IOTEX: item.iotx ? ({ ...item.iotx, chainId: ChainId.KOVAN } as TokenInfo) : null,
    };
  }),
  56: Object.values(BSC_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: ChainId.KOVAN } as TokenInfo,
      IOTEX: item.iotx ? ({ ...item.iotx, chainId: ChainId.KOVAN } as TokenInfo) : null,
    };
  }),
};

export const IOTEX_TOKEN_LIST: IotexTokenPairList = {
  [IotexChainId.MAINNET]: Object.values(MAINNET_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: IotexChainId.MAINNET } as TokenInfo,
      IOTEX: { ...item.iotx, chainId: IotexChainId.MAINNET } as TokenInfo,
    };
  }),
  [IotexChainId.TESTNET]: Object.values(KOVAN_TOKEN_LIST).map((item) => {
    return {
      ETHEREUM: { ...item.eth, chainId: IotexChainId.TESTNET } as TokenInfo,
      IOTEX: item.iotx ? ({ ...item.iotx, chainId: IotexChainId.TESTNET } as TokenInfo) : null,
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
  [ChainId.KOVAN]: "KOVAN",
  56:"BSC"
};

export const NetworkContextName = "NETWORK";

export const TRANSACTION_REJECTED = 4001;
