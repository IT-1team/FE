import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Header.scss';
import logoImage from '/logo.png';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };
  return (
    <header className="header">
      <div className="header__container">
        <div
          className="header__logo-wrapper"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={logoImage} alt="Seohan" className="header__logo" />
        </div>
      </div>
    </header>
  );
};

export default Header;
