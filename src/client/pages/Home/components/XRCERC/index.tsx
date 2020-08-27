import React, { useEffect, useMemo, useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../../../common/store";
import {
  AddressInput,
  AmountField,
  ConfirmModal,
  SubmitButton,
  TokenSelectField,
} from "../../../../components";
import {
  DEFAULT_IOTEX_CHAIN_ID,
  IOTEX_CASHIER_CONTRACT_ADDRESS,
  IOTEX,
} from "../../../../constants/index";
import { fromString } from "iotex-antenna/lib/crypto/address";
import { BigNumber } from "@ethersproject/bignumber";
import {
  getAmountNumber,
  getIOTXContract,
  isAddress,
  isValidAmount,
} from "../../../../utils/index";
import ERC20_ABI from "../../../../constants/abis/erc20.json";
import message from "antd/lib/message";
import {
  fromRau,
  toRau,
  validateAddress,
} from "iotex-antenna/lib/account/utils";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { tryParseAmount } from "../../../../hooks/Tokens";
import { TransactionResponse } from "@ethersproject/providers";
import ERC20_XRC20_ABI from "../../../../constants/abis/erc20_xrc20.json";

const IMG_IOPAY = require("../../../../static/images/icon-iotex-black.png");

export const XRCERC = () => {
  const { lang, wallet, base } = useStore();
  const [tokenInfoPair, setTokenInfoPair] = useState(null);
  const [allowance, setAllowance] = useState(BigNumber.from(-1));
  const [amount, setAmount] = useState("");
  const [beApproved, setBeApproved] = useState(false);
  const [beConverted, setBeConverted] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(BigNumber.from(0));
  const [depositFee, setDepositFee] = useState(BigNumber.from(0));
  const account = wallet.walletAddress;
  const token = useMemo(() => (tokenInfoPair ? tokenInfoPair.ETHEREUM : null), [
    tokenInfoPair,
  ]);
  const xrc20TokenInfo = useMemo(
    () => (tokenInfoPair ? tokenInfoPair.IOTEX : null),
    [tokenInfoPair]
  );
  const cashierContractAddress =
    IOTEX_CASHIER_CONTRACT_ADDRESS[DEFAULT_IOTEX_CHAIN_ID];
  const tokenAddress = useMemo(
    () => (xrc20TokenInfo ? xrc20TokenInfo.address : ""),
    [xrc20TokenInfo]
  );

  const tokenContract = useMemo(() => {
    if (validateAddress(tokenAddress)) {
      return getIOTXContract(tokenAddress, ERC20_ABI);
    }
    return null;
  }, [tokenAddress, account]);

  const cashierContract = useMemo(() => {
    return cashierContractAddress
      ? getIOTXContract(cashierContractAddress, ERC20_XRC20_ABI)
      : null;
  }, [cashierContractAddress]);

  useMemo(() => {
    if (account && cashierContract) {
      try {
        cashierContract.methods
          .depositFee({
            from: account,
          })
          .then((value) => {
            setDepositFee(BigNumber.from(value.toString()));
            return value;
          })
          .catch((error: Error) => {
            window.console.log(`Failed to get depositFee!`, error);
          });
      } catch (e) {
        window.console.log(`Failed to get depositFee `, e);
      }
    }
  }, [cashierContract, account]);

  useEffect(() => {
    if (validateAddress(account) && tokenContract) {
      try {
        tokenContract.methods
          .balanceOf(account, account)
          .then((value) => {
            setTokenBalance(BigNumber.from(value.toString()));
            return value;
          })
          .catch((error: Error) => {
            message.error(`Failed to get balanceOf! ${error.message}`);
            window.console.log(`Failed to get balanceOf!`, error);
          });
      } catch (e) {
        message.error(`Failed to get balanceOf!`);
        window.console.log(`Failed to get balanceOf!`, e);
      }
    }
  }, [account, tokenContract]);

  const isEnabled = validateInputs(false);
  const needToApprove = useMemo(() => {
    if (amount && allowance.gt(BigNumber.from(0)) && xrc20TokenInfo) {
      try {
        const amountBN = parseUnits(amount, xrc20TokenInfo.decimals);
        if (allowance.gte(amountBN)) {
          return false;
        }
      } catch (error) {}
    }
    return isEnabled;
  }, [allowance, amount, xrc20TokenInfo]);

  const disableConvert = useMemo(() => {
    if (beConverted) return true;
    if (
      !amount ||
      BigNumber.from(0).gte(allowance) ||
      (xrc20TokenInfo &&
        parseUnits(amount, xrc20TokenInfo.decimals).gt(allowance))
    ) {
      return true;
    }
    return !isEnabled;
  }, [allowance, amount, xrc20TokenInfo, isEnabled, beConverted]);

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
      if (
        tokenBalance &&
        amountNumber >
          Number(formatUnits(tokenBalance, xrc20TokenInfo.decimals))
      ) {
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

  useEffect(() => {
    if (isAddress(account) && cashierContractAddress && tokenContract) {
      try {
        tokenContract.methods
          .allowance(account, cashierContractAddress, { from: account })
          .then((value: BigNumber) => {
            setAllowance(BigNumber.from(value.toString()));
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
  }, [account, tokenContract, beApproved, beConverted]);

  const store = useLocalStore(() => ({
    showConfirmModal: false,
    approved: false,
    setApprove() {
      this.approved = true;
    },
    toggleConfirmModalVisible() {
      this.showConfirmModal = !this.showConfirmModal;
    },
  }));
  const onConvert = () => {
    store.toggleConfirmModalVisible();
  };
  const onApprove = async () => {
    if (!validateInputs()) {
      return;
    }
    const rawAmount = tryParseAmount(amount, xrc20TokenInfo).toString();
    if (!rawAmount) {
      message.error(`Could not parse amount for token ${xrc20TokenInfo.name}`);
      return;
    }
    if (!cashierContractAddress) {
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
      tokenContract.methods
        .approve(cashierContractAddress, rawAmount, {
          from: account,
          gasLimit: 1000000,
          gasPrice: toRau("1", "Qev"),
        })
        .then((response: TransactionResponse) => {
          message.success("Approved");
          window.console.log(`Approve success`);
          setBeApproved(true);
        })
        .catch((error: Error) => {
          message.error(`Failed to approve xrc20TokenInfo. ${error.message}`);
          window.console.log("Failed to approve token", error);
        });
    } catch (e) {
      message.error(`Failed to approve xrc20TokenInfo.`);
      window.console.log(`tokenContract.approve error `, e);
    }
  };

  const onConfirm = async () => {
    if (!validateInputs()) {
      return;
    }

    const rawAmount = tryParseAmount(amount, xrc20TokenInfo).toString();
    if (!rawAmount) {
      message.error(`Could not parse amount for token ${xrc20TokenInfo.name}`);
      return;
    }

    const tokenAddress = xrc20TokenInfo ? xrc20TokenInfo.address : "";
    if (!tokenAddress) {
      message.error("could not get token address");
      return;
    }
    const args = [tokenAddress, rawAmount];
    const methodName = "deposit";
    const options = {
      from: account,
      amount: depositFee.toString(),
      gasLimit: 1000000,
      gasPrice: toRau("1", "Qev"),
    };
    const depositTo = () => {
      cashierContract.methods
        .deposit(...args, options)
        .then((response: any) => {
          window.console.log(`${methodName} action hash`, response);
          store.toggleConfirmModalVisible();
          message.success(" IoTeX action broadcasted successfully.");
          setBeConverted(true);
          base.toggleComplete(
            response.actionHash,
            `${response.network.url}action/${response.actionHash}`,
            fromString(account).stringEth()
          );
          return response.hash;
        })
        .catch((error: any) => {
          const content = `${methodName} failed. please check log for detail`;
          window.console.error(
            `${methodName} failed`,
            error,
            methodName,
            args,
            options
          );
          message.error(content);
        });
    };
    depositTo();
  };

  return useObserver(() => (
    <div className="page__home__component__xrc_erc p-8 pt-6">
      <div className="my-6">
        <TokenSelectField network={IOTEX} onChange={setTokenInfoPair} />
      </div>
      <AmountField
        amount={amount}
        label={lang.t("amount")}
        onChange={setAmount}
        customAddon={
          xrc20TokenInfo && (
            <span
              onClick={() => {
                if (tokenBalance) {
                  setAmount(formatUnits(tokenBalance, xrc20TokenInfo.decimals));
                }
              }}
              className="page__home__component__erc_xrc__max c-green-20 border-green-20 px-1 mx-2 leading-5 font-light text-sm cursor-pointer"
            >
              MAX
            </span>
          )
        }
      />
      {xrc20TokenInfo && (
        <div className="font-light text-sm text-right c-gray-30 mt-2">
          {tokenBalance && (
            <span>
              {formatUnits(tokenBalance, xrc20TokenInfo.decimals)}{" "}
              {xrc20TokenInfo.symbol}
            </span>
          )}
        </div>
      )}
      {amount && account && token && (
        <div className="my-6 text-left">
          <div className="text-base c-gray-20">
            You will receive {token.name} tokens at
          </div>
          <AddressInput
            address={fromString(account).stringEth()}
            label="Ether Address"
            readOnly
          />
        </div>
      )}
      <div className="my-6 text-left c-gray-30">
        <div className="font-normal text-base mb-3">{lang.t("fee")}</div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("fee.tube")}</span>
          <span>{`${fromRau(depositFee.toString(), "iotx")} IOTX`}</span>
        </div>
        <div className="font-light text-sm flex items-center justify-between">
          <span>{lang.t("relay_to_ethereum")}</span>
          <span>0 ({lang.t("free")})</span>
        </div>
      </div>
      <div>
        {!wallet.walletConnected && (
          <SubmitButton
            title={lang.t("connect_io_pay")}
            icon={<img src={IMG_IOPAY} className="h-6 mr-4" />}
            onClick={wallet.init}
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
        tubeFee={`${fromRau(depositFee.toString(), "iotx")} IOTX`}
        networkFee={0}
        depositAmount={getAmountNumber(amount)}
        depositToken={xrc20TokenInfo}
        mintAmount={getAmountNumber(amount)}
        mintToken={token}
        close={store.toggleConfirmModalVisible}
        middleComment="to ioTube and withdraw"
        isERCXRC={false}
      />
    </div>
  ));
};
