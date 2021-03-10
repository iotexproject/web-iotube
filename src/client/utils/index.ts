import { Contract } from "@ethersproject/contracts";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { validateAddress } from "iotex-antenna/lib/account/utils";
import { BigNumber } from "@ethersproject/bignumber";
import { ChainId } from "@uniswap/sdk";
import { Contract as IOTXContract } from "iotex-antenna/lib/contract/contract";
import { AntennaUtils } from "../../common/utils/antenna";
import { DEFAULT_IOTEX_CHAIN_ID, ETHEREUM, IOTEX, IOTEXSCAN_URL } from "../constants/index";
import { useWeb3React } from "@web3-react/core";
import { publicConfig } from "../../../configs/public";

const ETHERSCAN_URL: { [chainId in ChainId]: string } = {
  1: "https://etherscan.io/",
  42: "https://kovan.etherscan.io/",
  56: "https://bscscan.com/",
};

export function isAddress(value: any): string | false {
  try {
    if (typeof value === "string" && value.startsWith("io") && validateAddress(`${value}`)) {
      return value;
    }
    return getAddress(value);
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    window.console.log(`Invalid 'address' parameter '${address}'.`);
    return address;
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

export function getIOTXContract(address: string, ABI: any): IOTXContract {
  if (!validateAddress(address)) {
    throw Error(`Invalid io address parameter '${address}'.`);
  }
  return new IOTXContract(ABI, address, {
    provider: AntennaUtils.getAntenna().iotx,
    signer: AntennaUtils.getAntenna().iotx.signer,
  });
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// add 10% on top of estimated gas limit
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

export function getEtherscanLink(chainId: number, data: string, type: "transaction" | "token" | "address"): string {
  const prefix = ETHERSCAN_URL[chainId];

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`;
    }
    case "token": {
      return `${prefix}/token/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}
export function getTokenLink(network: string, data: string): string {
  if (network === ETHEREUM) {
    const { chainId = publicConfig.IS_PROD ? ChainId.MAINNET : ChainId.KOVAN } = useWeb3React<Web3Provider>();
    return getEtherscanLink(chainId, data, "token");
  } else if (network === IOTEX) {
    const prefix = IOTEXSCAN_URL[DEFAULT_IOTEX_CHAIN_ID];
    return `${prefix}address/${data}`;
  }
  return "";
}

export default function uriToHttp(uri: string): string[] {
  try {
    const parsed = new URL(uri);
    if (parsed.protocol === "http:") {
      return ["https" + uri.substr(4), uri];
    } else if (parsed.protocol === "https:") {
      return [uri];
    } else if (parsed.protocol === "ipfs:") {
      const hash = parsed.href.match(/^ipfs:(\/\/)?(.*)$/)?.[2];
      return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`];
    } else if (parsed.protocol === "ipns:") {
      const name = parsed.href.match(/^ipns:(\/\/)?(.*)$/)?.[2];
      return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`];
    } else {
      return [];
    }
  } catch (error) {
    if (uri.toLowerCase().endsWith(".eth")) {
      return [`https://${uri.toLowerCase()}.link`];
    }
    return [];
  }
}

export const isValidAmount = (amount: string) => {
  return amount && Number(amount) > 0;
};

export const getAmountNumber = (amount: string) => {
  return isValidAmount(amount) ? Number(amount) : 0;
};
