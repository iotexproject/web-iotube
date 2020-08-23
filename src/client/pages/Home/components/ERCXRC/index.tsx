import React, { useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../../../common/store";
import {
  CASHIER_CONTRACT_ADDRESS,
  IOTX,
  SUPPORTED_WALLETS,
  TRANSACTION_REJECTED,
  wrappedIOTXInfo,
} from "../../../../constants/index";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected } from "../../../../connectors/index";
import { Web3Provider } from "@ethersproject/providers";
import useENSName from "../../../../hooks/useENSName";
import {
  calculateGasMargin,
  getContract,
  getEtherscanLink,
  isAddress,
  shortenAddress,
} from "../../../../utils/index";
import { useETHBalances } from "../../../../state/wallet/hooks";
import {
  AmountField,
  SubmitButton,
  TokenSelectField,
  AddressInput,
} from "../../../../components";
import { ConfirmModal } from "../../../../components/ConfirmModal/index";
import ERC20_XRC20_ABI from "../../../../constants/abis/erc20_xrc20.json";
import { Contract } from "@ethersproject/contracts";
import { toRau, validateAddress } from "iotex-antenna/lib/account/utils";
import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";
import ERC20_ABI from "../../../../constants/abis/erc20.json";
import { fromString } from "iotex-antenna/lib/crypto/address";
import message from "antd/lib/message";
import { tryParseAmount } from "../../../../hooks/Tokens";

const IMG_MATAMASK = require("../../../../static/images/metamask.png");

