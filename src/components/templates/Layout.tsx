import React from 'react';
import Header from '../organisms/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>
        aafdfadfd
        {children}
      </main>
      {/* Footer can be added here */}
    </div>
  );
};

export default Layout;
