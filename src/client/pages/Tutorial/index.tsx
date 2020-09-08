import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import "./index.scss";
import { ClientOnly } from "../../components";
import { useStore } from "../../../common/store";
import { CARD_XRC20_ERC20, CARD_ERC20_XRC20 } from "../../../common/store/base";
import { matchPath, useHistory } from "react-router-dom";

const IMG_BG_TUTORIAL = require("../../static/images/bg-tutorial.png");
const IMG_TUTORIAL_CHECK_DESTINATION = require("../../static/images/tutorial-check-destination.png");
const IMG_TUTORIAL_CLICK_CONVERT = require("../../static/images/tutorial-click-convert.png");
const IMG_TUTORIAL_CONNECT_DAPP = require("../../static/images/tutorial-connect-dapp.png");
const IMG_TUTORIAL_FOLLOW_INSTRUCTION = require("../../static/images/tutorial-follow-instruction.png");
const IMG_TUTORIAL_METAMASK = require("../../static/images/tutorial-metamask.png");
const IMG_TUTORIAL_SELECT_AMOUNT = require("../../static/images/tutorial-select-amount.png");
const IMG_TUTORIAL_SELECT_ERC20 = require("../../static/images/tutorial-select-erc20.png");

export const Tutorial = () => {
  const { lang } = useStore();

  return useObserver(() => (
    <ClientOnly>
      <div className="page__tutorial h-full">
        <div className="page__tutorial__content mx-auto text-left">
          <img className="fixed top-0 right-0 z--1" src={IMG_BG_TUTORIAL} alt="bg tutorial" />
          <h1 className="text-6xl c-green-20 leading-tight mb-32">{lang.t("tutorial.tutorial")}</h1>
          <div className="mb-24">
            <p className="text-xl c-white-10 leading-loose">
              <strong>{lang.t("tutorial.ioTube")}</strong>
              {` ${lang.t("tutorial.summary")}`}
              <br /> <br />
              {`${lang.t("tutorial.convert_ERC20")} `}
              <a className="c-green-20" href="https://tube.iotex.io">
                https://tube.iotex.io
              </a>
            </p>
          </div>
          <div className="mb-24">
            <h3 className="text-3xl c-white-10 leading-tight mb-3">{lang.t("tutorial.send_from_ethereum_to_iotex")}</h3>
            <p className="text-xl c-white-10 leading-loose">{lang.t("tutorial.purpose_of_operation")}</p>
          </div>
          <div className="mb-24">
            <h4 className="text-2xl c-white-10 mb-3">{lang.t("tutorial.one.title")}</h4>
            <p className="text-xl c-white-10 leading-loose md:ml-16">{lang.t("tutorial.one.body")}</p>
            <img className="md:pl-16 mt-6" src={IMG_TUTORIAL_METAMASK} alt="tutorial metamask" />
          </div>
          <div className="mb-24">
            <h4 className="text-2xl c-white-10 mb-3">{lang.t("tutorial.two.title")}</h4>
            <ul className="text-xl c-white-10 leading-loose md:ml-16">
              <li>{lang.t("tutorial.two.body.one")}</li>
              <li>{lang.t("tutorial.two.body.two")}</li>
              <li>{lang.t("tutorial.two.body.three")}</li>
              <li>{lang.t("tutorial.two.body.four")}</li>
            </ul>
            <img className="md:pl-16 mt-6" src={IMG_TUTORIAL_CONNECT_DAPP} alt="tutorial metamask" />
          </div>
          <div className="mb-24">
            <h4 className="text-2xl c-white-10 mb-3">{lang.t("tutorial.three.title")}</h4>
            <p className="text-xl c-white-10 leading-loose md:ml-16">
              {`${lang.t("tutorial.three.body")} `}
              <a className="c-green-20" href="#">
                {lang.t("tutorial.three.body.submit")}
              </a>
            </p>
            <img className="md:pl-16 mt-6" src={IMG_TUTORIAL_SELECT_ERC20} alt="tutorial metamask" />
          </div>
          <div className="mb-24">
            <h4 className="text-2xl c-white-10 mb-3">{lang.t("tutorial.four.title")}</h4>
            <ul className="text-xl c-white-10 leading-loose md:ml-16">
              <li>{lang.t("tutorial.four.body.one")}</li>
              <li>
                {lang.t("tutorial.four.body.click")}
                <strong>{` "${lang.t("approve")}" `}</strong>
              </li>
              <li>{lang.t("tutorial.four.body.three")}</li>
            </ul>
            <img className="md:pl-16 mt-6" src={IMG_TUTORIAL_SELECT_AMOUNT} alt="tutorial metamask" />
            <ul className="text-xl c-white-10 leading-loose md:ml-16">
              <li>
                <strong>{lang.t("tutorial.four.body.four.please_note")}</strong>
                {` ${lang.t("tutorial.four.body.four")}`}
              </li>
              <li>
                {lang.t("tutorial.four.body.click")}
                <strong>{` "${lang.t("convert")}" `}</strong>
                {lang.t("tutorial.four.body.five")}
              </li>
            </ul>
            <img className="md:pl-16 mt-6" src={IMG_TUTORIAL_CLICK_CONVERT} alt="tutorial metamask" />
            <p className="text-xl c-white-10 leading-loose">{lang.t("tutorial.four.body.final")}</p>
            <p className="text-xl c-white-10 leading-loose">{lang.t("tutorial.four.body.congratulation")}</p>
          </div>
          <div className="mb-24">
            <h4 className="text-2xl c-white-10 mb-3">{lang.t("tutorial.five.title")}</h4>
            <p className="text-xl c-white-10 leading-loose md:ml-16">
              {`${lang.t("tutorial.five.body.start")} `}
              <strong>{lang.t("tutorial.five.body.unlock_xrc20")}</strong>
              {` ${lang.t("tutorial.five.body.can_use")} `}
              <a className="c-green-20" href="#">
                {lang.t("tutorial.five.body.ioPay")}
              </a>
              {` ${lang.t("tutorial.five.body.end")}`}
            </p>
            <img className="md:pl-16 mt-6" src={IMG_TUTORIAL_CHECK_DESTINATION} alt="tutorial metamask" />
          </div>
          <div className="mb-24">
            <h3 className="text-3xl c-white-10 leading-tight mb-3">{lang.t("tutorial.convert_XRC20.title")}</h3>
            <p className="text-xl c-white-10 leading-loose">{lang.t("tutorial.convert_XRC20.operation")}</p>
            <ul className="text-xl c-white-10 leading-loose md:ml-16">
              <li>
                {`${lang.t("tutorial.convert_XRC20.one")} `}
                <a className="c-green-20" href="https://tube.iotex.io">
                  tube.iotex.io
                </a>
              </li>
              <li>
                {`${lang.t("tutorial.convert_XRC20.two.start")} `}
                <a className="c-green-20" href="https://tube.iotex.io">
                  tube.iotex.io
                </a>
                {` ${lang.t("tutorial.convert_XRC20.two.end")}`}
              </li>
              <li>
                {`${lang.t("tutorial.convert_XRC20.three.start")} `}
                <strong>{lang.t("iotex")}</strong>
                {` ${lang.t("tutorial.convert_XRC20.three.middle")}`}
                <strong>{lang.t("approve")}</strong>
                {` ${lang.t("and")} `}
                {lang.t("tutorial.convert_XRC20.three.end")}
              </li>
            </ul>
            <img className="md:pl-16 mt-6" src={IMG_TUTORIAL_FOLLOW_INSTRUCTION} alt="tutorial metamask" />
          </div>
          <div className="mb-24">
            <h3 className="text-3xl c-white-10 leading-tight mb-3">{lang.t("tutorial.questions.title")}</h3>
            <p className="text-xl c-white-10 leading-loose">
              {`${lang.t("tutorial.questions.body")} `}
              <a className="c-green-20" href="https://t.me/IoTeXGroup">
                https://t.me/IoTeXGroup
              </a>
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  ));
};
