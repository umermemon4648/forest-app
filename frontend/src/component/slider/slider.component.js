import React, { useEffect } from 'react';
import _ from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { HeadingSecondary, Spinner } from '../../element';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../actions/productAction';
import { ProductCardPrimary } from '..';
import { Icon } from '@iconify/react';

const SliderComponent = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProduct(1, [0, 25000], 'all', 0));
  }, []);

  return (
    <div>
      <div className='w-11/12 max-w-[1100px] m-auto py-20 space-y-16'>
        <div className='space-y-3'>
          <h2 className='text-colorSecondary text-4xl font-bold text-left kalam'>Featured trees</h2>
          <p className='text-colorSecondaryLight tracking-wider'>Explore our multitude of trees from countries across the African continent</p>
        </div>

        {
          loading &&
          <div className="flex items-center justify-center">
            <Spinner rootClass='w-20 h-20' />
          </div>
        }

        {/* empty */}
        {
          !loading && (_.isEmpty(products) || _.isUndefined(products)) &&
          <div>
            <HeadingSecondary rootClass='text-colorSecondary' text={'No products found!'} />
          </div>
        }

        {/* slider */}
        {
          !loading && (!_.isEmpty(products) || !_.isUndefined(products)) &&
          <div>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: '#swiper-button-prev',
                nextEl: '#swiper-button-next',
              }}
              pagination={{
                el: '.swiper-paginations',
                type: 'fraction',

              }}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 30
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 40
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 40
                },
              }}
              className="mySwiper"
            >

              {
                products && products.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCardPrimary key={product._id} product={product} showButton={false} />
                  </SwiperSlide>
                ))
              }
            </Swiper>
            <div className='flex items-center justify-center text-colorSecondaryLight text-xs space-x-6 mt-5'>
              <div id='swiper-button-prev'>
                <Icon icon="octicon:chevron-left-24" className='w-4 h-4 cursor-pointer' />
              </div>
              <div>
                <div className="swiper-paginations"></div>
              </div>
              <div id='swiper-button-next'>
                <Icon icon="octicon:chevron-right-24" className='w-4 h-4 cursor-pointer' />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default SliderComponent;
