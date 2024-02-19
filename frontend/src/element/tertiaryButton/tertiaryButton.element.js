import React from "react";
import "./tertiaryButton.element.css";

const TertiaryButtonElement = ({title}) => {
  return (
    <div className="buttontertiary">
      <button className="button button-tertiary">{title}</button>
    </div>
  );
};

export default TertiaryButtonElement;
