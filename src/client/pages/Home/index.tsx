import React from 'react';
import { useObserver } from 'mobx-react-lite';
import './index.scss';
import { ClientOnly } from '../../components';
import { ERCXRC, XRCERC, FlipHeader, CompleteFrame } from './components';
import { useStore } from '../../../common/store';
import { CARD_XRC20_ERC20 } from '../../../common/store/base';

export const Home = () => {
  const { base } = useStore();

  return useObserver(() => (
    <ClientOnly>
      <div className="page__home">
        <div className="page__home__content app_frame">
          {base.showComplete ? (
            <div className="bg-primary p-4 rounded app_frame_shadow">
              <CompleteFrame />
            </div>
          ) : (
            <div
              className={`flip_card ${
                base.mode === CARD_XRC20_ERC20 ? 'flip_card--flipped' : ''
              }`}
            >
              <div className="flip_card__inner">
                <div className="flip_card--front bg-primary app_frame_shadow">
                  <div className="bg-primary p-4 rounded">
                    <FlipHeader onFlip={base.flipMode} />
                    <ERCXRC />
                  </div>
                </div>
                <div className="flip_card--back bg-primary app_frame_shadow">
                  <div className="bg-primary p-4 rounded">
                    <FlipHeader onFlip={base.flipMode} />
                    <XRCERC />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  ));
};
