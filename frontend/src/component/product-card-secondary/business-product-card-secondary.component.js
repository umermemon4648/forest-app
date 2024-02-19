import React, { memo } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const BusinessProductCardSecondary = (props) => {
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  return (
    <div className="bg-colorSeventh rounded-3xl p-7">
      {/* image */}
      {props?.data?.image && (
        <div
          className="w-full aspect-square bg-cover bg-no-repeat bg-center rounded-full shadow-lg shadow-gray-100 overflow-hidden"
          style={{
            backgroundImage: `url(${props?.data?.image})`,
          }}
        ></div>
      )}

      {/* content */}
      <div className="space-y-4 pt-6">
        {props?.data?.heading && (
          <h3 className="text-colorSecondary kalam text-2xl font-bold tracking-wider">
            {props?.data?.heading}
          </h3>
        )}
        <div className="opacity-70 space-y-1.5">
          {props?.data?.text && (
            <p className="text-colorSecondary text-base font-light tracking-wide">
              {props?.data?.text}
            </p>
          )}
          {/* {
                        props.data.li &&
                        <ul className="text-colorSecondary text-sm sm:text-base">
                            {
                                props.data.li.map((text, index) => (
                                    <li key={index}>{text}</li>
                                ))
                            }
                        </ul>
                    } */}
        </div>

        {/* button */}
        {props?.data?._id && (
          <div>
            <Link to={`/product/${props?.data?._id}`}>
              <div className="w-max flex items-center space-x-2 group">
                <span className="text-base font-light">Start now</span>
                <Icon
                  icon="ph:arrow-right-thin"
                  className="group-hover:translate-x-1 transition-all ease-in-out duration-150"
                />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BusinessProductCardSecondary);
