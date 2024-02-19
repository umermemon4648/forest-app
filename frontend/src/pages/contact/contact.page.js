import React from "react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { HeadingSecondary } from "../../element";
import { Icon } from "@iconify/react";
import { JustTextImageSlider } from "../../component";
import sliderImageOne from '../../assets/images/mozambique-asset-10.webp';
import sliderImageTwo from '../../assets/images/mozambique-asset-11.webp';
import sliderImageThree from '../../assets/images/banner.webp';
import sliderImageFour from '../../assets/images/mangrove-forest.webp';

const Contact = () => {
    const slider = [
        {
            label: 'Plant',
            image: sliderImageOne
        },
        {
            label: 'Grow',
            image: sliderImageTwo
        },
        {
            label: 'Multiply',
            image: sliderImageThree
        },
        {
            label: 'Forest',
            image: sliderImageFour
        }
    ];

    return(
        <div>
            {/* contacts */}
            <div className="w-11/12 max-w-3xl m-auto pt-10 pb-20">
                <HeadingSecondary rootClass='text-colorSecondary text-[50px] sm:text-[68px]' text={'Contact us'} />
                <ul className="text-colorSecondaryLight tracking-wider space-y-5">
                    <li>
                        Didn't find the answer to your question on our <Link to='/faqs'><span className="text-colorSecondary underline hover:decoration-2">FAQ page</span></Link>?
                    </li>
                    <li>
                        Kindly email us at <a href="mailto:info@ourforest.co.za" className="text-colorSecondary underline hover:decoration-2">info@ourforest.co.za</a>
                    </li>
                    <li>
                        We will respond ASAP.
                    </li>
                    <li>
                        Alternatively, you can get in touch with us via our social media platforms.
                    </li>
                    <li>
                        <a href="https://www.instagram.com" target="_blank" className="w-max flex items-center space-x-2">
                            <Icon icon="uil:instagram" className="w-5 h-auto text-colorFourth" />
                            <span>Instagram </span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com" target="_blank" className="w-max flex items-center space-x-2">
                            <Icon icon="ic:baseline-facebook" className="w-5 h-auto text-colorFourth" />
                            <span>Facebook </span>
                        </a>
                    </li>
                </ul>
            </div>

            {/* slider */}
            <div>
                <JustTextImageSlider data={slider} />
            </div>
        </div>
    );
};

export default memo(Contact);