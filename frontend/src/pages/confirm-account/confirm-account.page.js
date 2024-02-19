import React, { memo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { HeadingSecondary } from "../../element";
import { Link } from "react-router-dom";

const ConfirmAccount = () => {
    useEffect(() => {
        localStorage.removeItem("confirmEmail");
    }, []);
    
    return(
        <div>
            <div className="w-11/12 max-w-[500px] m-auto flex flex-col items-center justify-center space-y-5 py-10">
                <Icon icon="icon-park-solid:success" className="w-16 h-16 text-colorPrimary" />

                <HeadingSecondary rootClass='text-colorSecondary text-center' text={'Your Account has been Confirmed'} />

                <Link to="/login">
                    <p className="text-colorSecondary underline hover:decoration-2">Login now</p>
                </Link>
            </div>
        </div>
    );
};

export default memo(ConfirmAccount);