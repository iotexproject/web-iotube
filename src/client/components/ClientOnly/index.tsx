import React from "react";
import { utils } from "../../../common/utils/index";

export const ClientOnly = ({ children }) => {
  if (utils.env.isSSR()) return null;
  return children;
};