export const ERCXRC = () => {
  const { lang, wallet } = useStore();
  const { account, activate, chainId, library } = useWeb3React<Web3Provider>();
  const { ENSName } = useENSName(account);
  const userEthBalance = useETHBalances([account])[account];
  const [token, setToken] = useState(null);

  const store = useLocalStore(() => ({
    amount: "",
    address: "",
    showConfirmModal: false,
    approved: false,
    setApprove() {
      this.approved = true;
    },
    setAmount(newAmount) {
      this.amount = newAmount;
    },
    setAddress(newAddress) {
      this.address = newAddress;
    },
    toggleConfirmModalVisible() {
      this.showConfirmModal = !this.showConfirmModal;
    },
    isValidAmount() {
      return this.amount && Number(this.amount) > 0;
    },
  }));

  const tryActivation = async (connector) => {
    let name = "";
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }

    activate(connector, undefined, true)
      .then(() => {
        wallet.setMetaMaskConnected();
      })
      .catch((error) => {
        if (error instanceof UnsupportedChainIdError || (error.code = 32002)) {
          activate(connector);
        } else {
          // setPendingError(true)
        }
      });
  };

  const onConvert = () => {
    if (!validateInputs()) {
      return;
    }
    store.toggleConfirmModalVisible();
  };

  const onApprove = async () => {
    if (!validateInputs()) {
      return;
    }
    const amount = tryParseAmount(store.amount, token).toString();
    if (!amount) {
      message.error(`Could not parse amount for token ${token.name}`);
      return;
    }
    try {
      const tokenAddress = token ? token.address : "";
      if (!tokenAddress) {
        message.error("could not get token address");
        return;
      }
      const tokenContract: Contract | null = getContract(
        tokenAddress,
        ERC20_ABI,
        library,
        account
      );
      if (!tokenContract) {
        window.console.error("tokenContract is null");
        message.error("could not get token contract");
        return;
      }
      let useExact = false;
      const estimatedGas = await tokenContract.estimateGas
        .approve(CASHIER_CONTRACT_ADDRESS, MaxUint256)
        .catch(() => {
          useExact = true;
          return tokenContract.estimateGas.approve(
            CASHIER_CONTRACT_ADDRESS,
            amount
          );
        });
      tokenContract
        .approve(CASHIER_CONTRACT_ADDRESS, useExact ? amount : MaxUint256, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: TransactionResponse) => {
          store.setApprove();
          message.success("Approved");
          window.console.log(`Approve success`);
        })
        .catch((error: Error) => {
          message.error(`Failed to approve token. ${error.message}`);
          window.console.log("Failed to approve token", error);
        });
    } catch (e) {
      message.error(`Failed to approve token.`);
      window.console.log(`tokenContract.approve error `, e);
    }
  };

  function getReceiptAddress(): string {
    return validateAddress(store.address)
      ? fromString(store.address).stringEth()
      : isAddress(store.address)
      ? store.address
      : "";
  }

  function validateInputs(showMessage: boolean = true): boolean {
    if (!store.isValidAmount()) {
      if (showMessage) {
        message.error("invalid amount");
      }
      return false;
    }
    const toAddress = getReceiptAddress();
    if (!toAddress) {
      if (showMessage) {
        message.error(`invalid address ${store.address}`);
      }
      return false;
    }
    const tokenAddress = token ? token.address : "";
    if (!tokenAddress) {
      if (showMessage) message.error("could not get token address");
      return false;
    }
    return true;
  }

  const onConfirm = async () => {
    if (!validateInputs()) {
      return;
    }
    const amount = tryParseAmount(store.amount, token).toString();
    if (!amount) {
      message.error(`Could not parse amount for token ${token.name}`);
      return;
    }
    const contract: Contract | null = getContract(
      CASHIER_CONTRACT_ADDRESS,
      ERC20_XRC20_ABI,
      library,
      account
    );
    if (!contract) {
      message.error("could not get cashier contract");
      return;
    }
    const tokenAddress = token ? token.address : "";
    if (!tokenAddress) {
      message.error("could not get token address");
      return;
    }
    const toAddress = getReceiptAddress();
    const args = [tokenAddress, toAddress, amount];
    const methodName = "depositTo";
    const options = { from: account, gasLimit: 1000000 };
    const depositTo = () => {
      contract[methodName](...args, options)
        .then((response: any) => {
          window.console.log(
            `${methodName} success hash`,
            response.hash,
            response
          );
          setHash(response.hash);
          store.toggleConfirmModalVisible();
          message.success(" Ethereum transaction broadcasted successfully.");
          return response.hash;
        })
        .catch((error: any) => {
          let content = "";
          if (error?.code === TRANSACTION_REJECTED) {
            content = "Ethereum Transaction rejected.";
            window.console.log(content);
          } else {
            content = `${methodName} failed. please check log for detail`;
            window.console.error(
              `${methodName} failed`,
              error,
              methodName,
              args,
              options
            );
          }
          message.error(content);
        });
    };
    contract.estimateGas[methodName](...args, {})
      .then((gasEstimate) => {
        window.console.log("Gas estimation succeeded.", gasEstimate);
        depositTo();
        return {
          gasEstimate,
        };
      })
      .catch((gasError) => {
        window.console.log(
          "Gas estimation failed. Trying eth_call to extract error.",
          gasError
        );
        return contract.callStatic[methodName](...args, options)
          .then((result) => {
            window.console.log(
              "Be possible unexpected successful call after failed estimate gas. Let's try",
              gasError,
              result
            );
            depositTo();
          })
          .catch((callError) => {
            window.console.log("Call threw error", callError);
            let errorMessage: string;
            if (
              callError.reason.indexOf("INSUFFICIENT_OUTPUT_AMOUNT") >= 0 ||
              callError.reason.indexOf("EXCESSIVE_INPUT_AMOUNT") >= 0
            ) {
              errorMessage =
                "This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.";
            } else {
              errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens.`;
            }
            message.error(errorMessage);
          });
      });
  };

  const isEnabled = validateInputs(false);
  const [hash, setHash] = useState("");

  return useObserver(() => (
    <div className="page__home__component__erc_xrc p-8 pt-6">
      <div className="my-6">
        <TokenSelectField onChange={setToken} />
      </div>
      <AmountField
        amount={store.amount}
        label={lang.t("amount")}
        onChange={store.setAmount}
      />
      {store.amount && (
        <div className="my-6 text-left">
          {token && (
            <div className="text-base c-gray-20 font-thin">
              You will receive {wrappedIOTXInfo.name} tokens at
            </div>
          )}
          <AddressInput
            address={store.address}
            onChange={store.setAddress}
            label="IOTX Address"
          />
        </div>
      )}
      <div className="my-6 text-left c-gray-30">
        {account && (
          <>
            <div className="font-light text-sm flex items-center justify-between">
              <span>{ENSName || (account && shortenAddress(account))}</span>
              {userEthBalance && (
                <span>{userEthBalance?.toSignificant(4)} ETH</span>
              )}
            </div>
          </>
        )}

        <div className="font-normal text-base mb-3">{lang.t("fee")}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("fee.tube")}</span>
          <span>0 ({lang.t("free")})</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("relay_to_iotex")}</span>
          <span>0 ({lang.t("free")})</span>
        </div>
        {hash && (
          <div className="font-light text-sm flex items-center justify-between">
            <a
              href={getEtherscanLink(chainId, hash, "transaction")}
              target={"_blank"}
            >
              {`view on Etherscan ${hash}`}
            </a>
          </div>
        )}
      </div>
      <div>
        {!account && (
          <SubmitButton
            title={lang.t("connect_metamask")}
            icon={<img src={IMG_MATAMASK} className="h-6 mr-4" />}
            onClick={() => {
              tryActivation(injected).then();
            }}
          />
        )}
        {account && (
          <div className="page__home__component__erc_xrc__button_group flex items-center">
            <SubmitButton
              title={lang.t("approve")}
              onClick={onApprove}
              disabled={store.approved || !isEnabled}
            />
            <SubmitButton
              title={lang.t("convert")}
              onClick={onConvert}
              disabled={!store.approved || !isEnabled}
            />
          </div>
        )}
      </div>
      <ConfirmModal
        visible={store.showConfirmModal}
        onConfirm={onConfirm}
        tubeFee={0}
        networkFee={0}
        depositAmount={10}
        depositToken={token}
        mintAmount={1}
        mintToken={wrappedIOTXInfo}
        mintTokenName={"IOTX"}
        close={store.toggleConfirmModalVisible}
        middleComment="to ioTube and mint"
        isERCXRC
      />
    </div>
  ));
};
