import { Contract } from "@ethersproject/contracts";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { validateAddress } from "iotex-antenna/lib/account/utils";
import { BigNumber } from "@ethersproject/bignumber";
import { ChainId } from "@uniswap/sdk";

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
};

export function isAddress(value: any): string | false {
  try {
    if (
      typeof value === "string" &&
      value.startsWith("io") &&
      validateAddress(`${value}`)
    ) {
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
    return `Invalid address ('${address}')`;
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// add 10% on top of estimated gas limit
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: "transaction" | "token" | "address"
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
  }etherscan.io`;

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

export default function uriToHttp(uri: string): string[] {
  try {
    const parsed = new URL(uri);
    if (parsed.protocol === "http:") {
      return ["https" + uri.substr(4), uri];
    } else if (parsed.protocol === "https:") {
      return [uri];
    } else if (parsed.protocol === "ipfs:") {
      const hash = parsed.href.match(/^ipfs:(\/\/)?(.*)$/)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
      ];
    } else if (parsed.protocol === "ipns:") {
      const name = parsed.href.match(/^ipns:(\/\/)?(.*)$/)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
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
