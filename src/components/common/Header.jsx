import React from 'react';
import '../../styles/Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-wrapper">
          <img
            src="../../src/assets/logo.png"
            alt="Seohan"
            className="header__logo"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
