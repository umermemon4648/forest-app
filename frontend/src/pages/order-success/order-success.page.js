import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import { HeadingSecondary } from "../../element";

const OrderSuccess = () => {
    return (
        <div>
            <div className="w-11/12 max-w-[500px] m-auto flex flex-col items-center justify-center space-y-5 py-10">
                <Icon icon="icon-park-solid:success" className="w-16 h-16 text-colorPrimary" />

                <HeadingSecondary rootClass='text-colorSecondary text-center' text={'Your Order has been Placed successfully'} />

                <Link to="/login">
                    <p className="text-colorSecondary underline hover:decoration-2">View orders</p>
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
