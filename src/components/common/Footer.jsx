import React from 'react';
import '../../styles/Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>
          서한 | 대구광역시 달서구 성서공단로 21길 50 | 대표전화: 053-589-7000 |
          사업자등록번호: 123-45-67890
        </p>
        <p className="footer__copyright">© 2024 Seohan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
