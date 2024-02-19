import React, { useState } from "react";
// import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.webp";
import { Icon } from '@iconify/react';
import "./header.component.css";
import { DropdownCountries, DropdownMenu } from "../../element";
import { Link } from "react-router-dom";

const Header = () => {
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    value: "IL",
    currency: "USD $",
    name: "Israel",
  });
  const [mobileMenuActive, setMobileMenuActive] = useState(false);

  const handleAboutDropdownToggle = () => setShowAboutDropdown(!showAboutDropdown);
  const handleCurrencyDropdownToggle = () => setShowCurrencyDropdown(!showCurrencyDropdown);
  const handleDropdownClose = () => {
    setShowAboutDropdown(false);
    setShowCurrencyDropdown(false);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCurrencyDropdown(false);
  };

  const toggleMobileMenu = () => setMobileMenuActive(!mobileMenuActive);
  const closeMobileMenu = () => setMobileMenuActive(false);

  const menuItems = [
    { label: "Plant", path: "/collections/all" },
    { label: "About", dropdown: true },
    { label: "Business", path: "/for-business" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact" },
    { label: "Currency", dropdown: true },
  ];

  const renderMenuItems = (isMobile) => {
    return menuItems.map((item, index) => (
      <React.Fragment key={index}>
        {item.dropdown ? (
          <div
            className={`menu-item ${showAboutDropdown && item.label === "About" ? "open" : ""} ${showCurrencyDropdown && item.label === "Currency" ? "open" : ""}`}
            onMouseEnter={() => handleAboutCurrencyDropdownToggle(item.label)}
            onMouseLeave={handleDropdownClose}
          >
            <span className={item.label === "Currency" ? "localization-form__currency" : ""}>
              {item.label === "Currency" ? `${selectedCountry.currency} | ` : ""}
            </span>
            {item.label}
            <Icon icon="iconamoon:arrow-down-2-thin" className={`angle-icon ${showAboutDropdown && item.label === "About" ? "open" : ""} ${showCurrencyDropdown && item.label === "Currency" ? "open" : ""}`} />
            {/* <FontAwesomeIcon icon={faAngleDown} className={`angle-icon ${showAboutDropdown && item.label === "About" ? "open" : ""} ${showCurrencyDropdown && item.label === "Currency" ? "open" : ""}`} /> */}
            {showAboutDropdown && item.label === "About" && <DropdownMenu onClose={handleDropdownClose} />}
            {showCurrencyDropdown && item.label === "Currency" && <DropdownCountries selectedCountry={selectedCountry} onSelect={handleCountrySelect} onClose={() => setShowCurrencyDropdown(false)} />}
          </div>
        ) : (
          <Link key={index} to={item.path}>
            {item.label}
          </Link>
          // <a key={index} href={item.path}>{item.label}</a>
          // <Link key={index} to={item.path}>
          //   {item.label}
          // </Link>
        )}
      </React.Fragment>
    ));
  };

  const handleAboutCurrencyDropdownToggle = (label) => {
    if (label === "About") {
      setShowAboutDropdown(true);
      setShowCurrencyDropdown(false);
    } else if (label === "Currency") {
      setShowCurrencyDropdown(true);
      setShowAboutDropdown(false);
    }
  };

  return (
    <header className="header">
      <div className="header-component">
        <div className="mobile-header">
          <div className="mobile-menu-button" onClick={toggleMobileMenu}>
            <Icon icon="circum:menu-burger" />
            {/* <FontAwesomeIcon icon={faBars} /> */}
          </div>
        </div>
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>

        <nav className={`menu ${mobileMenuActive ? "mobile-active" : ""}`}>
          <div className="mainmenu">
            <Link to="/collections/all">Plant</Link>
            <div className={`menu-item flex ${showAboutDropdown ? "open" : ""}`} onMouseEnter={handleAboutDropdownToggle} onMouseLeave={handleDropdownClose}>
              <p> <span>About</span> </p>
              <Icon icon="iconamoon:arrow-down-2-thin" className={`angle-icon ${showAboutDropdown ? "open" : ""}`} />
              {/* <FontAwesomeIcon icon={faAngleDown} className={`angle-icon ${showAboutDropdown ? "open" : ""}`} /> */}
              {showAboutDropdown && <DropdownMenu onClose={handleDropdownClose} />}
            </div>
            <a href="/for-business">Business</a>
            <a href="/faq">FAQ</a>
            <a href="/contact">Contact</a>
          </div>

          <div className={`currmenu ${showCurrencyDropdown ? "open" : ""}`}>
            <div className={`menu-item flex ${showCurrencyDropdown ? "open" : ""}`} onMouseEnter={handleCurrencyDropdownToggle} onMouseLeave={handleDropdownClose}>
              <a href="/">  <span className="localization-form__currency">{selectedCountry.currency} | {selectedCountry.name}  </span> </a>
              <Icon icon="iconamoon:arrow-down-2-thin" className={`angle-icon ${showCurrencyDropdown ? "open" : ""}`} />
              {/* <FontAwesomeIcon icon={faAngleDown} className={`angle-icon ${showCurrencyDropdown ? "open" : ""}`} /> */}
              {showCurrencyDropdown && <DropdownCountries selectedCountry={selectedCountry} onSelect={handleCountrySelect} onClose={() => setShowCurrencyDropdown(false)} />}
            </div>
          </div>
        </nav>

        <div className={`extra ${mobileMenuActive ? "mobile-active" : ""}`}>
          <div className="header-icons">
            <span className="icon search-icon">
              <Icon icon="fluent:search-28-regular" />
            </span>
            <Link to='/login'>
              <span className="icon user-icon">
                <Icon icon="heroicons:user" />
              </span>
            </Link>
            <span className="icon cart-icon">
              <Icon icon="ion:bag-handle-outline" />
            </span>
          </div>
        </div>
      </div>
      <nav className={`mobile-menu ${mobileMenuActive ? "open" : ""}`}>
        <div className="mobile-menu-items">

          <div className="mobile-close-button" onClick={closeMobileMenu}>
            <Icon icon="ph:x-light" />
            {/* <FontAwesomeIcon icon={faTimes} /> */}
          </div>
          {renderMenuItems(true)}

        </div>
      </nav>
    </header>
  );
};

export default Header;
