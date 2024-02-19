import React, { memo } from "react";

const TextPrimary = (props) => {
    return(
        <p className={`${props.rootClass} text-sm md:text-base leading-7 tracking-wider`}>{props.text}</p>
    );
};

export default memo(TextPrimary);