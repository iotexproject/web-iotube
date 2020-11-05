import React, { useEffect, useMemo, useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../../../common/store";
import { AddressInput, AmountField, ConfirmModal, SubmitButton, TokenSelectField } from "../../../../components";
import { DEFAULT_IOTEX_CHAIN_ID, IOTEX, IOTEX_CASHIER_CONTRACT_ADDRESS, IOTEX_TOKEN_LIST_CONTRACT_ADDRESS, IOTEXSCAN_URL } from "../../../../constants/index";
import { fromString } from "iotex-antenna/lib/crypto/address";
import { BigNumber } from "@ethersproject/bignumber";
import { getAmountNumber, getIOTXContract, isAddress, isValidAmount } from "../../../../utils/index";
import ERC20_ABI from "../../../../constants/abis/erc20.json";
import message from "antd/lib/message";
import { toRau, validateAddress } from "iotex-antenna/lib/account/utils";
import { formatUnits } from "@ethersproject/units";
import { amountInAllowance, AmountState, DEFAULT_TOKEN_DECIMAL, getFeeIOTX, tryParseAmount } from "../../../../hooks/Tokens";
import { TransactionResponse } from "@ethersproject/providers";
import ERC20_XRC20_ABI from "../../../../constants/abis/erc20_xrc20.json";
import TOKEN_LIST_ABI from "../../../../constants/abis/token_list.json";
import Form from "antd/lib/form";
import { WarnModal } from "../../../../components/WarnModal";
import { CARD_XRC20_ERC20 } from "../../../../../common/store/base";

const IMG_IOPAY = require("../../../../static/images/icon-iotex-black.png");

export const XRCERC = () => {
  const { lang, wallet, base } = useStore();
  const [tokenInfoPair, setTokenInfoPair] = useState(null);
  const [allowance, setAllowance] = useState(BigNumber.from(-1));
  const [amount, setAmount] = useState("");
  const [beConverted, setBeConverted] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(BigNumber.from(0));
  const [depositFee, setDepositFee] = useState(BigNumber.from(0));
  const [fillState, setFillSate] = useState("");
  const [amountRange, setAmountRange] = useState({
    minAmount: BigNumber.from("0"),
    maxAmount: BigNumber.from("0"),
  });
  const account = wallet.walletAddress;
  const token = useMemo(() => (tokenInfoPair ? tokenInfoPair.ETHEREUM : null), [tokenInfoPair]);
  const xrc20TokenInfo = useMemo(() => (tokenInfoPair ? tokenInfoPair.IOTEX : null), [tokenInfoPair]);
  const cashierContractAddress = IOTEX_CASHIER_CONTRACT_ADDRESS[DEFAULT_IOTEX_CHAIN_ID];
  const tokenAddress = useMemo(() => (xrc20TokenInfo ? xrc20TokenInfo.address : ""), [xrc20TokenInfo]);

  const tokenContract = useMemo(() => {
    if (validateAddress(tokenAddress)) {
      return getIOTXContract(tokenAddress, ERC20_ABI);
    }
    return null;
  }, [tokenAddress, account]);

  const cashierContract = useMemo(() => {
    return cashierContractAddress ? getIOTXContract(cashierContractAddress, ERC20_XRC20_ABI) : null;
  }, [cashierContractAddress]);

  useMemo(() => {
    if (cashierContract) {
      try {
        cashierContract.methods
          .depositFee({
            from: cashierContract,
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
  }, [cashierContract]);

  const tokenListContractAddress = IOTEX_TOKEN_LIST_CONTRACT_ADDRESS[DEFAULT_IOTEX_CHAIN_ID];

  const tokenListContract = useMemo(() => {
    return tokenListContractAddress ? getIOTXContract(tokenListContractAddress, TOKEN_LIST_ABI) : null;
  }, [tokenListContractAddress]);

  useEffect(() => {
    const fetchAmountRange = async () => {
      if (tokenAddress && tokenListContract) {
        try {
          const [minAmount, maxAmount] = await Promise.all([
            tokenListContract.methods.minAmount(tokenAddress, {
              from: tokenListContractAddress,
            }),
            tokenListContract.methods.maxAmount(tokenAddress, {
              from: tokenListContractAddress,
            }),
          ]);
          setAmountRange({
            minAmount: BigNumber.from(minAmount.toString()),
            maxAmount: BigNumber.from(maxAmount.toString()),
          });
        } catch (e) {
          window.console.log(`Failed to get amount range `, e);
        }
      }
    };
    fetchAmountRange();
  }, [tokenAddress, tokenListContract]);

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
    wallet.init();
  }, [account, tokenContract]);

  const inputError = useMemo(() => {
    if (!account) {
      return lang.t("input.wallet.not_connected");
    }
    if (!tokenAddress) {
      return lang.t("input.token.unselected");
    }

    if (!cashierContractAddress) {
      return lang.t("input.cashier.invalid");
    }

    if (!tokenContract) {
      return lang.t("input.token.invalid");
    }

    if (isNaN(Number(amount))) {
      return lang.t("input.amount.invalid");
    }
    const amountNumber = getAmountNumber(amount);
    if (amountNumber == 0) {
      return lang.t("input.amount.enter_value");
    }
    if (amountNumber < Number(formatUnits(amountRange.minAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))) {
      return `Amount must >= ${Number(formatUnits(amountRange.minAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))}`;
    }
    if (amountNumber > Number(formatUnits(amountRange.maxAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))) {
      return `Amount must <= ${Number(formatUnits(amountRange.maxAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))}`;
    }
    try {
      if (tokenBalance && amountNumber > Number(formatUnits(tokenBalance, xrc20TokenInfo.decimals))) {
        return lang.t("input.balance.insufficient", { symbol: xrc20TokenInfo.symbol });
      }
    } catch (e) {
      return lang.t("input.balance.invalid", { symbol: xrc20TokenInfo.symbol });
    }
    if (depositFee.gt(BigNumber.from(0))) {
      try {
        if (Number(depositFee.toString()) > wallet.walletBalance) {
          return lang.t("input.balance.insufficient", { symbol: "IOTX" });
        }
      } catch (error) {
        console.debug(`could not get deposit fee in iotx`, error);
        return lang.t("input.depositfee.error");
      }
    }
    return "";
  }, [amount, depositFee, tokenBalance, account, tokenAddress, cashierContractAddress]);

  const possibleApprove = useMemo(() => {
    if (Boolean(inputError)) return false;
    return amountInAllowance(allowance, amount, xrc20TokenInfo) == AmountState.UNAPPROVED;
  }, [allowance, amount, xrc20TokenInfo]);

  const possibleConvert = useMemo(() => {
    if (possibleApprove || Boolean(inputError)) return false;
    return amountInAllowance(allowance, amount, xrc20TokenInfo) == AmountState.APPROVED;
  }, [possibleApprove, allowance, amount, xrc20TokenInfo]);

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
  }, [account, tokenContract, beConverted]);

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
    if (Boolean(inputError)) {
      return;
    }

    const rawAmount = tryParseAmount(amount, xrc20TokenInfo).toString();
    if (!rawAmount) {
      message.error(`Could not parse amount for token ${xrc20TokenInfo.name}`);
      return false;
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
          setAllowance(BigNumber.from(rawAmount));
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
    if (Boolean(inputError)) {
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
          const link = `${(response.network && response.network.url) || IOTEXSCAN_URL[DEFAULT_IOTEX_CHAIN_ID]}action/${response.actionHash}`;
          base.toggleComplete(response.actionHash, link, fromString(account).stringEth(), token.name);
          return response.hash;
        })
        .catch((error: any) => {
          const content = `${methodName} failed. please check log for detail`;
          window.console.error(`${methodName} failed`, error, methodName, args, options);
          message.error(content);
        });
    };
    depositTo();
  };

  return useObserver(() => (
    <div className="page__home__component__xrc_erc p-8 pt-6">
      <Form>
        <div className="my-6">
          <TokenSelectField
            network={IOTEX}
            onChange={(tokenPair) => {
              setTokenInfoPair(tokenPair);
              setFillSate("TOKEN");
            }}
          />
        </div>
        <AmountField
          amount={amount}
          label={lang.t("amount")}
          min={Number(formatUnits(amountRange.minAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))}
          max={Number(formatUnits(amountRange.maxAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))}
          onChange={(value) => {
            setAmount(value);
            setFillSate("AMOUNT");
          }}
          customAddon={
            xrc20TokenInfo && (
              <span
                onClick={() => {
                  if (tokenBalance) {
                    setAmount(formatUnits(tokenBalance, xrc20TokenInfo.decimals));
                  }
                }}
                className="page__home__component__xrc_erc__max c-green-20 border-green-20 px-1 mx-2 leading-5 font-light text-sm cursor-pointer"
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
                {formatUnits(tokenBalance, xrc20TokenInfo.decimals)} {xrc20TokenInfo.symbol}
              </span>
            )}
          </div>
        )}
        {amount && account && token && (
          <div className="my-6 text-left">
            <div className="text-base c-gray-20">You will receive {token.name} tokens at</div>
            <AddressInput address={fromString(account).stringEth()} label="Ether Address" readOnly />
          </div>
        )}
        <div className="my-6 text-left c-gray-30">
          <div className="font-normal text-base mb-3">{lang.t("fee")}</div>
          <div className="font-light text-sm flex items-center justify-between">
            <span>{lang.t("fee.tube")}</span>
            <span>0 ({lang.t("free")})</span>
          </div>
          <div className="font-light text-sm flex items-center justify-between">
            <span>{lang.t("relay_to_ethereum")}</span>
            <span>{getFeeIOTX(depositFee)}</span>
          </div>
        </div>
        <div>
          {!wallet.walletConnected && <SubmitButton title={lang.t("connect_io_pay")} icon={<img src={IMG_IOPAY} className="h-6 mr-4" />} onClick={wallet.init} />}
          {wallet.walletConnected && (
            <div className="page__home__component__xrc_erc__button_group flex items-center">
              {possibleApprove && !Boolean(inputError) && <SubmitButton title={fillState ? inputError || lang.t("approve") : lang.t("approve")} onClick={onApprove} />}
              <SubmitButton title={fillState ? inputError || lang.t("convert") : lang.t("convert")} onClick={onConvert} disabled={!possibleConvert} />
            </div>
          )}
        </div>
        <ConfirmModal
          visible={store.showConfirmModal}
          onConfirm={onConfirm}
          networkFee={getFeeIOTX(depositFee)}
          depositAmount={getAmountNumber(amount)}
          depositToken={xrc20TokenInfo}
          mintAmount={getAmountNumber(amount)}
          mintToken={token}
          close={store.toggleConfirmModalVisible}
          middleComment="to ioTube and withdraw"
          isERCXRC={false}
        />
        <WarnModal visible={base.mode === CARD_XRC20_ERC20 && wallet.showXRCWarnModal} isERCXRC={false} close={wallet.toggleXRCCWarnModal} />
      </Form>
    </div>
  ));
};
