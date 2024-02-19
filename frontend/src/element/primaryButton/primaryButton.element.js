import React from "react";
import "./primaryButton.element.css";

const PrimaryButtonElement = ({title}) => {
  return (
    <div className="buttonprimary">
      <button className="button button-primary">{title}</button>
    </div>
  );
};

export default PrimaryButtonElement;
