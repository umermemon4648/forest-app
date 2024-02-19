import React from 'react';
import './primaryCard.element.css';
import SecondaryButtonElement from '../secondaryButton/secondaryButton.element';
import TitleElement from '../title/title.element';
import TextElement from '../text/text.element';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
const PrimaryCardElement = ({ imageSrc, text, description, link, linkText }) => {
  return (
    <div className="primary-card content-container space-y-6 p-6">
      <div className="primary-card__image-wrapper">
        <img src={imageSrc} alt="" className="primary-card__image" />
      </div>
      <div className="text-left space-y-4">
        <h3 className='text-colorSecondary text-2xl font-bold kalam tracking-wider'>{text}</h3>
        {
          description &&
          <p className='text-colorSecondaryLight leading-loose tracking-wider'>{description}</p>
        }
        {
          link &&
          <div className='w-max'>
            <Link to={link}>
              <div className='w-max flex items-center space-x-1 text-colorFourth group'>
                <span>{linkText}</span>
                <Icon icon="carbon:arrow-right" className='group-hover:translate-x-1 transition-all ease-in-out duration-150' />
              </div>
            </Link>
          </div>
        }
      </div>
    </div>
  );
};

export default PrimaryCardElement;
