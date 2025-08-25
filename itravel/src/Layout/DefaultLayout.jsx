import { useState } from 'react';
import { Outlet } from 'react-router';
import {
  useScreenSize,
  useIsMobile,
  useIsDesktop,
  useBreakpoint,
} from '../hooks/useScreenSize';

import DockBar from '../components/DockBar';
import NavbarDesktop from '../components/NavbarDesktop';

export default function DefaultLayout() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  if (isMobile) {
    return (
      <>
        <Outlet />
        <DockBar></DockBar>
      </>
    );
  }

  return (
    <>
      <div className='relative bg-[#1e1e1e]'>
        <NavbarDesktop></NavbarDesktop>

        <Outlet></Outlet>
      </div>
    </>
  );
}
