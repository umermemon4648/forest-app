import React, { memo, useState } from "react";
import { Spinner } from "../../element";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemsToCart } from "../../actions/cartAction";
import useGetCountriesByIds from "../../hooks/useGetCountriesById";

const ProductCardPrimary = (props) => {
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { countries } = useGetCountriesByIds(props.product?.countries);

  const [cartLoading, _cartLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCartHandler = (paramId, priceToAdd) => {
    if (props.product?.productType === "subscription") {
      return navigate(`/product/${props.product?._id}`);
    }
    if (props.product?.productType === "variant") {
      return navigate(`/product/${props.product?._id}`);
    }
    dispatch(addItemsToCart(paramId, 1, priceToAdd));

    _cartLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      _cartLoading(false);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className={`${props.rootClass} text-center space-y-4 group`}>
      <Link to={`/product/${props.product?._id}`}>
        <div className="text-center space-y-4">
          {/* images */}
          <div className="relative w-full aspect-square bg-colorFifth rounded-xl shadow group-hover:shadow-2xl overflow-hidden transition-all ease-in-out duration-150">
            <div
              className="w-full h-full bg-no-repeat bg-center bg-cover opacity-100 group-hover:opacity-0 transition-all ease-in-out duration-300"
              style={{
                backgroundImage: `url(${
                  imageBaseUrl + props.product?.images[0]
                })`,
              }}
            ></div>
            {/* second images */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all ease-in-out duration-700"
              style={{
                backgroundImage: `url(${
                  props.product.images[1]
                    ? imageBaseUrl + props.product?.images[1]
                    : imageBaseUrl + props.product?.images[0]
                })`,
              }}
            ></div>
          </div>

          <div className="space-y-1">
            <h3 className="text-colorSecondary kalam text-xl font-bold tracking-wide">
              {props.product?.name}
            </h3>
            <ul className="text-colorSecondary text-xs font-light uppercase tracking-wide flex items-center justify-center divide-x divide-colorSecondaryLight ">
              {countries &&
                countries?.map((country) => (
                  <li key={country?._id} className="px-1">
                    {country?.name}
                  </li>
                ))}
            </ul>
            {props.product?.productType === "subscription" &&
              props.product.subscriptions.monthlyPrice && (
                <p className="text-colorSecondary text-base tracking-wide">
                  ${props.product.subscriptions.monthlyPrice + " USD"}
                </p>
              )}
            {props.product?.productType === "variant" &&
              props.product?.variants[0]?.options[0]?.price && (
                <p className="text-colorSecondary text-base tracking-wide">
                  $
                  {props.product &&
                    props.product.variants &&
                    props.product.variants[0] &&
                    props.product.variants[0].options[0]?.price + " USD"}
                </p>
              )}
            {props.product?.productType === "simple" &&
              props.product?.simple?.price && (
                <div className="flex items-center justify-center space-x-6">
                  <p
                    className={`text-colorSecondary text-base tracking-wide ${
                      props.product?.simple?.salePrice !== null &&
                      props.product?.simple?.salePrice !== undefined
                        ? "line-through"
                        : "no-underline"
                    }`}
                  >
                    $ {props.product?.simple?.price} USD
                  </p>

                  {props.product?.simple?.salePrice && (
                    <p className="text-colorSecondary text-base tracking-wide">
                      $ {props.product?.simple?.salePrice} USD
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>
      </Link>
      {props.showButton && (
        <button
          onClick={() => {
            const { product } = props;

            if (
              product?.productType !== "variant" &&
              product?.productType !== "subscription"
            ) {
              let priceToAdd;

              if (
                product?.productType === "simple" &&
                product?.simple?.salePrice !== null &&
                product?.simple?.salePrice !== undefined
              ) {
                priceToAdd = product?.simple?.salePrice;
              } else {
                priceToAdd = product?.simple?.price;
              }
              addToCartHandler(product?._id, priceToAdd);
            }
          }}
          className="buttonSecondary !w-full flex items-center justify-center border-4 border-purple-400"
        >
          {cartLoading ? (
            <Spinner rootClass="w-5 h-5" />
          ) : addedToCart ? (
            "Added to Cart"
          ) : props.product?.productType === "subscription" ? (
            <Link to={`/product/${props.product?._id}`}>Subscribe </Link>
          ) : props.product?.productType === "variant" ? (
            <Link to={`/product/${props.product?._id}`}>Send Gift </Link>
          ) : (
            "Add to Cart"
          )}
        </button>
      )}
    </div>
  );
};

ProductCardPrimary.defaultProps = {
  showButton: true,
};

export default memo(ProductCardPrimary);
