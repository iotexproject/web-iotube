import React, { useEffect } from "react";
import "./index.scss";
import { Header } from "../../components";

interface IComponentProps {
  children: Array<JSX.Element> | JSX.Element;
}

export const MainLayout = (props: IComponentProps) => {
  return (
    <div className="layout__main h-screen">
      <Header />
      <div className="layout__main__content h-full text-center">{props.children}</div>
    </div>
  );
};
