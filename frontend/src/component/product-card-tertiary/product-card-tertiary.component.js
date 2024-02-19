import React, { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getOrderItemsByEmail } from "../../actions/orderAction";
import { useAuth } from "../../hooks";
const ProductCardTertiary = (props) => {
  const isAuth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderItems, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  return (
    <Link to={`/product/${props.product._id}`}>
      <div className={`${props.rootClass} text-center space-y-4 group`}>
        {/* images */}
        <div className="relative w-full aspect-square bg-colorFifth rounded-xl shadow group-hover:shadow-2xl overflow-hidden transition-all ease-in-out duration-150">
          <div
            className="w-full h-full bg-no-repeat bg-center bg-cover opacity-100 group-hover:opacity-0 transition-all ease-in-out duration-300"
            style={{
              backgroundImage: `url(${imageBaseUrl + props.product.images[0]})`,
            }}
          ></div>
          {/* second images */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all ease-in-out duration-700"
            style={{
              backgroundImage: `url(${
                props.product.images[1]
                  ? imageBaseUrl + props.product.images[1]
                  : imageBaseUrl + props.product.images[0]
              })`,
            }}
          ></div>
        </div>

        <div className="space-y-1">
          <h3 className="text-colorSecondary kalam text-xl font-bold tracking-wide">
            {props.product.name}
          </h3>
          {/* <p className="text-colorSecondary text-xs font-light uppercase tracking-wide">Our Forest</p> */}
          {props.product.productType === "variant" &&
            props.product?.variants[0]?.options[0]?.price && (
              <p className="text-colorSecondary text-base tracking-wide">
                $ {props.product?.variants[0]?.options[0]?.price} USD
              </p>
            )}
          {props.product.productType === "simple" &&
            props.product?.simple?.price && (
              <p className="text-colorSecondary text-base tracking-wide">
                $ {props.product?.simple?.price} USD
              </p>
            )}
        </div>
        {/* <ButtonSecondary rootClass='!w-full' label='Choose options' handleClick={() => alert('clicked')} /> */}
      </div>
    </Link>
  );
};

export default memo(ProductCardTertiary);
