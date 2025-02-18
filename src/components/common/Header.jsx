import React from 'react';
import '../../styles/Header.scss';
import logoImage from '/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-wrapper">
          <img src={logoImage} alt="Seohan" className="header__logo" />
        </div>
      </div>
    </header>
  );
};

export default Header;
