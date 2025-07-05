import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import { Footer } from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // ✅ Hide navbar & footer on any /dashboard routes
  const hideLayout = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-light text-dark dark:bg-dark dark:text-light">
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};