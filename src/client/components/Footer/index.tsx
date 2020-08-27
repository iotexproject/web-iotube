import React from "react";
import "./index.scss";
import { useObserver } from "mobx-react";
import { useStore } from "../../../common/store";

export const Footer = () => {
  const { lang } = useStore();
  return useObserver(() => (
    <div className="component__footer pt-2 pb-4 sm:pb-8">
      <div className="component__footer__content app_frame text-center c-gray-40 text-base font-light">
        {lang.t("beta_notice")}
      </div>
    </div>
  ));
};
