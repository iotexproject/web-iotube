import React, { useEffect } from 'react';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import './index.scss';
import { ConvertImageSection } from '../ConvertImageSection';

export const XRCERC = () => {
  return (
    <div>
      <ConvertImageSection isERCXRC={false} />
    </div>
  );
};
