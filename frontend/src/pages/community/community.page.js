import React, { memo } from "react";
import { HeadingSecondary } from "../../element";
import { JustTextImageSlider } from "../../component";

const Community = () => {
    const data = {
        heading: 'Community',
        slider: [
            {
                label: 'Plant',
                image: 'https://www.ourforest.co.za/cdn/shop/files/20190821_Mozambique_0067_1.jpg?v=1688218627&width=900'
            },
            {
                label: 'Grow',
                image: 'https://www.ourforest.co.za/cdn/shop/files/20190822_Mozambique_0325.jpg?v=1689190639&amp;width=900'
            },
            {
                label: 'Multiply',
                image: 'https://www.ourforest.co.za/cdn/shop/files/Mozambique_1_copywm.jpg?v=1689190461&width=900'
            },
            {
                label: 'Forest',
                image: 'https://www.ourforest.co.za/cdn/shop/files/Mangrove_forest_from_above.jpg?v=1689190197&width=900'
            }
        ]
    };

    return (
        <div>
            {/* heading */}
            <div className="w-11/12 max-w-[1100px] m-auto py-20 text-center">
                <HeadingSecondary rootClass='text-colorSecondary text-[50px] sm:text-[68px]' text={data.heading} />
            </div>
            <div>
                <JustTextImageSlider data={data.slider} />
            </div>
        </div>
    );
};

export default memo(Community);