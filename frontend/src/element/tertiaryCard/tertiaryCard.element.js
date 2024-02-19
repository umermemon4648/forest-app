import React from 'react';
import './tertiaryCard.element.css'; // Rename the CSS file accordingly
import TitleElement from '../title/title.element';


const TertiaryCardElement = ({ imageSrc, title }) => { // Update the component name
  return (
    <div className="tertiary-card content-container"> {/* Update the class name */}
      <div className="tertiary-card__image-wrapper"> {/* Update the class name */}
        <img src={imageSrc} alt="" className="tertiary-card__image" /> {/* Update the class name */}
      </div>
      <div className="tertiary-card__info"> {/* Update the class name */}
        <TitleElement title={title} />
      </div>
    </div>
  );
};

export default TertiaryCardElement; // Update the export
