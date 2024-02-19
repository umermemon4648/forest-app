import React from "react";
import { Link } from "react-router-dom";
const dropdownItems = [
  { label: "About Us", link: "/about-us" },
  { label: "Projects and countries", link: "/projects-and-countries" },
  { label: "How we do it", link: "/how-we-do-it" },
  { label: "Community", link: "/community" },
];

const DropdownMenu = ({ onClose }) => {
  return (
    <div className="dropdown-menu" onMouseLeave={onClose}>
      <ul>
        {dropdownItems.map((item, index) => (
          <li key={index}>
            <Link to={item.link}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;

