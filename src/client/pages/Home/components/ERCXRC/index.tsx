import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../../../common/store";
import { ETHEREUM, SUPPORTED_WALLETS, TRANSACTION_REJECTED } from "../../../../constants/index";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected } from "../../../../connectors/index";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";
import { calculateGasMargin, getAmountNumber, getContract, getEtherscanLink, isAddress, isValidAmount } from "../../../../utils/index";
import { useETHBalances, useTokenBalances } from "../../../../state/wallet/hooks";
import "./index.scss";
import { AddressInput, AmountField, SubmitButton, TokenSelectField } from "../../../../components";
import { ConfirmModal } from "../../../../components/ConfirmModal/index";
import ERC20_XRC20_ABI from "../../../../constants/abis/erc20_xrc20.json";
import ERC20_ABI from "../../../../constants/abis/erc20.json";
import ETH_CASHIER_ABI from "../../../../constants/abis/eth_cashier.json";
import TOKEN_LIST_ABI from "../../../../constants/abis/token_list.json";
import E2N_ABI from "../../../../constants/abis/e2n_abi.json";
import { fromBytes, fromString } from "iotex-antenna/lib/crypto/address";
import message from "antd/lib/message";
import { amountInAllowance, AmountState, DEFAULT_TOKEN_DECIMAL, tryParseAmount } from "../../../../hooks/Tokens";
import { BigNumber } from "@ethersproject/bignumber";
import { ChainId } from "@uniswap/sdk";
import Form from "antd/lib/form";
import { formatUnits } from "@ethersproject/units";
import { WarnModal } from "../../../../components/WarnModal";
import { OpenModal } from "../../../../components/OpenModal";
import { CARD_ERC20_XRC20 } from "../../../../../common/store/base";
import { publicConfig } from "../../../../../../configs/public";
import { Contract as EthContract } from "@ethersproject/contracts";
import { isAddress as isEthAddress } from "@ethersproject/address";
import { validateAddress } from "iotex-antenna/lib/account/utils";
import qs from "qs";
import { utils } from "../../../../../common/utils/index";
import { chianMap, ChianMapType } from "../../../../constants/index";

const IMG_MATAMASK = require("../../../../static/images/metamask.png");

