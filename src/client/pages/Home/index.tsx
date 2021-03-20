import React, { useEffect, useState } from "react";
import ModalVideo from "react-modal-video";
import { useObserver } from "mobx-react-lite";
import "./index.scss";
import { ClientOnly, SubmitButton, CollapseView } from "../../components";

import { ERCXRC, XRCERC, SwitchHeader, CompleteFrame } from "./components";
import { useStore } from "../../../common/store";
import { CARD_XRC20_ERC20, CARD_ERC20_XRC20 } from "../../../common/store/base";
import { matchPath, useHistory } from "react-router-dom";

const IMG_INFO_BACKGROUND = require("../../static/images/info-background.png");
const IMG_FAQ_BACKGROUND = require("../../static/images/faq-background.png");
const IMG_IOTUBE_LOGO = require("../../static/images/logo_iotube.png");
const IMG_YOUTUBE = require("../../static/images/info-youtube.png");

export const Home = () => {
  const { base, lang } = useStore();
  const [isShowVideo, setShowVideo] = useState(false);

  const history = useHistory();

  const isERCXRC = !!matchPath(history.location.pathname, {
    path: "/eth",
    exact: true,
  });

  const ERCXRCPathName = isERCXRC ? history.location.pathname + history.location.search : "/eth";
  const XRCERCPathName = !isERCXRC ? history.location.pathname + history.location.search : "/iotx";

  useEffect(() => {
    base.setMode(isERCXRC ? CARD_ERC20_XRC20 : CARD_XRC20_ERC20);
  }, [isERCXRC]);

  const switchTo = () => {
    history.push(base.mode === CARD_ERC20_XRC20 ? XRCERCPathName : ERCXRCPathName);
  };

  return useObserver(() => (
    <ClientOnly>
      <div className="page__home">
        <div className="page__home__exchange__container app_frame">
          {base.showComplete ? (
            <div className="rounded app_frame_shadow">
              <CompleteFrame isERCXRC={isERCXRC} />
            </div>
          ) : (
            <div className="rounded-t-md overflow-hidden">
              <div>{lang.t("v4.link")}</div>
              <SwitchHeader onSwitch={switchTo} isERCXRC={isERCXRC} />
              <>
                <div
                  className={`page__home__exchange__container__frame bg-primary rounded-b-md overflow-hidden ${
                    isERCXRC ? "page__home__exchange__container__frame--active" : "page__home__exchange__container__frame--inactive"
                  }`}
                >
                  <ERCXRC />
                </div>
                <div
                  className={`page__home__exchange__container__frame bg-secondary rounded-b-md overflow-hidden ${
                    isERCXRC ? "page__home__exchange__container__frame--inactive" : "page__home__exchange__container__frame--active"
                  }`}
                >
                  <XRCERC />
                </div>
              </>
            </div>
          )}
          <div className="page__home__exchange__container__beta-notice c-gray-40 text-base font-light">{lang.t("beta_notice")}</div>
        </div>
        <div className="page__home__info__container bg-dark">
          <img alt="info background" src={IMG_INFO_BACKGROUND} className="absolute h-full top-0 right-0" />
          <div className="w-10/12 h-full m-auto flex flex-col justify-center items-center">
            <img alt="iotube logo" src={IMG_IOTUBE_LOGO} className="w-64 mb-12" />
            <p className="text-xl c-gray-20 leading-loose mb-12">{lang.t("info.features")}</p>
            <div className="text-5xl c-white-10 leading-tight mb-20">
              {lang.t("info.summary.start")}
              <br />
              {lang.t("info.summary.end")}
            </div>
            <a className="font-medium" href="https://medium.com/@iotex/iotube-cross-chain-bridge-to-connect-iotex-with-the-blockchain-universe-b0f5b08c1943" target={"_blank"}>
              {lang.t("info.how_iotex_work")}
            </a>
          </div>
        </div>
        <div className="page__home__faq__container__background bg-green"></div>
        <div className="page__home__faq__container relative">
          <img alt="youtube" src={IMG_YOUTUBE} className="page__home__faq__container__youtube absolute" onClick={() => setShowVideo(true)} />
          <div className="c-green-20 page__home__faq__container__header">{lang.t("header.faq")}</div>
          <CollapseView
            title={lang.t("faq.what_is_iotube_bridge")}
            body={
              <>
                <p>{lang.t("faq.iotube_bridge_is")}</p>
                <br />
                <p>
                  {`${lang.t("faq.iotube_ui")} `}
                  <a href="https://tube.iotex.io" target={"_blank"}>
                    https://tube.iotex.io
                  </a>
                </p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.what_is_iotube_used_for")}
            body={
              <>
                <p>{lang.t("faq.iotube_used_for.one")}</p>
                <p>{lang.t("faq.iotube_used_for.two")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.how_does_iotube_work")}
            body={
              <>
                <p>{lang.t("faq.iotube_work.two_components")}</p>
                <ul>
                  <li>
                    <strong>{lang.t("faq.iotube_work.components.smart_contracts")}</strong>
                    {` ${lang.t("faq.iotube_work.components.smart_contracts.work")}`}
                  </li>
                  <li>
                    <strong>{lang.t("faq.iotube_work.components.pool_of_witness")}</strong>
                    {` ${lang.t("faq.iotube_work.components.pool_of_witness.work")}`}
                  </li>
                </ul>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.what_is_proxy_token")}
            body={
              <>
                <p>{lang.t("faq.proxy_token_is")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.what_different_proxy_token_and_original_token")}
            body={
              <>
                <p>{lang.t("faq.difference_between_proxy_token_and_original_token")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.does_the_token_supply_increase_when_using_iotube")}
            body={
              <>
                <p>{lang.t("faq.token_supply_does_not_increase")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.does_the_token_supply_increase_when_using_iotube")}
            body={
              <>
                <p>{lang.t("faq.token_supply_does_not_increase")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.what_happens_to_my_original_tokens_if_i_sell_the_proxy_token")}
            body={
              <>
                <p>{lang.t("faq.happens_to_original_tokens")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.can_i_send_my_proxy_token_back")}
            body={
              <>
                <p>{lang.t("faq.can_send_proxy_token_back")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.can_i_transfer_as_many_or_limit")}
            body={
              <>
                <p>{lang.t("faq.transfer_limit")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.can_i_send_native_iotex_tokens_using_iotube")}
            body={
              <>
                <p>{lang.t("faq.way_to_send_native_token")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.what_tokens_are_supported_by_iotube")}
            body={
              <>
                <p>{lang.t("faq.supported_tokens")}</p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.what_are_the_fees_using_iotube")}
            body={
              <>
                <p>
                  <strong>{lang.t("faq.fee.service")}</strong>
                </p>
                <ul>
                  <li>{lang.t("faq.fee.service.desc")}</li>
                </ul>
                <p>
                  <strong>{lang.t("faq.fee.from_eth_to_iotex")}</strong>
                </p>
                <ul>
                  <li>{lang.t("faq.fee.from_eth_to_iotex.desc.one")}</li>
                  <li>{lang.t("faq.fee.from_eth_to_iotex.desc.two")}</li>
                </ul>
                <p>
                  <strong>{lang.t("faq.fee.from_iotex_to_eth")}</strong>
                </p>
                <ul>
                  <li>{lang.t("faq.fee.from_iotex_to_eth.desc.one")}</li>
                  <li>{lang.t("faq.fee.from_iotex_to_eth.desc.two")}</li>
                </ul>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.is_there_is_a_tutorial")}
            body={
              <>
                <p>
                  {lang.t("faq.tutorial_community")}{" "}
                  <a target={"_blank"} href="https://community.iotex.io/t/using-iotube-to-move-erc20-tokens-from-ethereum-to-iotex/1452">
                    https://community.iotex.io/t/using-iotube-to-move-erc20-tokens-from-ethereum-to-iotex/1452
                  </a>
                </p>
              </>
            }
          />
          <CollapseView
            title={lang.t("faq.is_iotube_open_source")}
            body={
              <>
                <p>
                  {lang.t("faq.iotube_github")}{" "}
                  <a target={"_blank"} href="https://github.com/iotexproject/ioTube">
                    https://github.com/iotexproject/ioTube
                  </a>
                </p>
              </>
            }
          />
        </div>
        <ModalVideo channel="youtube" isOpen={isShowVideo} videoId="PebkRFQeTsE" onClose={() => setShowVideo(false)} />
      </div>
    </ClientOnly>
  ));
};
