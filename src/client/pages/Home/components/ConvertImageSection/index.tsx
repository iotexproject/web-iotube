import React from 'react';
import './index.scss';
import { useStore } from '../../../../../common/store';

const IMG_ETHER = require('../../../../static/images/logo-ethereum.png');
const IMG_IOTEX = require('../../../../static/images/logo-iotex.png');
const IMG_CONVERT = require('../../../../static/images/icon-arrow.png');

interface IComponentProps {
  isERCXRC: boolean;
}

export const ConvertImageSection = (props: IComponentProps) => {
  const { lang } = useStore();
  return (
    <div
      className={`page__home__component__convert_image_section c-white flex items-center justify-center ${
        props.isERCXRC ? '' : 'flex-row-reverse'
      }`}
    >
      <div className="page__home__component__convert_image_section__item">
        <img src={IMG_ETHER} className="h-20" />
        <div className="text-xl font-normal">{lang.t('token.ethereum')}</div>
      </div>
      <div className="page__home__component__convert_image_section__item mx-6">
        <div className="h-20 flex justify-center items-center">
          <img src={IMG_CONVERT} className="h-6" />
        </div>
        <div className="text-xl">&nbsp;&nbsp;</div>
      </div>
      <div className="page__home__component__convert_image_section__item">
        <img src={IMG_IOTEX} className="h-20" />
        <div className="text-xl font-normal">{lang.t('token.iotex')}</div>
      </div>
    </div>
  );
};
