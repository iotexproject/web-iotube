import React, { useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../../../common/store";
import { IOTX, SUPPORTED_WALLETS } from "../../../../constants/index";
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

const IMG_MATAMASK = require("../../../../static/images/metamask.png");

const cashierContractAddress = IOTX.address;
const tokenAddress = "0xad6d458402f60fd3bd25163575031acdce07538d";

export const ERCXRC = () => {
  const { lang, wallet } = useStore();
  const { account, activate, chainId, library } = useWeb3React<Web3Provider>();
  const { ENSName } = useENSName(account);
  const userEthBalance = useETHBalances([account])[account];

  const store = useLocalStore(() => ({
    amount: "",
    token: "",
    address: "",
    showConfirmModal: false,
    approved: false,
    setApprove() {
      this.approved = true;
    },
    setAmount(newAmount) {
      this.amount = newAmount;
    },
    setToken(newToken) {
      this.token = newToken;
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
    const amount = toRau(store.amount, "iotx");
    try {
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
        .approve(cashierContractAddress, MaxUint256)
        .catch(() => {
          useExact = true;
          return tokenContract.estimateGas.approve(
            cashierContractAddress,
            amount
          );
        });
      tokenContract
        .approve(cashierContractAddress, useExact ? amount : MaxUint256, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: TransactionResponse) => {
          store.setApprove();
          message.success("Approved");
          window.console.log(`tokenContract.approve success`);
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

  function correctAddress(): string {
    return validateAddress(store.address)
      ? fromString(store.address).stringEth()
      : isAddress(store.address)
      ? store.address
      : "";
  }

  function correctAmount(): string {
    //TODO use token decimal
    return store.isValidAmount() ? toRau(store.amount, "iotx") : "";
  }

  function validateInputs(): boolean {
    const amount = correctAmount();
    if (!amount) {
      message.error("invalid amount");
      return false;
    }
    const toAddress = correctAddress();
    if (!toAddress) {
      message.error(`invalid address ${store.address}`);
      return false;
    }
    return true;
  }

  const onConfirm = async () => {
    if (!validateInputs()) {
      return;
    }
    const amount = toRau(store.amount, "iotx");
    const toAddress = correctAddress();
    const contract: Contract | null = getContract(
      cashierContractAddress,
      ERC20_XRC20_ABI,
      library,
      account
    );
    if (!contract) {
      message.error("could not get cashier contract");
      return;
    }
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
          message.success("Transaction broadcast successfully");
          return response.hash;
        })
        .catch((error: any) => {
          let content = "";
          if (error?.code === 4001) {
            content = "Transaction rejected.";
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
        window.console.log("Gas estimate success", gasEstimate);
        depositTo();
        return {
          gasEstimate,
        };
      })
      .catch((gasError) => {
        window.console.log(
          "Gas estimate failed, trying eth_call to extract error",
          gasError
        );
        return contract.callStatic[methodName](...args, options)
          .then((result) => {
            window.console.log(
              "Unexpected successful call after failed estimate gas",
              gasError,
              result
            );
            depositTo();
          })
          .catch((callError) => {
            window.console.log("Call threw error", callError);
            let errorMessage: string;
            switch (callError.reason) {
              case "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT":
              case "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT":
                errorMessage =
                  "This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.";
                break;
              default:
                errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens.`;
            }
            message.error(errorMessage);
          });
      });
  };

  const isEnabled =
    store.amount !== "" && store.address !== "" && store.token !== "";
  const [hash, setHash] = useState("");

  return useObserver(() => (
    <div className="page__home__component__erc_xrc p-8 pt-6">
      <div className="my-6">
        <TokenSelectField token={store.token} onChange={store.setToken} />
      </div>
      <AmountField
        amount={store.amount}
        label={lang.t("amount")}
        onChange={store.setAmount}
      />
      {store.amount && (
        <div className="my-6 text-left">
          <div className="text-base c-gray-20 font-thin">
            You will receive {store.token} tokens at
          </div>
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
              disabled={store.approved}
            />
            <SubmitButton
              title={lang.t("convert")}
              onClick={onConvert}
              disabled={!store.approved}
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
        depositToken={store.token}
        mintAmount={10}
        mintToken={store.token}
        mintTokenName={"IOTX"}
        close={store.toggleConfirmModalVisible}
        middleComment="to ioTube and mint"
        isERCXRC
      />
    </div>
  ));
};
