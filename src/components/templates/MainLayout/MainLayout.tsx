import React from 'react';
import Header from '@src/components/organisms/Header/Header';
import Footer from '@src/components/organisms/Footer/Footer';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

export default MainLayout;
