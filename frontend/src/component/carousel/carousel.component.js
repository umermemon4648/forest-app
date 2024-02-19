import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './carousel.component.css';
import { Link } from 'react-router-dom';

const slideData = [
  {
    imageUrl: '//www.ourforest.co.za/cdn/shop/files/UNADJUSTEDNONRAW_thumb_2f8.jpg?v=1688217325',
    heading: 'From desertification...',
    buttonText: 'How we do it',
    buttonLink: '/how-we-do-it'
  },
  {
    imageUrl: '//www.ourforest.co.za/cdn/shop/files/UNADJUSTEDNONRAW_thumb_2f8.jpg?v=1688217325',
    heading: 'To thriving ecosystems',
    buttonText: 'How we do it',
    buttonLink: '/how-we-do-it'
  }
];


const Carousel = () => {
  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        pagination={{
          el: '.swiper-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
          },
        }}
        autoplay={{ delay: 5000 }}
        className="mySwiper"

      >
        {slideData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide">
              <img src={slide.imageUrl} alt="" className="slide-image" />
              <div className="slide-content">
                <h3 className='kalam'>{slide.heading}</h3>
                <div className="flex items-center justify-center">
                  <Link to={slide.buttonLink}>
                    <div className="buttonPrimary">{slide.buttonText}</div>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="buttons-container">

        <div className="swiper-button-prev"></div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-next"></div>


      </div>
    </div>
  );
};

export default Carousel;