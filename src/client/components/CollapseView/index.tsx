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
      <div className="collapse__view__title flex flex-row items-center w-full pb-10">
        <img className="w-6 mr-6" src={isOpen ? IMG_HIDE : IMG_SHOW} alt="show hide" onClick={() => setOpen(!isOpen)} />
        <span className="c-white-10 text-2xl mb-0" onClick={() => setOpen(!isOpen)}>
          {title}
        </span>
      </div>
      <Collapse isOpened={isOpen}>
        <blockquote className="c-gray-50 ml-12 md:ml-24 mb-0 px-3 md:px-5">{body}</blockquote>
      </Collapse>
    </div>
  );
};
