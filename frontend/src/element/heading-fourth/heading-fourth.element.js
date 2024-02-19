import React, { memo } from "react";

const HeadingFourth = (props) => {
    return(
        <h3 className={`${props.rootClass} text-2xl font-bold tracking-wider kalam`}>{props.text}</h3>
    );
};

export default memo(HeadingFourth);