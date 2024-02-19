import React, { memo } from "react";

const InputField = (props) => {
    return(
        <input
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            required
            disabled={props.disabled}
            onChange={props.onChange}
            className={`${props.rootClass} ${props.icon ? 'pl-4 pr-10 py-2.5' : 'px-4 py-2.5'} w-full appearance-none bg-colorSeventh text-colorFourth placeholder:text-colorSecondary tracking-wider border border-colorSecondary/60 focus:border-colorSecondary focus:outline-none ring-1 ring-transparent focus:ring-colorSecondary rounded-xl`}
        />
    );
};

InputField.defaultProps = {
    icon: false
};

export default memo(InputField);