import React, { useEffect, useState, useRef } from "react";
import _, { map } from "lodash";
import { HeadingTertiary, Spinner } from "../../element";
import { ProductCardTertiary } from "../../component";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getProduct,
  getProductDetails,
} from "../../actions/productAction";
import {
  addItemsToCart,
  buyNowItem,
  removeItemsFromCart,
  buySubscribeItem,
} from "../../actions/cartAction";
import { useNavigate, useParams, Link } from "react-router-dom";
import useGetCountriesByIds from "../../hooks/useGetCountriesById";
import defaultImage from "../../assets/images/default-image.webp";
import { Disclosure } from "@headlessui/react";
import { Tooltip } from "react-tooltip";
import axios from "axios";

const ProductDetail = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const buttonRef = useRef(null);
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  let { id: paramId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const checkGift = _.includes(product?.name?.toLowerCase(), "gift");

  const [giftItem, _giftItem] = useState({});
  const [recipientError, _recipientError] = useState(false);

  const handleRecipentData = (e) => {
    _giftItem({ ...giftItem, [e.target.name]: e.target.value });
  };

  const { countries } = useGetCountriesByIds(product?.countries);

  const { products } = useSelector((state) => state.products);

  const [quantity, setQuantity] = useState(1);
  const [cartLoading, _cartLoading] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [monthlyPriceId, setMonthlyPriceId] = useState(null);
  const [yearlyPriceId, setYearlyPriceId] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(15);
  const [monthlyDelivery, setMonthlyDelivery] = useState(0);
  const [yearlyDelivery, setYearlyDelivery] = useState(0);
  const [selectSubscriptionType, setSelectSubscriptionType] =
    useState("monthly");

  const [actualPrice, setActualPrice] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [variant, setVariant] = useState(null);
  const [discount, setDiscount] = useState(null);

  const frequencyChangeHandler = (e) => {
    const selectedFreq = parseFloat(e.target.value);

    setSelectedFrequency(selectedFreq);
    setSelectedPrice(selectedFreq);
    const selectedType =
      selectedFreq == parseFloat(monthlyDelivery) ? "monthly" : "yearly";
    // console.log("selected Price: ", e.t);
    // console.log("selected type: ", selectedType);
  };

  const addToCartHandler = () => {
    if (
      checkGift &&
      giftItem &&
      giftItem.hasOwnProperty("recipientEmail") &&
      !_.isEmpty(giftItem.recipientEmail)
    ) {
      // if (checkGift && giftItem && !_.isEmpty(giftItem?.recipientEmail)) {

      dispatch(
        addItemsToCart(
          paramId,
          quantity,
          selectedPrice,
          selectedStock,
          giftItem
        )
      );
      _cartLoading(true);
      setTimeout(() => {
        _cartLoading(false);
      }, 1000);
    } else {
      if (product?.productType == "variant" && variant == null) {
        setVariant(product?.variants[0].options[0]);
        console.log(product?.variants[0].options[0]);
      }
      dispatch(
        addItemsToCart(paramId, quantity, selectedPrice, selectedStock, variant)
      );
      _cartLoading(true);
      setTimeout(() => {
        _cartLoading(false);
      }, 1000);
    }
  };
  const subscribeHandler = async () => {
    try {
      let couponApplicable = false;
      if (selectedFrequency !== actualPrice) {
        couponApplicable = true;
      }

      if (isAuthenticated) {
        await dispatch(
          buySubscribeItem(
            paramId,
            quantity,
            selectedStock,
            actualPrice,
            monthlyPriceId,
            yearlyPriceId,
            couponApplicable
          )
        );
        navigate("/checkout");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const buyNowHandler = async () => {
    try {
      await dispatch(buyNowItem(paramId, quantity));
      navigate("/checkout");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(paramId));
    dispatch(getProduct(1, [0, 25000], "all", 0));
  }, [dispatch, paramId, error, loading]);
  // console.log("discount===========>", discount);
  useEffect(() => {
    if (
      product &&
      product?.productType === "variant" &&
      product?.variants[0]?.options[0]?.price
    ) {
      setSelectedPrice(product?.variants[0]?.options[0]?.price);
      setSelectedStock(product?.variants[0]?.options[0]?.stock);
    }

    if (product?.productType === "subscription" && product?.subscriptions) {
      if (product?.subscriptions?.monthlyPriceId) {
        setMonthlyPriceId(product?.subscriptions?.monthlyPriceId);
        setSelectedPrice(product?.subscriptions?.monthlyPrice);
      } else {
        setSelectedPrice(product?.subscriptions?.yearlyPrice);
        setYearlyPriceId(product?.subscriptions?.yearlyPriceId);
        setYearlyPriceId(null);
      }
      setSelectedStock(false);
    }

    if (
      product?.simple &&
      product?.simple?.salePrice !== null &&
      product?.simple?.salePrice !== undefined
    ) {
      setSelectedPrice(product?.simple?.salePrice);
    } else if (product?.simple && !product?.simple?.salePrice) {
      setSelectedPrice(product?.simple?.price);
    }
  }, [product]);
  useEffect(() => {
    if (product?.productType === "subscription" && discount) {
      setSelectedPrice(product?.subscriptions?.monthlyPrice);
      setSelectedStock(false);
      setMonthlyPriceId(product?.subscriptions?.monthlyPriceId);
      setYearlyPriceId(null);
      setMonthlyDelivery(product?.subscriptions?.monthlyPrice);
      setYearlyDelivery(
        product?.subscriptions?.monthlyPrice -
          product?.subscriptions?.monthlyPrice * discount
      );
      setActualPrice(product?.subscriptions?.monthlyPrice);
    }
    if (product?.productType === "variants") {
      setVariant(product?.variants[0].options[0]);
    }
  }, [product?.productType, discount]);
  useEffect(() => {
    const getCouponsDiscount = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/v1/getCouponList`);
        console.log("got you here");
        if (res?.data?.success === true && res?.data?.coupons?.length > 0) {
          console.log(
            "res.data.coupons[0].percent_off",
            res.data.coupons[0].percent_off
          );
          setDiscount(Number(res?.data?.coupons[0]?.percent_off) / 100);
        }
      } catch (error) {
        // Handle error if any
        console.error(error.message);
      }
    };

    getCouponsDiscount();
  }, [discount]);
  console.log("discount : ", discount);
  console.log("actuall : ", actualPrice);
  const radius = 50;
  // const discount = 10 / 100;
  return (
    <div>
      {/* loading */}
      {loading && (
        <div className="flex items-center justify-center py-10 sm:py-20">
          <Spinner rootClass="w-20 h-20" />
        </div>
      )}
      {/* product detail */}
      {!loading && (
        <div className="w-11/12 max-w-[1100px] m-auto py-10 sm:py-20">
          {/* product detail */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-14">
            {/* images */}
            <div className="md:col-span-6 lg:col-span-7 space-y-6 md:space-y-12">
              {product?.images && (
                <>
                  {/* main image */}
                  <div>
                    <img
                      className="w-full h-auto rounded-3xl shadow-2xl"
                      src={imageBaseUrl + product.images[0]}
                      // src={'https://www.ourforest.co.za/cdn/shop/files/Mango.jpg?v=1686491507&width=713'}
                      alt={product.name}
                    />
                  </div>

                  {/* short image */}
                  <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
                    {product.images.slice(1).map((image) => (
                      <div
                        key={image._id}
                        className="w-full h-auto rounded-3xl overflow-hidden shadow-2xl"
                      >
                        <img
                          className="w-full h-auto"
                          src={imageBaseUrl + image}
                          alt={product.name}
                        />
                      </div>
                    ))}
                    {/* <div className="w-full h-auto rounded-3xl overflow-hidden shadow-2xl">
                                    <img className="w-full h-auto" src="https://www.ourforest.co.za/cdn/shop/files/Mango.jpg?v=1686491507&width=713" alt="mango" />
                                </div>
                                <div className="w-full h-auto rounded-3xl overflow-hidden shadow-2xl">
                                    <img className="w-full h-auto" src="https://www.ourforest.co.za/cdn/shop/files/Mango.jpg?v=1686491507&width=713" alt="mango" />
                                </div> */}
                  </div>
                </>
              )}
            </div>

            {/* content */}
            <div className="md:col-span-6 lg:col-span-5 space-y-6">
              {/* heading & country */}
              <div className="space-y-0">
                <ul className="text-colorSecondaryLight text-xs uppercase flex items-center justify-start divide-x divide-colorSecondaryLight ">
                  {countries &&
                    countries?.map((country) => (
                      <li
                        key={country?._id}
                        className="px-2 first:pl-0 border-2 "
                      >
                        {country?.name}
                      </li>
                    ))}
                </ul>
                <HeadingTertiary
                  rootClass="text-colorSecondary leading-tight "
                  text={product.name}
                />
              </div>

              {/* pricing */}
              <div className="space-y-1">
                <div className="flex items-center space-x-4">
                  <p
                    className={` ${
                      product?.productType === "subscription" &&
                      selectedFrequency !== actualPrice &&
                      actualPrice !== null &&
                      actualPrice !== undefined
                        ? "text-[#DC605A]"
                        : "text-colorSecondary"
                    }  text-lg font-light ${
                      product?.simple?.salePrice !== null &&
                      product?.simple?.salePrice !== undefined
                        ? "line-through"
                        : "no-underline"
                    }`}
                  >
                    $
                    {!_.isNil(selectedPrice && product?.simple?.price)
                      ? product?.simple?.price
                      : selectedPrice}{" "}
                    USD
                  </p>
                  {product?.productType === "subscription" &&
                    selectedFrequency !== actualPrice &&
                    actualPrice !== null &&
                    actualPrice !== undefined && (
                      <>
                        <span className="text-colorSecondary text-lg font-light line-through">
                          ${actualPrice} USD
                        </span>
                        <span className="text-[#DC605A] text-xs font-thin uppercase border-[1px] border-[#DC605A] px-1">
                          save {discount * 100}%
                        </span>
                      </>
                    )}
                  {product?.simple?.salePrice && (
                    <p className="text-colorSecondary text-lg font-light">
                      $ {product?.simple?.salePrice} USD
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-6"></div>

                <p className="text-colorSecondaryLight text-xs">
                  Tax included.
                </p>
              </div>

              {/* variants */}
              {product?.productType === "variant" &&
                product?.variants[0].options.length > 0 && (
                  <div>
                    <p className="text-colorSecondaryLight text-xs">
                      {product?.variants[0]?.type}
                    </p>
                    <div className="flex items-center flex-wrap">
                      {product?.variants[0]?.options &&
                        product?.variants[0]?.options.map((option, index) => (
                          <div
                            key={option?._id}
                            onClick={() => {
                              setVariant(option);
                              setSelectedCountry(index);
                              setSelectedPrice(option?.price);
                              setSelectedStock(option?.stock);
                            }}
                            className={`${
                              selectedCountry === index
                                ? "bg-colorSecondary text-colorFifth"
                                : "bg-colorFifth hover:bg-colorSecondary text-colorSecondary hover:text-colorFifth"
                            } px-6 py-1 rounded-lg cursor-pointer m-1`}
                          >
                            {option?.name}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* subscriptions */}
              {product?.productType === "subscription" &&
                product?.subscriptions?.monthlyPrice && (
                  <div>
                    <p className="text-colorSecondaryLight text-xs">
                      Frequency
                    </p>
                    <div className="flex items-center flex-wrap">
                      {/* {
                                            product?.variants[0]?.options && product?.variants[0]?.options.map((option) => (
                                                <div key={option?._id} onClick={() => { setSelectedPrice(option?.price); setSelectedStock(option?.stock) }} className={`${selectedPrice === option?.price ? 'bg-colorSecondary text-colorFifth' : 'bg-colorFifth hover:bg-colorSecondary text-colorSecondary hover:text-colorFifth'} px-6 py-1 rounded-lg cursor-pointer m-1`}>{option?.name}</div>
                                            ))
                                        } */}
                      {product?.subscriptions?.monthlyPrice && (
                        <button
                          ref={buttonRef}
                          onClick={() => {
                            setSelectSubscriptionType("monthly");
                            setSelectedPrice(
                              product?.subscriptions?.monthlyPrice
                            );
                            setSelectedStock(false);
                            setMonthlyPriceId(
                              product?.subscriptions?.monthlyPriceId
                            );
                            setYearlyPriceId(null);
                            setMonthlyDelivery(
                              product?.subscriptions?.monthlyPrice
                            );
                            setYearlyDelivery(
                              product?.subscriptions?.monthlyPrice -
                                product?.subscriptions?.monthlyPrice * discount
                            );
                            setActualPrice(
                              product?.subscriptions?.monthlyPrice
                            );
                            setSelectedFrequency(
                              product?.subscriptions?.monthlyPrice
                            );
                          }}
                          className={`${
                            selectSubscriptionType === "monthly"
                              ? "bg-colorSecondary text-colorFifth"
                              : "bg-colorFifth hover:bg-colorSecondary text-colorSecondary hover:text-colorFifth"
                          } px-6 py-1 rounded-lg cursor-pointer m-1`}
                        >
                          Monthly
                        </button>
                      )}
                      {product?.subscriptions?.yearlyPrice && (
                        <button
                          onClick={() => {
                            setSelectSubscriptionType("yearly");
                            setSelectedPrice(
                              product?.subscriptions?.yearlyPrice
                            );
                            setSelectedStock(false);
                            setYearlyPriceId(
                              product?.subscriptions?.yearlyPriceId
                            );
                            setMonthlyPriceId(null);
                            setMonthlyDelivery(
                              product?.subscriptions?.yearlyPrice
                            );
                            setYearlyDelivery(
                              product?.subscriptions?.yearlyPrice -
                                product?.subscriptions?.yearlyPrice * discount
                            );
                            setActualPrice(product?.subscriptions?.yearlyPrice);
                            setSelectedFrequency(
                              product?.subscriptions?.yearlyPrice
                            );
                          }}
                          //   className={`${
                          //     selectedPrice ===
                          //     product?.subscriptions?.yearlyPrice
                          //       ? "bg-colorSecondary text-colorFifth"
                          //       : "bg-colorFifth hover:bg-colorSecondary text-colorSecondary hover:text-colorFifth"
                          //   } px-6 py-1 rounded-lg cursor-pointer m-1`}
                          // >
                          className={`${
                            selectSubscriptionType === "yearly"
                              ? "bg-colorSecondary text-colorFifth"
                              : "bg-colorFifth hover:bg-colorSecondary text-colorSecondary hover:text-colorFifth"
                          } px-6 py-1 rounded-lg cursor-pointer m-1`}
                        >
                          Yearly
                        </button>
                      )}
                    </div>
                  </div>
                )}

              {/* {
                                product?.productType === 'variant' && product?.variants[0].type === 'Country' &&
                                <div>
                                    <p className="text-colorSecondaryLight text-xs">{product?.variants[0]?.type}</p>
                                    <div className="flex items-center flex-wrap">
                                        {
                                            product?.variants[0]?.options && product?.variants[0]?.options.map((option) => (
                                                <div key={option?._id} onClick={() => setSelectedPrice(option?.price)} className={`${selectedPrice === option?.price ? 'bg-colorSecondary text-colorFifth' : 'bg-colorFifth hover:bg-colorSecondary text-colorSecondary hover:text-colorFifth'} px-6 py-1 rounded-lg cursor-pointer m-1`}>$ {option?.name}</div>
                                            ))
                                        }
                                    </div>
                                </div>
                            } */}

              {/* recipient info fields for gift */}
              {checkGift && (
                <div>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="w-full flex items-center space-x-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={open}
                            class="h-4 w-4"
                          />
                          <span className="flex-1 text-left text-colorSecondaryLight">
                            I want to send this as a gift
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="border-t border-colorSecondaryLight/20 mt-4 pt-4">
                          <form className="space-y-4">
                            <input
                              required
                              type="email"
                              name="recipientEmail"
                              placeholder="Recipient email"
                              onChange={handleRecipentData}
                              className="w-full appearance-none bg-colorFifth border border-colorSecondaryLight/30 focus:outline-none rounded-lg px-4 py-2"
                            />
                            <input
                              type="text"
                              name="recipientName"
                              placeholder="Recipient name (optional)"
                              onChange={handleRecipentData}
                              className="w-full appearance-none bg-colorFifth border border-colorSecondaryLight/30 focus:outline-none rounded-lg px-4 py-2"
                            />
                            <textarea
                              name="message"
                              placeholder="Message (optional)"
                              rows={3}
                              onChange={handleRecipentData}
                              className="w-full appearance-none bg-colorFifth border border-colorSecondaryLight/30 focus:outline-none rounded-lg px-4 py-2"
                            ></textarea>
                            <div className="w-full bg-colorFifth border border-colorSecondaryLight/30 focus:outline-none rounded-lg px-4 pb-1">
                              <p className="text-colorSecondaryLight text-[10px]">
                                Send on (optional)
                              </p>
                              <input
                                type="date"
                                name="date"
                                onChange={handleRecipentData}
                                className="w-full appearance-none bg-transparent focus:outline-none text-sm"
                              />
                            </div>
                          </form>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              )}

              {/* buttons */}
              <div className="space-y-3">
                <div>
                  {cartLoading ? (
                    <Spinner rootClass="w-5 h-5" />
                  ) : product?.productType === "subscription" ? (
                    <button
                      className="buttonSecondary !w-full flex items-center justify-center"
                      onClick={subscribeHandler}
                    >
                      Subscribe
                    </button>
                  ) : (
                    <button
                      className="buttonSecondary !w-full flex items-center justify-center"
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>

                {product?.productType === "simple" && (
                  <button
                    onClick={buyNowHandler}
                    className="buttonPrimary !w-full"
                  >
                    Buy it now
                  </button>
                )}
              </div>

              {/* description */}
              <div>
                <p className="text-colorSecondaryLight leading-7 tracking-wide">
                  {product.description}
                </p>
                {/* <p className="text-colorSecondaryLight leading-7 tracking-wide">
                                In Zimbabwe, the Mango thrives in its warm and subtropical climate, making it an ideal fruit tree for the region. These mango trees can reach impressive heights of up to 30 meters, and have a life span of approximately 25 years. During that time it can absorb 70kg of CO2 per year.
                                <br /><br />
                                With its prolific fruit production, the Mango plays a crucial role in providing sustenance and nutrition to the local population. The ripe and succulent mangoes are a popular favorite, enjoyed fresh as a delicious and refreshing treat during the hot Zimbabwean summers.
                                <br /><br />
                                In Zimbabwean communities, mango trees are often planted in backyards, homesteads, and small-scale orchards, contributing to food security and serving as a valuable income source for families. The abundance of mangoes not only caters to local consumption but also presents opportunities for small-scale trading and economic empowerment within the community.
                            </p> */}
              </div>

              {/* changes start hers */}
              {product?.productType === "subscription" && (
                <div>
                  <span className="text-colorSecondaryLight leading-7 tracking-wide capitalize ">
                    purchase options
                  </span>
                  <div className="my-4 border border-gray-300 py-2 px-4 justify-center">
                    <div className="flex mb-4 justify-between text-[1rem]">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          className="accent-black mr-2"
                          checked
                        />
                        <label>
                          <span className="text-colorSecondaryLight leading-7 tracking-wide">
                            Subscribe and save
                          </span>
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-colorSecondaryLight leading-7 tracking-wide">
                          ${selectedPrice}
                        </span>
                        {selectedFrequency !== actualPrice &&
                          actualPrice !== null &&
                          actualPrice !== undefined && (
                            <span className="text-colorSecondaryLight leading-7 tracking-wide line-through">
                              ${actualPrice}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col px-[1.5rem] text-colorSecondaryLight leading-7 tracking-wides">
                      <span className="uppercase mb-2 font-thin text-xs">
                        DELIVERY FREQUENCY
                      </span>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="annual"
                          className=" mr-2"
                          name="deliveryFrequency"
                          onChange={(e) => frequencyChangeHandler(e)}
                          checked={
                            selectedFrequency === parseFloat(yearlyDelivery)
                          }
                          value={yearlyDelivery}
                        />
                        <label htmlFor="annual">
                          <span className="capitalize pr-1">yearly</span>
                          <span>(${yearlyDelivery}/delivery)</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="monthly"
                          className=" mr-2"
                          name="deliveryFrequency"
                          onChange={(e) => frequencyChangeHandler(e)}
                          checked={
                            selectedFrequency === parseFloat(monthlyDelivery)
                          }
                          value={monthlyDelivery}
                        />
                        <label htmlFor="monthly">
                          <span className="capitalize pr-1">monthly</span>
                          <span>(${monthlyDelivery}/delivery)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center space-x-2 relative"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="bottom-start"
                    data-tooltip-html={`
                    <div>
                      <h5 class="text-base font-semibold mb-2">Have complete control of your subscriptions.</h5>
                      <p>
                         Skip, reschedule, edit,
                        or cancel deliveries anytime, based on your needs.
                      </p>
                    </div>
                  `}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 90 90"
                      xmlns="http://www.w3.org/2000/svg"
                      class="tooltip_subscription_svg"
                    >
                      <path d="M45 0C20.1827 0 0 20.1827 0 45C0 69.8173 20.1827 90 45 90C69.8173 90 90 69.8174 90 45C90.0056 44.6025 89.9322 44.2078 89.7839 43.8389C89.6357 43.47 89.4156 43.1342 89.1365 42.8511C88.8573 42.568 88.5247 42.3432 88.158 42.1897C87.7912 42.0363 87.3976 41.9573 87 41.9573C86.6024 41.9573 86.2088 42.0363 85.842 42.1897C85.4753 42.3432 85.1427 42.568 84.8635 42.8511C84.5844 43.1342 84.3643 43.47 84.2161 43.8389C84.0678 44.2078 83.9944 44.6025 84 45C84 66.5748 66.5747 84 45 84C23.4253 84 6 66.5747 6 45C6 23.4254 23.4253 6 45 6C56.1538 6 66.3012 10.5882 73.4375 18H65.4062C65.0087 17.9944 64.614 18.0678 64.2451 18.2161C63.8762 18.3643 63.5405 18.5844 63.2573 18.8635C62.9742 19.1427 62.7494 19.4753 62.596 19.842C62.4425 20.2088 62.3635 20.6024 62.3635 21C62.3635 21.3976 62.4425 21.7912 62.596 22.158C62.7494 22.5247 62.9742 22.8573 63.2573 23.1365C63.5405 23.4156 63.8762 23.6357 64.2451 23.7839C64.614 23.9322 65.0087 24.0056 65.4062 24H79.8125C80.6081 23.9999 81.3711 23.6838 81.9337 23.1212C82.4963 22.5586 82.8124 21.7956 82.8125 21V6.59375C82.821 6.18925 82.7476 5.78722 82.5966 5.41183C82.4457 5.03644 82.2205 4.69545 81.9344 4.40936C81.6483 4.12327 81.3073 3.898 80.9319 3.7471C80.5565 3.5962 80.1545 3.52277 79.75 3.53125C79.356 3.53941 78.9675 3.62511 78.6067 3.78344C78.2458 3.94177 77.9197 4.16963 77.6469 4.45402C77.3741 4.73841 77.16 5.07375 77.0168 5.44089C76.8737 5.80803 76.8042 6.19977 76.8125 6.59375V12.875C68.6156 4.86282 57.3081 0 45 0ZM43.75 20.75C43.356 20.7582 42.9675 20.8439 42.6067 21.0022C42.2458 21.1605 41.9197 21.3884 41.6469 21.6728C41.3741 21.9572 41.16 22.2925 41.0168 22.6596C40.8737 23.0268 40.8042 23.4185 40.8125 23.8125V47.375C40.8116 47.7693 40.8883 48.16 41.0385 48.5246C41.1886 48.8892 41.4092 49.2207 41.6875 49.5L54.0938 61.9375C54.6573 62.5011 55.4217 62.8177 56.2188 62.8177C57.0158 62.8177 57.7802 62.5011 58.3438 61.9375C58.9073 61.3739 59.224 60.6095 59.224 59.8125C59.224 59.0155 58.9073 58.2511 58.3438 57.6875L46.8125 46.1875V23.8125C46.821 23.408 46.7476 23.006 46.5966 22.6306C46.4457 22.2552 46.2205 21.9142 45.9344 21.6281C45.6483 21.342 45.3073 21.1168 44.9319 20.9658C44.5565 20.8149 44.1545 20.7415 43.75 20.75Z"></path>
                    </svg>

                    <span className="text-colorSecondaryLight leading-7 tracking-wide">
                      Subscription detail
                    </span>
                    <Tooltip
                      id="my-tooltip"
                      html={true}
                      className="text-center max-w-[16rem]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* product more info */}
          {product?.moreinfo &&
            !_.isEmpty(product?.moreinfo?.LOCAL) &&
            !_.isEmpty(product?.moreinfo?.BENEFITS) && (
              <div className="bg-colorPrimary mt-10 md:mt-20 rounded-2xl p-5">
                <HeadingTertiary
                  rootClass="text-colorFifth leading-tight text-center"
                  text={`More information on ${product.name}`}
                />
                <div className="grid grid-cols-2 mt-5 gap-5">
                  {/* local uses */}
                  <div className="col-span-2 lg:col-span-1 bg-colorTertiary p-5 rounded-2xl">
                    <h4 className="text-black font-black text-lg">
                      Local Uses
                    </h4>
                    <div className="max-h-52 overflow-auto">
                      <table className="border-0">
                        <tbody>
                          {product?.moreinfo?.LOCAL.map((item) => (
                            <tr key={item._id}>
                              <td className="w-16 h-auto border-0 align-top">
                                <img
                                  className="w-full h-auto"
                                  src={
                                    item.img
                                      ? imageBaseUrl + item.img
                                      : defaultImage
                                  }
                                  alt={item.heading}
                                />
                              </td>
                              <td className="border-0">
                                <h5 className="text-black font-bold tracking-wider">
                                  {item.heading}
                                </h5>
                                <p>{item.text}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CO2 absorbed */}
                  <div className="col-span-2 lg:col-span-1 bg-colorTertiary rounded-2xl overflow-hidden">
                    <div className="p-5 space-y-2">
                      <h4 className="text-black font-black text-lg">
                        CO2 absorbed
                      </h4>
                      <p>
                        by planting this{" "}
                        <span className="font-semibold">{product?.name}</span>{" "}
                        tree, you will offset{" "}
                      </p>
                      <div className="flex items-start space-x-5">
                        <div>
                          <img
                            className="w-14 h-auto rounded-full overflow-hidden"
                            src={imageBaseUrl + product?.moreinfo?.CO2?.img}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="uppercase">
                            <span className="text-3xl font-bold">
                              {product?.moreinfo?.CO2?.value}
                            </span>{" "}
                            {product?.moreinfo?.CO2?.unit} of CO<sub>2</sub>
                          </p>
                          <p>
                            equal to that produced by{" "}
                            <span className="font-bold">
                              {product?.moreinfo?.CO2?.distance}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-colorPrimaryLight p-5 border-t-4 border-colorPrimary">
                      <table className="border-0">
                        <tbody>
                          <tr>
                            <td className="font-bold text-lg border-0 px-0 py-1">
                              CO2 compensation Period
                            </td>
                            <td className="border-0 px-0 py-1">
                              {product?.moreinfo?.CO2?.period}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-bold text-lg border-0 px-0 py-1">
                              Average annual compensation
                            </td>
                            <td className="border-0 px-0 py-1">
                              {product?.moreinfo?.CO2?.averageAnnual}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* benefits */}
                  <div className="col-span-2 lg:col-span-2 bg-colorTertiary rounded-2xl p-5">
                    <h4 className="text-black font-black text-lg text-center">
                      Benefits
                    </h4>
                    <div
                      className={`${
                        product?.moreinfo?.BENEFITS.length === 1
                          ? `grid-cols-1`
                          : product?.moreinfo?.BENEFITS.length === 2
                          ? `grid-cols-2`
                          : product?.moreinfo?.BENEFITS.length === 3
                          ? `grid-cols-2 sm:grid-cols-3`
                          : "grid-cols-2 sm:grid-cols-4"
                      } grid gap-5 mt-5`}
                    >
                      {product?.moreinfo?.BENEFITS.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col items-center space-y-4"
                        >
                          <div className="w-max relative">
                            <svg
                              className="relative z-10"
                              style={{
                                width: radius * 2.2,
                                height: radius * 2.2,
                              }}
                            >
                              <circle
                                className="text-gray-300"
                                strokeWidth="10"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx={radius * 1.1}
                                cy={radius * 1.1}
                              />
                              <circle
                                className="text-colorPrimary"
                                strokeWidth="10"
                                strokeDasharray={2 * Math.PI * radius}
                                strokeDashoffset={
                                  2 * Math.PI * radius -
                                  (item.ratio / 10) * (2 * Math.PI * radius)
                                }
                                strokeLinecap=""
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx={radius * 1.1}
                                cy={radius * 1.1}
                              />
                            </svg>
                            {/* image */}
                            <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center rounded-full overflow-hidden p-6">
                              <img
                                className="max-w-[80%] m-auto overflow-hidden"
                                src={imageBaseUrl + item.img}
                                alt={item.heading}
                              />
                            </div>
                          </div>
                          <p className="text-center">{item.heading}</p>
                          <p className="font-bold text-sm text-center">
                            {item.ratio} / 10
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}

      {/* You may also like */}
      {products && products?.length > 0 && (
        <div className="w-11/12 max-w-[1100px] m-auto space-y-10 py-10 sm:py-20">
          <HeadingTertiary
            rootClass="text-colorSecondary"
            text={"You may also like"}
          />

          {/* cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10 ">
            {products?.slice(0, 4).map((product) => (
              <ProductCardTertiary key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
