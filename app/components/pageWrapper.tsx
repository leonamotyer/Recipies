'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import Filters from './filters';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <Header />
      {!isHomePage && <Filters />}
      {children}
    </>
  );
}

