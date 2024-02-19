import React, { memo } from "react";
import { HeadingSecondary, TextPrimary } from "../../element";

const CarbonFootprint = () => {
    return (
        <div className="bg-colorFourth flex items-center justify-center p-10">
            <div className="w-full max-w-3xl text-center space-y-5">
                <HeadingSecondary rootClass='text-colorFifth' text='Not sure which option is best?' />
                <TextPrimary rootClass='text-colorSixth' text='Calculate your environmental footprint with our carbon calculator to find the appropriate option for your needs.' />

                {/* button */}
                <button disabled className="buttonSecondary">Calculate footprint</button>
            </div>
        </div>
    );
};

export default memo(CarbonFootprint);