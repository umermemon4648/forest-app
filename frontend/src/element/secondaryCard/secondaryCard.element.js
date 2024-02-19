// SecondaryCardElement.js
import React from 'react';
import './secondaryCard.element.css';
import TitleElement from '../title/title.element';
import TertiaryButtonElement from '../tertiaryButton/tertiaryButton.element';
import TextElement from '../text/text.element';

const SecondaryCardElement = ({ imageUrl, heading, description, buttonLink, buttonText, isOdd }) => {
  // Determine the flex direction based on isOdd prop
  const flexDirection = isOdd ? 'row-reverse' : 'row';

  return (
    <div className={`secondary-card ${isOdd ? 'odd' : 'even'}`} style={{ flexDirection }}>
      <div className="secondary-card__image">
        <img src={imageUrl} alt={heading} loading="lazy" />
      </div>
      <div className="secondary-card__content">
        <TitleElement title={heading} />
        <TextElement text={description} />
        <TertiaryButtonElement title={buttonText} />
      </div>
    </div>
  );
};

export default SecondaryCardElement;
