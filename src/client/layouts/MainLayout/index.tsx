import React, { useEffect } from 'react';
import './index.scss';
import { Header } from '../../components';

interface IComponentProps {
  children: Array<JSX.Element> | JSX.Element;
}

export const MainLayout = (props: IComponentProps) => {
  return (
    <div className="layout__main h-screen">
      <Header />
      <div className="layout__main__content h-full text-center pt-10 sm:pt-10 md:pt-12 lg:pt-16">
        {props.children}
      </div>
    </div>
  );
};
