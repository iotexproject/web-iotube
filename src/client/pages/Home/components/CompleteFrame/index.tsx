import React from 'react';
import './index.scss';
import { Button } from 'antd';
import { useStore } from '../../../../../common/store';
import copy from 'copy-to-clipboard';

const IMG_COPY = require('../../../../static/images/icon_copy.png');

export const CompleteFrame = () => {
  const { lang } = useStore();
  const address = 'io1mheh7xep24yecw5ahym5k4ufn3k2ht5hkmp9ny';
  const onCopyAddress = () => {
    copy(address, { message: 'Copied!' });
  };
  return (
    <div className="page__home__component__complete_frame text-left p-3">
      <div></div>
      <div className="c-white text-lg font-normal">
        {lang.t('broadcast_transaction_successfully')}
      </div>
      <div className="c-gray font-thin mt-3">
        {lang.t('complete.tx_broadcast_network')}
      </div>
      <div className="c-gray font-normal flex items-center">
        <span>{address}</span>
        &nbsp;&nbsp;
        <img
          src={IMG_COPY}
          onClick={onCopyAddress}
          className="page__home__component__complete_frame__btn--copy cursor-pointer"
        />
      </div>
      <div className="c-white text-base font-normal mt-6">
        {lang.t('complete.your_tx')}
      </div>
      <div className="text-base font-light">
        <a className="page__home__component__complete_frame__link c-green">
          <u>
            3e84c6eeb48f590195beebe446c8cb2af7fc96156c4f6500abd1b288fee2311e
          </u>
        </a>
        &nbsp;&nbsp;
        <img
          src={IMG_COPY}
          className="page__home__component__complete_frame__btn--copy cursor-pointer"
        />
      </div>
      <div className="c-gray font-thin mt-3 mb-20">
        {lang.t('complete.check_status_comment')}
      </div>
      <Button className="page__home__component__complete_frame__btn--complete bg-green-10 w-full c-white">
        {lang.t('complete')}
      </Button>
    </div>
  );
};
