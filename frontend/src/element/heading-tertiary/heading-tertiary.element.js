import React, { memo } from "react";

const HeadingTertiary = (props) => {
  return (
    <h3
      className={`${props.rootClass}  text-4xl md:text-[50px] tracking-wider font-bold kalam`}
    >
      {props.text}
    </h3>
  );
};

export default memo(HeadingTertiary);
