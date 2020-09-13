import React, { useState } from "react";
import { Collapse } from "react-collapse";

import "./index.scss";

const IMG_HIDE = require("../../static/images/icon_hide.png");
const IMG_SHOW = require("../../static/images/icon_show.png");

interface IComponentProps {
  title: string;
  body: Array<JSX.Element> | JSX.Element;
}

export const CollapseView = (props: IComponentProps) => {
  const { title, body } = props;
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="collapse__view pt-12 pb-6">
      <div className="flex flex-row items-center w-full pb-10">
        <img className="w-6 mr-6" src={isOpen ? IMG_HIDE : IMG_SHOW} alt="show hide" onClick={() => setOpen(!isOpen)} />
        <h5 className="c-white-10 text-3xl flex-1 mb-0">{title}</h5>
      </div>
      <Collapse isOpened={isOpen}>
        <blockquote className="c-gray-50 text-2xl ml-12 md:ml-24 mb-0 px-3 md:px-5">{body}</blockquote>
      </Collapse>
    </div>
  );
};
