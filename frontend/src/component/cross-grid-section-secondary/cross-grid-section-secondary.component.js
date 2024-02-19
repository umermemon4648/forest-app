import React, { memo } from "react";
import { HeadingTertiary, TextPrimary } from "../../element";

const CrossGridSectionSecondary = (props) => {
    return (
        <div className="space-y-10 lg:space-y-10">
            {
                props.data.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 lg:grid-cols-2 group rounded-3xl lg:rounded-none overflow-hidden">
                        {/* image */}
                        <div className="lg:group-even:order-last">
                            {
                                item.image &&
                                <div className="w-full min-h-[300px] md:min-h-[460px] bg-cover bg-no-repeat bg-center overflow-hidden lg:group-odd:rounded-l-xl lg:group-even:rounded-r-xl" style={{ backgroundImage: `url(${item.image})` }}></div>
                            }
                        </div>

                        {/* content */}
                        <div className="flex flex-col justify-center bg-colorFourth text-left px-10 md:px-20 py-10 space-y-4 lg:group-odd:rounded-r-3xl lg:group-even:rounded-l-3xl">
                            <div>
                                {/* {
                                    props.showSteps &&
                                    <TextPrimary rootClass='text-colorSecondary text-xs lg:text-xs opacity-60' text={`STEP ${index + 1}`} />
                                } */}
                                {
                                    item.heading &&
                                    <HeadingTertiary rootClass='text-colorFifth leading-tight' text={item.heading} />
                                }
                            </div>
                            {
                                item.text &&
                                <TextPrimary rootClass='text-colorSixth' text={item.text} />
                            }
                            {
                                item.action &&
                                <button
                                    onClick={item.action.action}
                                    className="w-max text-colorSixth tracking-wider border border-colorSixth/20 hover:border-colorSixth/50 px-7 py-2.5 rounded-xl transition-all ease-in-out duration-150"
                                >{item.action.label}</button>
                            }
                            {/* {
                                item.li &&
                                <ul className="list-disc pl-10 space-y-1.5">
                                    {
                                        item.li.map((text, index) => (
                                            <li key={index} className="text-colorSecondary text-base tracking-wider">{text}</li>
                                        ))
                                    }
                                </ul>
                            }
                            {
                                item.action &&
                                <ButtonSecondary label={item.action.label} handleClick={item.action.action} />
                            } */}
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default memo(CrossGridSectionSecondary);