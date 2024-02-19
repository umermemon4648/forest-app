import React, { memo } from "react";

const HeadingSecondary = (props) => {
    return(
        <h2 className={`${props.rootClass} text-[28px] sm:text-[34px] font-bold tracking-wide kalam`}>{props.text}</h2>
    );
};

export default memo(HeadingSecondary);