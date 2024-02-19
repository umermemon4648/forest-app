import React, { memo } from "react";

const ButtonSecondary = (props) => {
    return(
        <button
            onClick={() => props.handleClick()}
            className={`${props.rootClass} w-max bg-colorFifth border border-colorFourth/20 hover:border-colorFourth text-colorFourth text-sm tracking-widest rounded-xl px-6 sm:px-8 py-3 hover:shadow-lg hover:scale-[1.01] transition-all ease-in-out duration-150`}
        >
            {props.label}
        </button>
    );
};

export default memo(ButtonSecondary);