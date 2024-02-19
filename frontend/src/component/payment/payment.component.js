import React, { memo, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import VisaLogo from "../../assets/images/visa.svg";
import MasterLogo from "../../assets/images/master.svg";
import AmexLogo from "../../assets/images/amex.svg";
import { Spinner } from "../../element";
import { deleteCart } from "../../actions/cartAction";

const PaymentSection = (props) => {
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const specialInstructions = localStorage.getItem("specialInstruction");

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems, userEmailInfo, buySubscribeItem } =
    useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState(null);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    saveUserShippingInfo: shippingInfo.saveUserShippingInfo,
    specialInstruction:
      _.isNull(specialInstructions) ||
      _.isNil(specialInstructions) ||
      _.isUndefined(specialInstructions)
        ? ""
        : specialInstructions,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
    email: userEmailInfo.email,
    emailOffers: userEmailInfo.emailOffers,
  };

  const isSubscriptionProduct = order?.orderItems?.filter(
    (val) => val.productType === "subscription"
  );
  let submitHandler;
  if (isSubscriptionProduct.length > 0) {
    submitHandler = async (e) => {
      e.preventDefault();

      setPayLoading(true);
      setPayError(null);

      // payBtn.current.disabled = true;

      try {
        const token = localStorage.getItem("authToken");
        const config_c = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        let customerId = null;

        const customerInfo = await fetch(
          `${apiBaseUrl}/api/v1/customer/email/${order.email}`,
          config_c
        ).then((res) => res.json());

        if (customerInfo.success) {
          customerId = customerInfo.customer.stripeCustomerId;
        } else {
          const newCustomer = await fetch(`${apiBaseUrl}/api/v1/customer`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: order.email,
              shippingInfo: order.shippingInfo,
            }),
          }).then((res) => res.json());
          customerId = newCustomer.stripeCustomer.id;
        }

        // apply coupon here
        console.log(customerId);
        let couponCode = null;
        if (
          buySubscribeItem.length >= 0 &&
          buySubscribeItem[0].couponApplicable
        )
          console.log(buySubscribeItem[0].couponApplicable);
        {
          const res = await axios.get(
            `${apiBaseUrl}/api/v1/getCouponList`,
            config_c
          );
          if (res.data.success === true) {
            if (res.data.coupons.length > 0) {
              couponCode = res.data.coupons[0].stripeCouponId;
            }
          }
        }

        console.log(couponCode);

        const createdSubscription = await fetch(
          `${apiBaseUrl}/api/v1/createSubSubscription`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerId: customerId,
              coupon: couponCode,
              priceId:
                order?.orderItems[0]?.monthlyPriceId ||
                order?.orderItems[0]?.yearlyPriceId,
              // paymentMethodId: data.myPayment.id
            }),
          }
        ).then((res) => res.json());

        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(
          createdSubscription?.invoice.payment_intent.client_secret,
          {
            payment_method: {
              card: elements.getElement(CardNumberElement),
              billing_details: {
                name: shippingInfo.firstName + " " + shippingInfo.lastName,
                email: userEmailInfo.email,
                address: {
                  line1: shippingInfo.address,
                  city: shippingInfo.city,
                  state: shippingInfo.state,
                  postal_code: shippingInfo.pinCode,
                  country: shippingInfo.country,
                },
              },
            },
          }
        );

        if (result.error) {
          setPayError(result.error.message);
          setPayLoading(false);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            // setPayLoading(false);

            navigate("/success");

            order.paymentInfo = {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              subscriptionId: createdSubscription.subscription.id,
              priceId:
                order?.orderItems[0]?.monthlyPriceId ||
                order?.orderItems[0]?.yearlyPriceId,
            };

            dispatch(createOrder(order));
            setPayLoading(false);
            localStorage.removeItem("specialInstruction");

            setTimeout(() => {
              dispatch(deleteCart());
            }, 2000);
          } else {
            setPayError("There`s some issue while processing payment");
            setPayLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        setPayError(
          "There`s some issue while processing payment, Wrong card or empty fields"
        );
        setPayLoading(false);
      }
    };
  } else {
    submitHandler = async (e) => {
      e.preventDefault();

      setPayLoading(true);
      setPayError(null);

      // payBtn.current.disabled = true;

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.post(
          `${apiBaseUrl}/api/v1/payment/process`,
          paymentData,
          config
        );

        const client_secret = data.client_secret;

        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: shippingInfo.firstName + " " + shippingInfo.lastName,
              email: userEmailInfo.email,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.pinCode,
                country: shippingInfo.country,
              },
            },
          },
        });

        if (result.error) {
          // payBtn.current.disabled = false;
          setPayError(result.error.message);
          setPayLoading(false);
          // console.log(result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            order.paymentInfo = {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              priceId:
                order?.orderItems[0]?.monthlyPriceId ||
                order?.orderItems[0]?.yearlyPriceId,
            };

            dispatch(createOrder(order));
            setPayLoading(false);
            localStorage.removeItem("specialInstruction");

            setTimeout(() => {
              dispatch(deleteCart());
            }, 2000);

            navigate("/success");
          } else {
            setPayError("There`s some issue while processing payment");
          }
        }
      } catch (error) {
        // payBtn.current.disabled = false;
        // console.log(error.response.data.message);
        setPayError(
          "There`s some issue while processing payment, Wrong card or empty fields"
        );
        setPayLoading(false);
      }
    };
  }
  useEffect(() => {
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);
  return (
    <div>
      <form className="space-y-8" onSubmit={(e) => submitHandler(e)}>
        {/* Payment */}
        <div className="space-y-3">
          <h3 className="font-bold">Payment</h3>
          <p className="text-colorSecondaryLight">
            All transactions are secure and encrypted.
          </p>
          {/* stripe form */}
          <div className="overflow-hidden">
            <div className="bg-yellow-50 flex items-center justify-between border border-colorSecondary p-4 rounded-t-lg">
              <p className="text-colorSecondary text-sm font-semibold">
                Credit card
              </p>
              <div className="flex items-center space-x-2">
                <img src={VisaLogo} alt="Visa payment" />
                <img src={MasterLogo} alt="Master payment" />
                <img src={AmexLogo} alt="Amex payment" />
              </div>
            </div>
            <div className="bg-[#F4F4F4] grid grid-cols-2 border border-gray-300 p-4 gap-4 rounded-b-lg">
              {/* card num */}
              <div className="col-span-2 flex items-center bg-white border border-gray-300 space-x-2 px-3 py-3 rounded-md">
                <CardNumberElement className="flex-1" />
                <Icon icon="solar:lock-outline" />
              </div>
              {/* expiration date */}
              <div className="col-span-1 flex items-center bg-white border border-gray-300 space-x-2 px-3 py-3 rounded-md">
                <CardExpiryElement className="w-full" />
              </div>
              {/* cvc */}
              <div className="col-span-1 flex items-center bg-white border border-gray-300 space-x-2 px-3 py-3 rounded-md">
                <CardCvcElement className="w-full" />
              </div>
            </div>
          </div>
        </div>
        {payError && (
          <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
            {payError}
          </div>
        )}
        {}
        {/* <div className="space-y-3">
                    <h3 className="font-bold">Billing address</h3>
                    <p className="text-colorSecondaryLight">Select the address that matches your card or payment method.</p>
                </div> */}
        {/* Pay now button and back button */}
        <div className="flex items-center justify-between">
          <div
            onClick={props.handleBack}
            className="flex items-center space-x-2 text-colorSecondaryLight cursor-pointer"
          >
            <Icon icon="ci:chevron-left" />
            <p>Return to shipping</p>
          </div>
          {payLoading ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <input
              type="submit"
              value="Pay now"
              ref={payBtn}
              className="bg-colorPrimary text-white text-sm font-semibold tracking-wider rounded-md p-5 cursor-pointer transition-all ease-in-out duration-150"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default memo(PaymentSection);
