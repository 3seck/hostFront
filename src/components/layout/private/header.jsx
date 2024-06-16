import React, { useState } from 'react';
import { Nav } from './Nav';

export const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);

  const handleToggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleNavItemClick = () => {
    setIsNavVisible(false);
  };

  return (
    <header className={`layout__navbar ${isNavVisible ? 'navbar-expanded' : 'navbar-collapsed'}`}>
      <div className="navbar__header">
        <a href="#" className="navbar__title" onClick={handleToggleNav}>Postter</a>
      </div>
      {isNavVisible && <Nav onNavItemClick={handleNavItemClick} />}
    </header>
  );
};
