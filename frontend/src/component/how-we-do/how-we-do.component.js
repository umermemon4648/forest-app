import React from 'react';
import './how-we-do.component.css';
import { useNavigate } from 'react-router-dom';
import imageOne from '../../assets/images/asset-01.webp';
import imageTwo from '../../assets/images/asset-02.webp';
import imageThree from '../../assets/images/asset-03.webp';
import imageFour from '../../assets/images/asset-04.webp';
import { CrossGridSectionSecondary } from '..';

const HowWeDo = () => {
  const navigate = useNavigate();
  const data = [
    {
        heading: 'Our Vision',
        text: 'We believe in creating a lasting legacy of positive change, by tackling one of the greatest issues of our generation - global warming.',
        image: imageOne,
        action: {
          label: 'About us',
          action: () => navigate('/about-us')
        }
    },
    {
        heading: 'Why trees',
        text: 'One of the biggest contributors to climate change is deforestation. Trees are natural carbon sinks that absorb CO2, so the the best mitigation is to reforest depleted regions. Over and above, they support vital ecosystems for wildlife and provide livelihoods for the local community.',
        image: imageTwo,
        action: {
          label: 'View trees',
          action: () => navigate('/collections/all')
        }
    },
    {
        heading: 'Why Africa?',
        text: 'The continent already faces significant challenges around food security and extreme weather conditions exacerbated by climate change. Africa has the biggest capacity for restoration that can bring about significant change.',
        image: imageThree,
        action: {
          label: 'View projects',
          action: () => navigate('/projects-and-countries')
        }
    },
    {
      heading: 'How we do it',
      text: 'We partner with various local communities and NGO’s in sub-Saharan African countries to reforest areas where the impact is greatest for the community and ecosystem at large.',
      image: imageFour,
      action: {
        label: 'View approach',
        action: () => navigate('/how-we-do-it')
      }
  }
];

  return (
    <>
      <CrossGridSectionSecondary data={data} />
    </>
  );
};

export default HowWeDo;
