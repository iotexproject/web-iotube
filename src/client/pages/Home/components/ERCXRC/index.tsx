import React, { useEffect, useMemo, useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../../../common/store";
import {
  CHAIN_CASHIER_CONTRACT_ADDRESS,
  IOTX_TOKEN_INFO,
  SUPPORTED_WALLETS,
  TRANSACTION_REJECTED,
} from "../../../../constants/index";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected } from "../../../../connectors/index";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";
import {
  calculateGasMargin,
  getAmountNumber,
  getContract,
  getEtherscanLink,
  isAddress,
  isValidAmount,
} from "../../../../utils/index";
import { useTokenBalances } from "../../../../state/wallet/hooks";
import "./index.scss";
import {
  AddressInput,
  AmountField,
  SubmitButton,
  TokenSelectField,
} from "../../../../components";
import { ConfirmModal } from "../../../../components/ConfirmModal/index";
import ERC20_XRC20_ABI from "../../../../constants/abis/erc20_xrc20.json";
import { Contract } from "@ethersproject/contracts";
import { validateAddress } from "iotex-antenna/lib/account/utils";
import ERC20_ABI from "../../../../constants/abis/erc20.json";
import { fromBytes, fromString } from "iotex-antenna/lib/crypto/address";
import message from "antd/lib/message";
import { tryParseAmount } from "../../../../hooks/Tokens";
import { parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

const IMG_MATAMASK = require("../../../../static/images/metamask.png");

export const ERCXRC = () => {
  const { lang, wallet } = useStore();
  const { account, activate, chainId, library } = useWeb3React<Web3Provider>();
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState("");
  const [beApproved, setBeApproved] = useState(false);
  const [beConverted, setBeConverted] = useState(false);
  const [hash, setHash] = useState("");
  const [allowance, setAllowance] = useState(BigNumber.from(-1));
  const wrappedIOTXInfo = IOTX_TOKEN_INFO[chainId];
  const cashierContractAddress = useMemo(
    () => CHAIN_CASHIER_CONTRACT_ADDRESS[chainId],
    [chainId]
  );
  const tokenBalance = useTokenBalances(token ? token.address : undefined, [
    account,
  ])[account];

  const store = useLocalStore(() => ({
    showConfirmModal: false,
    toggleConfirmModalVisible() {
      this.showConfirmModal = !this.showConfirmModal;
    },
  }));

  const cashierContractValidate = useMemo(() => {
    if (!cashierContractAddress || !isAddress(cashierContractAddress)) {
      if (chainId) {
        let content = `please set correctly CASHIER_CONTRACT_ADDRESS_${chainId} in env for chain id ${chainId}`;
        message.error(content);
        window.console.log(content);
      }
      return false;
    }
    return true;
  }, [cashierContractAddress]);

  const tokenAddress = useMemo(() => (token ? token.address : ""), [token]);

  const tokenContract = useMemo(() => {
    if (isAddress(tokenAddress)) {
      return getContract(tokenAddress, ERC20_ABI, library, account);
    }
    return null;
  }, [tokenAddress, library, account]);

  useEffect(() => {
    if (isAddress(account) && cashierContractValidate && tokenContract) {
      try {
        tokenContract
          .allowance(account, cashierContractAddress)
          .then((value: BigNumber) => {
            setAllowance(value);
            return value;
          })
          .catch((error: Error) => {
            message.error(`Failed to get allowance! ${error.message}`);
            window.console.log(`Failed to get allowance!`, error);
          });
      } catch (e) {
        message.error(`Failed to get allowance!`);
        window.console.log(`Failed to get allowance!`, e);
      }
    }
  }, [
    account,
    cashierContractValidate,
    tokenContract,
    beApproved,
    beConverted,
  ]);

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
    const rawAmount = tryParseAmount(amount, token).toString();
    if (!rawAmount) {
      message.error(`Could not parse amount for token ${token.name}`);
      return;
    }
    if (!cashierContractValidate) {
      message.error("invalidate cashier contract address!");
      return;
    }
    if (!tokenAddress) {
      message.error("could not get token address");
      return;
    }
    if (!tokenContract) {
      window.console.error("tokenContract is null");
      message.error("could not get token contract");
      return;
    }
    try {
      const estimatedGas = await tokenContract.estimateGas
        .approve(cashierContractAddress, rawAmount)
        .catch(() => {
          return tokenContract.estimateGas.approve(
            cashierContractAddress,
            rawAmount
          );
        });
      tokenContract
        .approve(cashierContractAddress, rawAmount, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: TransactionResponse) => {
          message.success("Approved");
          window.console.log(`Approve success`);
          setBeApproved(true);
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
    return account
      ? fromBytes(
          Buffer.from(String(account).replace(/^0x/, ""), "hex")
        ).string()
      : "";
  }

  function validateInputs(showMessage: boolean = true): boolean {
    if (!isValidAmount(amount)) {
      if (showMessage) {
        message.error("invalid amount");
      }
      return false;
    }
    const amountNumber = getAmountNumber(amount);
    //TODO: check minimal amount from contract data.
    if (amountNumber < 1) {
      if (showMessage) {
        message.error("amount must >= 1");
      }
      return false;
    }
    try {
      if (tokenBalance && amountNumber > Number(tokenBalance.toFixed(10))) {
        if (showMessage) {
          message.error("insufficient balance");
        }
        return false;
      }
    } catch (e) {
      if (showMessage) {
        message.error("invalid amount");
      }
      return false;
    }
    if (!account) {
      if (showMessage) {
        message.error(`wallet is not connected`);
      }
      return false;
    }
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

    const rawAmount = tryParseAmount(amount, token).toString();
    if (!rawAmount) {
      message.error(`Could not parse amount for token ${token.name}`);
      return;
    }

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
    const tokenAddress = token ? token.address : "";
    if (!tokenAddress) {
      message.error("could not get token address");
      return;
    }
    const toAddress = account;
    const args = [tokenAddress, toAddress, rawAmount];
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
          setBeConverted(true);
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
  const disableConvert = useMemo(() => {
    if (beConverted) return true;
    if (
      !amount ||
      allowance <= BigNumber.from(0) ||
      (token && parseUnits(amount, token.decimals) > allowance)
    ) {
      return true;
    }
    return !isEnabled;
  }, [allowance, amount, token, isEnabled, beConverted]);

  const needToApprove = useMemo(() => {
    if (amount && allowance > BigNumber.from(0) && token) {
      try {
        const amountBN = parseUnits(amount, token.decimals);
        if (amountBN <= allowance) {
          return false;
        }
      } catch (error) {}
    }
    return isEnabled;
  }, [allowance, amount, token]);

  return useObserver(() => (
    <div className="page__home__component__erc_xrc p-8 pt-6">
      <div className="my-6">
        <TokenSelectField onChange={setToken} />
      </div>
      <AmountField
        amount={amount}
        label={lang.t("amount")}
        onChange={setAmount}
        customAddon={
          token && (
            <span
              onClick={() => {
                if (tokenBalance) {
                  setAmount(tokenBalance.toFixed(3));
                }
              }}
              className="page__home__component__erc_xrc__max c-green-20 border-green-20 px-1 mx-2 leading-5 font-light text-sm cursor-pointer"
            >
              MAX
            </span>
          )
        }
      />
      {token && (
        <div className="font-light text-sm text-right c-gray-30 mt-2">
          {tokenBalance && (
            <span>
              {tokenBalance?.toSignificant(4)} {token.symbol}
            </span>
          )}
        </div>
      )}
      {amount && account && (
        <div className="my-6 text-left">
          {token && (
            <div className="text-base c-gray-20 font-thin">
              {lang.t("you_will_recieve_amount_symbol_tokens_at", {
                amount,
                symbol: wrappedIOTXInfo.symbol,
              })}
            </div>
          )}
          <AddressInput
            readOnly
            address={getReceiptAddress()}
            label="IOTX Address"
          />
        </div>
      )}
      <div className="my-6 text-left c-gray-30">
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
            {needToApprove && (
              <SubmitButton
                title={lang.t("approve")}
                onClick={onApprove}
                disabled={!isEnabled || beApproved}
              />
            )}
            <SubmitButton
              title={lang.t("convert")}
              onClick={onConvert}
              disabled={!beApproved && disableConvert}
            />
          </div>
        )}
      </div>
      <ConfirmModal
        visible={store.showConfirmModal}
        onConfirm={onConfirm}
        tubeFee={0}
        networkFee={0}
        depositAmount={getAmountNumber(amount)}
        depositToken={token}
        mintAmount={1}
        mintToken={wrappedIOTXInfo}
        close={store.toggleConfirmModalVisible}
        middleComment="to ioTube and mint"
        isERCXRC
      />
    </div>
  ));
};
