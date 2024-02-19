import React, { memo } from 'react';
import { HeadingFourth, HeadingTertiary } from '../../element';
import treePlanted from '../../assets/images/treePlanted.webp';
import tonnes from '../../assets/images/tonnes.webp';
import countries from '../../assets/images/countries.webp';

const OurImpact = () => {

  const data = {
    heading: 'Our impact to date',
    list: [
      { text: '8,433 trees planted', image: treePlanted },
      { text: '103.8 tonnes CO2 saved', image: tonnes },
      { text: '4 countries', image: countries }
    ]
  }

  return (
    <div className='space-y-6'>
      <HeadingTertiary rootClass='text-colorSecondary' text={data.heading} />

      {/* cards */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        {
          data.list.map((item, index) => (
            <div key={index} className='text-center p-4 space-y-6'>
              {/* image */}
              <div className='w-full aspect-square bg-cover bg-no-repeat bg-center rounded-full overflow-hidden' style={{ backgroundImage: `url(${item.image})` }}></div>
              {/* text */}
              <HeadingFourth rootClass='text-colorSecondary' text={item.text} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default memo(OurImpact);
