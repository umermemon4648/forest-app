import React, { memo } from "react";

const Ul = (props) => {
    return (
        <ul className="list-disc space-y-1.5">
            {
                props.list.map((text, index) => (
                    <li key={index} className={`${props.rootClass} text-colorSecondary text-base tracking-wider`}>{text}</li>
                ))
            }
        </ul>
    );
};

export default memo(Ul);