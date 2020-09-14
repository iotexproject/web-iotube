import { Link, useLocation } from "react-router-dom";
import { Avatar, Button, notification, Popover } from "antd";
import { useObserver } from "mobx-react";
import { BrowserView, MobileView } from "react-device-detect";
import { CARD_ERC20_XRC20 } from "../../../common/store/base";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import useENSName from "../../hooks/useENSName";
import { useETHBalances } from "../../state/wallet/hooks";
import { Web3Provider } from "@ethersproject/providers";
import { SUPPORTED_WALLETS, ETH_NETWORK_NAMES } from "../../constants";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { injected } from "../../connectors";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { IMG_ETHER, IMG_IOTX, IMG_LOGO } from "../../constants/index";
import React from "react";
import "./index.scss";
import { CopyOutlined, EllipsisOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useStore } from "../../../common/store";
import { shortenAddress } from "../../utils";
import copy from "copy-to-clipboard";

export const Header = () => {
  const location = useLocation();
  const { wallet, lang, base } = useStore();
  const { account, activate, chainId } = useWeb3React<Web3Provider>();
  const { ENSName } = useENSName(account);
  const userEthBalance = useETHBalances([account])[account];

  const isTutorialPage = location.pathname === "/tutorial";

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

  const onConnectWallet = () => {
    if (base.mode === CARD_ERC20_XRC20) {
      tryActivation(injected).then();
    } else {
      // @ts-ignore
      wallet.init();
    }
  };

  const onCopyAddress = (address) => () => {
    copy(address);
    notification.open({
      message: lang.t("copied_to_clipboard"),
      description: address,
      duration: 1,
      style: {
        padding: 15,
      },
    });
  };

  const onClickFAQ = () => {
    window.scrollTo({
      top: window.innerHeight * 2,
      behavior: "smooth",
    });
  };

  const renderWalletInfo = () => {
    const walletConnected = base.mode === CARD_ERC20_XRC20 ? wallet.metaMaskConnected : wallet.walletConnected;
    const walletAddress = walletConnected ? (base.mode === CARD_ERC20_XRC20 ? ENSName || account : wallet.walletAddress) : "";
    const walletBalance =
      base.mode === CARD_ERC20_XRC20
        ? userEthBalance?.toFixed(2)
        : fromRau(`${wallet.walletBalance}`, "iotx")
            .split(" ")
            .map((value, index) => (index === 1 ? value : Number(value).toFixed(2)))
            .join(" ");
    const balanceUnit = base.mode === CARD_ERC20_XRC20 ? "ETH" : wallet.token;

    return walletConnected ? (
      <>
        {chainId !== 1 && base.mode === CARD_ERC20_XRC20 && (
          <>
            <span className="capitalize inline-block rounded bg-primary c-green px-2">{ETH_NETWORK_NAMES[chainId]}</span>
            &nbsp;
          </>
        )}
        <span>
          {walletBalance}&nbsp;{balanceUnit}
        </span>
        &nbsp;&nbsp;
        <span className="component__header__content__wallet_address ">{shortenAddress(walletAddress)}</span>
        &nbsp;
        <CopyOutlined className="text-lg cursor-pointer" onClick={onCopyAddress(walletAddress)} />
        &nbsp;
        <Avatar src={base.mode === CARD_ERC20_XRC20 ? IMG_ETHER : IMG_IOTX} size="small" />
      </>
    ) : (
      <Button className="c-white" type="text" onClick={onConnectWallet}>
        {lang.t("header.connect_wallet")}
      </Button>
    );
  };

  return useObserver(() => (
    <div className="component__header h-16">
      <div className="component__header__content app_header_content flex justify-between items-center h-full py-1">
        <Link to="/">
          <img alt="logo" src={IMG_LOGO} />
        </Link>

        {isTutorialPage && (
          <a className="component__header__content__app font-medium" href="/">
            Launch App
          </a>
        )}

        {!isTutorialPage && (
          <span className="flex items-center c-white font-thin">
            <BrowserView>
              <Link className="c-white" to="/tutorial">
                {lang.t("header.tutorial")}
              </Link>
              <Button className="c-white" type="text" onClick={onClickFAQ}>
                {lang.t("header.faq")}
              </Button>
            </BrowserView>
            {renderWalletInfo()}
            &nbsp;
            <Popover
              placement="bottomRight"
              title={null}
              trigger="click"
              overlayClassName="component__header__settings__popup"
              content={
                <div>
                  <a href="https://github.com/iotexproject/iotube" target="_blank" className="c-gray-30 flex items-center font-light w-24 py-1">
                    <InfoCircleOutlined />
                    <span className="ml-2 text-base">{lang.t("about")}</span>
                  </a>
                  <MobileView>
                    <Link className="c-gray-30 text-base py-1" to="/tutorial">
                      {lang.t("header.tutorial")}
                    </Link>
                  </MobileView>
                  <MobileView>
                    <div className="text-base c-gray-30 py-1" onClick={onClickFAQ}>
                      {lang.t("header.faq")}
                    </div>
                  </MobileView>
                </div>
              }
            >
              <Button type="text" shape="circle" className="component__header__content__more c-white">
                <EllipsisOutlined className="text-lg" />
              </Button>
            </Popover>
          </span>
        )}
      </div>
    </div>
  ));
};
