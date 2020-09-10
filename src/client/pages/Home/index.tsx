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

  useEffect(() => {
    base.setMode(isERCXRC ? CARD_ERC20_XRC20 : CARD_XRC20_ERC20);
  }, [isERCXRC]);

  const switchTo = () => {
    history.push(base.mode === CARD_ERC20_XRC20 ? "/iotx" : "/eth");
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
          <img alt="info background" src={IMG_INFO_BACKGROUND} className="w-screen h-screen absolute top-0 left-0" />
          <div className="w-10/12 h-screen m-auto flex flex-col justify-center items-center">
            <img alt="iotube logo" src={IMG_IOTUBE_LOGO} className="w-64 mb-12" />
            <p className="text-xl c-gray-20 leading-loose mb-12">{lang.t("info.features")}</p>
            <h1 className="text-5xl c-white-10 leading-tight mb-20">
              {lang.t("info.summary.start")}
              <br />
              {lang.t("info.summary.end")}
            </h1>
            <a href="https://medium.com/@iotex/iotube-cross-chain-bridge-to-connect-iotex-with-the-blockchain-universe-b0f5b08c1943" target={"_blank"}>
              {lang.t("info.how_iotex_work")}
            </a>
          </div>
        </div>
        <div className="page__home__faq__container relative">
          <img alt="youtube" src={IMG_YOUTUBE} className="page__home__faq__container__youtube absolute w-1/5" onClick={() => setShowVideo(true)} />
          <h1 className="c-green-20 text-5xl">{lang.t("header.faq")}</h1>
          <CollapseView
            title="How Does ioTube Work How Does ioTube Work"
            body="How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube How Does ioTube Work How Does ioTube WorkWork How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube Work"
          />
          <CollapseView
            title="How Does ioTube Work How Does ioTube Work"
            body="How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube How Does ioTube Work How Does ioTube WorkWork How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube Work"
          />
          <CollapseView
            title="How Does ioTube Work How Does ioTube Work"
            body="How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube How Does ioTube Work How Does ioTube WorkWork How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube Work"
          />
          <CollapseView
            title="How Does ioTube Work How Does ioTube Work"
            body="How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube How Does ioTube Work How Does ioTube WorkWork How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube Work"
          />
          <CollapseView
            title="How Does ioTube Work How Does ioTube Work"
            body="How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube How Does ioTube Work How Does ioTube WorkWork How Does ioTube Work How Does ioTube Work How Does ioTube Work How Does ioTube Work"
          />
        </div>
        <ModalVideo channel="youtube" isOpen={isShowVideo} videoId="PebkRFQeTsE" onClose={() => setShowVideo(false)} />
      </div>
    </ClientOnly>
  ));
};
