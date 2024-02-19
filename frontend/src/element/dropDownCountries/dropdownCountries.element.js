import React from "react";
const DropdownCountries = ({ selectedCountry, onSelect, onClose }) => {
  const dropdownCountries = [
    { value: "AU", currency: "USD $", name: "Australia" },
    { value: "AT", currency: "USD $", name: "Austria" },
    { value: "BE", currency: "USD $", name: "Belgium" },
    { value: "CA", currency: "USD $", name: "Canada" },
    { value: "CZ", currency: "USD $", name: "Czechia" },
    { value: "DK", currency: "USD $", name: "Denmark" },
    { value: "FI", currency: "USD $", name: "Finland" },
    { value: "FR", currency: "USD $", name: "France" },
    { value: "DE", currency: "USD $", name: "Germany" },
    { value: "HK", currency: "USD $", name: "Hong Kong SAR" },
    { value: "IE", currency: "USD $", name: "Ireland" },
    { value: "IL", currency: "USD $", name: "Israel" },
    { value: "IT", currency: "USD $", name: "Italy" },
    { value: "JP", currency: "USD $", name: "Japan" },
    { value: "MY", currency: "USD $", name: "Malaysia" },
    { value: "NL", currency: "USD $", name: "Netherlands" },
    { value: "NZ", currency: "USD $", name: "New Zealand" },
    { value: "NO", currency: "USD $", name: "Norway" },
    { value: "PL", currency: "USD $", name: "Poland" },
    { value: "PT", currency: "USD $", name: "Portugal" },
    { value: "SG", currency: "USD $", name: "Singapore" },
    { value: "ZA", currency: "USD $", name: "South Africa" },
    { value: "KR", currency: "USD $", name: "South Korea" },
    { value: "ES", currency: "USD $", name: "Spain" },
    { value: "SE", currency: "USD $", name: "Sweden" },
    { value: "CH", currency: "USD $", name: "Switzerland" },
    { value: "AE", currency: "USD $", name: "United Arab Emirates" },
    { value: "GB", currency: "USD $", name: "United Kingdom" },
    { value: "US", currency: "USD $", name: "United States" }
  ];

  return (
    <div className="dropdown-container">
      <div className="dropdown-countries" onMouseLeave={onClose}>
        <ul>
          {dropdownCountries.map((country, index) => (
            <li key={index}>
              <a
                className={`link link--text dropdown-link ${
                  selectedCountry === country ? "selected" : ""
                }`}
                href="/"
                onClick={() => onSelect(country)}
              >
                <span className="localization-form__currency">
                  {country.currency} |
                </span>
                {country.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownCountries;