export const ERCXRC = () => {
  const { lang, wallet, base } = useStore();
  const { account, activate, chainId = publicConfig.IS_PROD ? ChainId.MAINNET : ChainId.KOVAN, library } = useWeb3React<Web3Provider>();
  const [tokenInfoPair, setTokenInfoPair] = useState(null);
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState("");
  const [allowance, setAllowance] = useState(BigNumber.from(-1));
  const [fillState, setFillSate] = useState("");
  const [openVisible, setOpenVisible] = useState(false);
  const [amountRange, setAmountRange] = useState({
    minAmount: BigNumber.from("0"),
    maxAmount: BigNumber.from("0"),
  });

  const [changedToAddress, setChangedToAddress] = useState(undefined);
  const toEthAddress = useMemo(() => {
    if (changedToAddress !== undefined) {
      if (validateAddress(changedToAddress)) {
        return fromString(changedToAddress).stringEth();
      }
      return "";
    }
    // return account;
  }, [account, changedToAddress]);
  const toIoAddress = useMemo(() => (toEthAddress ? fromBytes(Buffer.from(String(toEthAddress).replace(/^0x/, ""), "hex")).string() : ""), [toEthAddress]);
  const token = useMemo(() => (tokenInfoPair ? tokenInfoPair.ETHEREUM : null), [tokenInfoPair]);
  const xrc20TokenInfo = useMemo(() => (tokenInfoPair ? tokenInfoPair.IOTEX : null), [tokenInfoPair]);
  const tokenAddress = useMemo(() => (token ? token.address : ""), [token]);
  const chain = useMemo<ChianMapType["eth"]["42"]>(() => chianMap.eth[chainId], [chainId]);
  const cashierContractAddress = useMemo(() => {
    return chain.contract.cashier.address;
  }, [chain]);

  const isETHCurrency = useMemo(() => tokenInfoPair && tokenInfoPair.ETHEREUM.name === "ETH", [chainId, tokenInfoPair, account]);
  const tokenBalance = useTokenBalances(tokenAddress, token, [account])[account];
  const userEthBalance = useETHBalances([account])[account];
  const balance = useMemo(() => (isETHCurrency ? userEthBalance : tokenBalance), [isETHCurrency, userEthBalance, tokenBalance]);

  const store = useLocalStore(() => ({
    showConfirmModal: false,
    toggleConfirmModalVisible() {
      this.showConfirmModal = !this.showConfirmModal;
    },
  }));

  const cashierContractValidate = useMemo(() => {
    if (!cashierContractAddress || !isAddress(cashierContractAddress)) {
      return false;
    }
    return true;
  }, [chainId, cashierContractAddress]);

  const tokenContract = useMemo(() => {
    if (isAddress(tokenAddress)) {
      return getContract(tokenAddress, ERC20_ABI, library, account);
    }
    return null;
  }, [tokenAddress, library, account]);

  const cashierContract = useMemo(() => {
    const contract = chain.contract.cashier;
    if (isAddress(contract.address)) {
      return getContract(contract.address, contract.abi, library, account);
    }
    return null;
  }, [chain, library, account, isETHCurrency]);

  const mintableTokenListContract = useMemo(() => {
    const contract = chain.contract.mintableTokenList;
    if (isAddress(contract.address)) {
      return getContract(contract.address, contract.abi, library, account);
    }
    return null;
  }, [chain, library, account, isETHCurrency]);

  const standardTokenListContract = useMemo(() => {
    const contract = chain.contract.standardTokenList;
    if (isAddress(contract.address)) {
      return getContract(contract.address, contract.abi, library, account);
    }
    return null;
  }, [chain, library, account, isETHCurrency]);

  useMemo(() => {
    if (tokenAddress && mintableTokenListContract && standardTokenListContract) {
      const fetchAmountRange = async () => {
        try {
          const [minAmount1, maxAmount1, minAmount2, maxAmount2] = await Promise.all([
            standardTokenListContract.minAmount(tokenAddress),
            standardTokenListContract.maxAmount(tokenAddress),
            mintableTokenListContract.minAmount(tokenAddress),
            mintableTokenListContract.maxAmount(tokenAddress),
          ]);
          setAmountRange({
            minAmount: minAmount1 || minAmount2,
            maxAmount: maxAmount1 || maxAmount2,
          });
        } catch (e) {
          window.console.log(`Failed to get amount range `, e);
          message.error(`Failed to get amount range!\n${e.message}`);
        }
      };
      fetchAmountRange();
    }
  }, [tokenAddress, cashierContract]);

  useEffect(() => {
    if (isAddress(account) && cashierContractValidate && tokenContract && !isETHCurrency) {
      try {
        tokenContract
          .allowance(account, cashierContractAddress)
          .then((value: BigNumber) => {
            setAllowance(value);
            return value;
          })
          .catch((error: Error) => {
            window.console.log(`Failed to get allowance!`, error);
          });
      } catch (e) {
        window.console.log(`Failed to get allowance!`, e);
      }
    }
  }, [account, cashierContractValidate, tokenContract, isETHCurrency]);

  const tryActivation = async (connector) => {
    let name = "";
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined;
    }
    try {
      await activate(connector, undefined, true);
      wallet.setMetaMaskConnected();
    } catch (error) {
      if (error instanceof UnsupportedChainIdError || (error.code = 32002)) {
        wallet.toggleERCWarnModal();
        activate(connector);
      } else {
        // setPendingError(true)
        throw error;
      }
    }
  };

  const onConvert = () => {
    if (Boolean(inputError)) return;
    store.toggleConfirmModalVisible();
  };

  const onApprove = async () => {
    if (Boolean(inputError)) return;

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
      const estimatedGas = await tokenContract.estimateGas.approve(cashierContractAddress, rawAmount).catch(() => {
        return tokenContract.estimateGas.approve(cashierContractAddress, rawAmount);
      });
      tokenContract
        .approve(cashierContractAddress, rawAmount, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: TransactionResponse) => {
          message.success("Approved");
          window.console.log(`Approve success`);
          setAllowance(BigNumber.from(rawAmount));
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

  const validateToAddress = useMemo(() => validateAddress(toIoAddress), [toIoAddress]);
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
    if (!validateToAddress) {
      return lang.t("input.ioaddress.invalid");
    }
    if (amountRange.maxAmount.eq(0)) {
      return lang.t("input.amount.range_error");
    }
    if (amountNumber < Number(formatUnits(amountRange.minAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))) {
      return `Amount must >= ${Number(formatUnits(amountRange.minAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))}`;
    }
    if (amountNumber > Number(formatUnits(amountRange.maxAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))) {
      return `Amount must <= ${Number(formatUnits(amountRange.maxAmount, token ? token.decimals : DEFAULT_TOKEN_DECIMAL))}`;
    }
    try {
      if (balance && amountNumber > Number(balance.toExact())) {
        return lang.t("input.balance.insufficient", { symbol: token.symbol });
      }
    } catch (e) {
      return lang.t("input.balance.invalid", { symbol: token.symbol });
    }
    return "";
  }, [amount, balance, account, tokenAddress, cashierContractAddress, validateToAddress]);

  const possibleApprove = useMemo(() => {
    if (Boolean(inputError) || isETHCurrency) return false;
    return amountInAllowance(allowance, amount, token) == AmountState.UNAPPROVED;
  }, [allowance, amount, token, chainId, account, isETHCurrency]);

  const possibleConvert = useMemo(() => {
    if (!toIoAddress) return false;
    if (isETHCurrency) return true;
    if (possibleApprove || Boolean(inputError)) return false;
    return amountInAllowance(allowance, amount, token) == AmountState.APPROVED;
  }, [possibleApprove, allowance, amount, token, chainId, account, isETHCurrency, toIoAddress]);

  const onConfirm = useCallback(async () => {
    if (Boolean(inputError)) return false;

    const rawAmount = tryParseAmount(amount, token).toString();
    if (!rawAmount) {
      message.error(`Could not parse amount for token ${token.name}`);
      return;
    }

    let tokenAddress = token ? token.address : "";
    if (isETHCurrency) {
      tokenAddress = "0x0000000000000000000000000000000000000000";
    }
    if (!tokenAddress) {
      message.error("could not get token address");
      return;
    }

    if (!isEthAddress(toEthAddress)) {
      message.error("Fail To Convert Address");
      return;
    }

    const args = [tokenAddress, toEthAddress, rawAmount];
    console.log({ args });
    const methodName = "depositTo";
    const options = { from: account, gasLimit: 1000000 };
    if (isETHCurrency) {
      options["value"] = rawAmount;
    }
    const depositTo = () => {
      cashierContract[methodName](...args, options)
        .then((response: any) => {
          window.console.log(`${methodName} action hash`, response.hash, response);
          setHash(response.hash);

          store.toggleConfirmModalVisible();

          base.toggleComplete(response.hash, getEtherscanLink(chainId, response.hash, "transaction"), toIoAddress, token.name, tokenInfoPair, amount);
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
            window.console.error(`${methodName} failed`, error, methodName, args, options);
          }
          message.error(content);
        });
    };
    cashierContract.estimateGas[methodName](...args, {})
      .then((gasEstimate) => {
        window.console.log("Gas estimation succeeded.", gasEstimate);
        // gasEstimate.mul(1.1).toNumber() will cause error.
        options.gasLimit = gasEstimate.mul(11).div(10).toNumber();
        depositTo();
        return {
          gasEstimate,
        };
      })
      .catch((gasError) => {
        window.console.log("Gas estimation failed. Trying eth_call to extract error.", gasError);
        return cashierContract.callStatic[methodName](...args, options)
          .then((result) => {
            window.console.log("Be possible unexpected successful call after failed estimate gas. Let's try", gasError, result);
            depositTo();
          })
          .catch((callError) => {
            window.console.log("Call threw error", callError);

            let errorMessage: string;
            if ((callError.reason && callError.reason?.indexOf("INSUFFICIENT_OUTPUT_AMOUNT") >= 0) || callError.reason?.indexOf("EXCESSIVE_INPUT_AMOUNT") >= 0) {
              errorMessage = "This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.";
            } else {
              errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens.`;
            }
            depositTo();
            message.error(errorMessage);
          });
      });
  }, [inputError, amount, token, cashierContract, isETHCurrency, toIoAddress]);

  const prefillAddress = !!location.search ? qs.parse(location.search, { ignoreQueryPrefix: true }).to.toString() : null;
  return useObserver(() => (
    <div className="page__home__component__erc_xrc p-8 pt-6">
      <Form className="">
        {utils.env.isIoPayMobile() ? (
          <div>
            <div className="block md:hidden mt-6 text-base text-left mb-48 c-white">To transfer your assets from ETH to loTeX. You need to open Tube in an ETH wallet.</div>
            <div className="block md:hidden">
              <SubmitButton
                title={lang.t("open_tube_in")}
                onClick={() => {
                  setOpenVisible(true);
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="my-6">
              <TokenSelectField
                network={ETHEREUM}
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
                token && (
                  <span
                    onClick={() => {
                      if (balance) {
                        setAmount(balance.toFixed(3));
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
                {balance && (
                  <span>
                    {balance?.toExact()} {token.symbol}
                  </span>
                )}
              </div>
            )}
            {amount && account && (
              <div className="my-6 text-left">
                {token && xrc20TokenInfo && (
                  <div className="text-base c-gray-20 font-thin">
                    {lang.t("you_will_recieve_amount_symbol_tokens_at", {
                      amount,
                      symbol: xrc20TokenInfo.symbol,
                    })}
                  </div>
                )}
                <AddressInput
                  label={lang.t("iotx_Address")}
                  address={prefillAddress}
                  onChange={(address: string) => {
                    setChangedToAddress(address);
                  }}
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
                  <a href={getEtherscanLink(chainId, hash, "transaction")} target={"_blank"}>
                    {`view on Etherscan ${hash}`}
                  </a>
                </div>
              )}
            </div>

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
                {possibleApprove && !Boolean(inputError) && <SubmitButton title={fillState ? inputError || lang.t("approve") : lang.t("approve")} onClick={onApprove} />}
                <SubmitButton title={fillState ? inputError || lang.t("convert") : lang.t("convert")} onClick={onConvert} disabled={!possibleConvert || !validateToAddress} />
              </div>
            )}
          </div>
        )}

        <ConfirmModal
          visible={store.showConfirmModal}
          onConfirm={onConfirm}
          depositAmount={getAmountNumber(amount)}
          depositToken={token}
          mintAmount={getAmountNumber(amount)}
          mintToken={xrc20TokenInfo}
          close={store.toggleConfirmModalVisible}
          middleComment="to ioTube and mint"
          toAddress={toIoAddress}
          isERCXRC
        />
        <WarnModal visible={base.mode === CARD_ERC20_XRC20 && wallet.showERCWarnModal} isERCXRC close={wallet.toggleERCWarnModal} />
        <OpenModal visible={openVisible} changeVisible={setOpenVisible} close={() => setOpenVisible(!openVisible)} />
      </Form>
    </div>
  ));
};
