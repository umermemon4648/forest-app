import React, { memo } from "react";

const ButtonPrimary = (props) => {
    return(
        <button
            onClick={() => props.handleClick()}
            className={`${props.rootClass} w-max sm:w-max md:w-max bg-colorPrimary text-colorFifth text-sm tracking-widest rounded-xl px-8 py-3 hover:shadow-lg hover:shadow-colorPrimary/20 hover:scale-[1.01] transition-all ease-in-out duration-150`}
        >
            {props.label}
        </button>
    );
};

export default memo(ButtonPrimary);