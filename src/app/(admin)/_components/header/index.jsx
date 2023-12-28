'use client';
import { HiMenuAlt1 } from 'react-icons/hi';

import BreadCrumb from '@/components/BreadCrumb';

export default function Header({ menuState, setMenuState }) {
  const handleMenuClass = () => {
    setMenuState(!menuState);
  };

  return (
    <header className="header gap-3 d-flex align-items-center app-container primary1BG header-height">
      <div className="hamburger">
        <div role="button" onClick={handleMenuClass}>
          <HiMenuAlt1 />
        </div>
      </div>
      <div className="page-heading">Visit</div>
      <div className="breadcrumb m-0 font-15">
        Home{' '}
        <span className="ml-1 ">
          <BreadCrumb />
        </span>
      </div>
    </header>
  );
}
