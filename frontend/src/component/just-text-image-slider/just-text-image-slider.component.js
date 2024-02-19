import React, { memo, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { HeadingTertiary } from "../../element";
import { Icon } from '@iconify/react';
import './just-text-image-slider.component.css';

const JustTextImageSlider = (props) => {
    const [autoPlay, setAutoPlay] = useState(false);

    return (
        <div className="JustTextImageSliderCss relative">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{
                    prevEl: '#swiper-action-prev',
                    nextEl: '#swiper-action-next',
                }}
                pagination={{
                    el: '.swiper-paginations',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '"></span>';
                    },
                }}
                autoplay={{ delay: 5000, waitForTransition: autoPlay }}
                className="mySwiper"

            >
                {
                    props.data.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative">
                                <div className="relarive w-full h-[340px] md:h-[560px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${item.image})` }}></div>
                                {
                                    item.label &&
                                    <div className="md:absolute inset-0 bg-colorFourth md:bg-transparent text-center w-full h-max p-10 m-auto">
                                        <HeadingTertiary rootClass='text-colorFifth' text={item.label} />
                                    </div>
                                }
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <div className="w-full flex items-center justify-center border-b border-colorSecondary/10 space-x-2">
                <div id="swiper-action-prev" className="p-3 cursor-pointer text-colorSecondary/60">
                    <Icon icon="mdi-light:chevron-left" className="text-xl" />
                </div>
                <div className="">
                    <div className="swiper-paginations"></div>
                </div>
                <div id="swiper-action-next" className="p-3 cursor-pointer text-colorSecondary/60">
                    <Icon icon="mdi-light:chevron-right" className="text-xl" />
                </div>
                <div onClick={() => setAutoPlay(!autoPlay)} className="p-3 border-l border-colorSecondary/10 text-colorSecondary/80 cursor-pointer">
                    <Icon icon={`${autoPlay ? 'teenyicons:pause-outline' : 'bi:play-fill'}`} />
                </div>
            </div>
        </div>
    );
};

export default memo(JustTextImageSlider);