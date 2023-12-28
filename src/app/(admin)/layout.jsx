'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/utils/constants/routes.constants';
import InitialApiCall from '@/helpers/InitialApiCall';
import Header from './_components/header';
import Sidebar from './_components/sidebar';

export default function AdminPanelLayoutLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

const MainLayout = ({ children }) => {
  const [menuState, setMenuState] = useState(window.innerWidth < 850);

  const pathname = usePathname();
  function getChildren() {
    if (pathname.includes(ROUTES.VISITS.BASE + ROUTES.FEEDBACK)) {
      return children;
    }
    return (
      <div className="d-flex">
        <Sidebar menuState={menuState} setMenuState={setMenuState} />
        <main className="h-v100">
          <Header menuState={menuState} setMenuState={setMenuState} />
          <div className="afterHeaderMargin" />
          <div className="visit-table">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <>
      <InitialApiCall />
      {getChildren()}
    </>
  );
};
