import React, { Fragment, memo, useEffect, useState } from "react";
import _ from "lodash";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import useGetCountriesByIds from "../../../hooks/useGetCountriesById";
import axios from "axios";
import { deleteOrder } from "../../../actions/orderAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import VisaLogo from "../../../assets/images/visa.svg";
import MasterLogo from "../../../assets/images/master.svg";
import AmexLogo from "../../../assets/images/amex.svg";
import { Spinner } from "../../../element";
import { createOrder } from "../../../actions/orderAction";

const token = localStorage.getItem("authToken");
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};
const OrderModal = (props) => {
  const { user } = useSelector((state) => state.user);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showStripe, setStripe] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState(null);

  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { countries } = useGetCountriesByIds(props?.data?.countries);

  const cancelSubscription = async (subscriptionId, orderId) => {
    return await axios.post(`${apiBaseUrl}/api/v1/cancelSubSubscription`, {
      subscriptionId: subscriptionId,
      orderId: orderId,
    });
  };
  const cancelSubscriptionHandler = async (subscriptionId) => {
    const data = await cancelSubscription(subscriptionId, props?.data?._id);
    if (data.status === 200) {
      await dispatch(deleteOrder(props?.data?._id));
      props.onClose();
      window.location.reload();
    }
  };
  const pauseSubscriptionHandler = async (subscriptionId, orderId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to pause this subscription?"
    );
    if (userConfirmed) {
      const data = await cancelSubscription(subscriptionId, orderId);
      if (data.status === 200) {
        props.onClose();
        window.location.reload();
      }
    }
  };
  const resumeSubscriptionHandler = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to resume this subscription?"
    );
    if (userConfirmed) {
      setStripe(true);
    }
  };

  const handleClose = () => {
    setStripe(false);
    props.onClose();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setPayLoading(true);
    setPayError(null);
    try {
      let customerId = null;

      const customerInfo = await fetch(
        `${apiBaseUrl}/api/v1/customer/email/${user?.email}`,
        config
      ).then((res) => res.json());

      if (customerInfo.success) {
        customerId = customerInfo.customer.stripeCustomerId;
      }
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
            priceId: props?.data?.priceId,
          }),
        }
      ).then((res) => res.json());
      if (!stripe || !elements) return;

      const res = await axios.get(
        `${apiBaseUrl}/api/v1/order/${props?.data?._id}`,
        config
      );
      if (res.status == 200) {
        const orderDetail = res?.data?.order;

        let order = {
          shippingInfo: orderDetail?.shippingInfo,
          email: orderDetail?.email,
          emailOffers: orderDetail?.emailOffers,
          orderItems: orderDetail?.orderItems,
          saveUserShippingInfo: orderDetail?.saveUserShippingInfo,
          shippingInfo: orderDetail?.shippingInfo,
          shippingPrice: orderDetail?.shippingPrice,
          specialInstruction: orderDetail?.specialInstructions,
          taxPrice: orderDetail?.taxPrice,
          itemsPrice: orderDetail?.itemsPrice,
          totalPrice: orderDetail?.totalPrice,
        };

        const result = await stripe.confirmCardPayment(
          createdSubscription?.invoice.payment_intent.client_secret,
          {
            payment_method: {
              card: elements.getElement(CardNumberElement),
              billing_details: {
                name:
                  order?.shippingInfo?.firstName +
                  " " +
                  order?.shippingInfo?.lastName,
                email: order?.email,
                address: {
                  line1: order?.shippingInfo?.address,
                  city: order?.shippingInfo?.city,
                  state: order?.shippingInfo?.state,
                  postal_code: order?.shippingInfo?.pinCode,
                  country: order?.shippingInfo?.country,
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
            order.paymentInfo = {
              id: result?.paymentIntent?.id,
              status: result?.paymentIntent?.status,
              subscriptionId: createdSubscription?.subscription.id,
              priceId: orderDetail?.paymentInfo?.priceId,
            };
            await dispatch(createOrder(order));
            await dispatch(deleteOrder(props?.data?._id));
            setPayLoading(false);
            setStripe(false);
            props.onClose();
            window.location.reload();
          } else {
            setPayError("There`s some issue while processing payment");
            setPayLoading(false);
            setStripe(false);
            props.onClose();
            window.location.reload();
          }
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

  useEffect(() => {}, [props.isOpen, props.onClose, showStripe]);
  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {!showStripe && (
                    <div>
                      {props?.data?.subscriptionStatus === "active" && (
                        <button
                          className="w-max bg-[#D5E5AC]  text-black text-sm px-6 py-2 rounded-md cursor-pointer capitalize"
                          onClick={() =>
                            pauseSubscriptionHandler(
                              props?.data?.subscriptionId,
                              props.data._id
                            )
                          }
                        >
                          Pause subscription
                        </button>
                      )}
                      {props?.data?.subscriptionStatus === "cancel" && (
                        <button
                          className="w-max bg-[#D5E5AC]  text-black text-sm px-3 py-2 rounded-md cursor-pointer capitalize"
                          onClick={resumeSubscriptionHandler}
                        >
                          Resume subscription
                        </button>
                      )}
                      {/* image */}
                      {props?.data?.image && (
                        <div className="w-full h-60 relative mt-2">
                          <img
                            src={imageBaseUrl + props?.data?.image}
                            alt="Your Alt Text"
                            className="w-80% mx-auto h-full object-cover"
                          />
                        </div>
                      )}
                      {/* content */}
                      <div className="flex flex-col items-center text-center mt-4 space-y-2">
                        <h3 className="text-colorFourth text-lg font-bold capitalize">
                          {props?.data?.quantity}x {props?.data?.name}
                        </h3>
                        {/* <p className="text-colorSecondaryLight text-xs font-light capitalize">date here</p> */}
                        <p className="text-colorSecondaryLight text-xs capitalize">
                          Funded by you
                        </p>
                        {!_.isEmpty(countries) && (
                          <div className="w-max bg-colorPrimaryLight text-colorFourth flex items-center space-x-1 px-4 py-px rounded">
                            <Icon
                              icon="gridicons:location"
                              className="w-3 h-auto"
                            />
                            <ul className="text-xs capitalize flex items-center justify-center divide-x divide-colorSecondaryLight">
                              {countries &&
                                countries?.map((country) => (
                                  <li key={country?._id} className="px-1">
                                    {country?.name}
                                  </li>
                                ))}
                            </ul>
                            {/* <p className="text-xs capitalize">location</p> */}
                          </div>
                        )}
                        {props?.data?.product && (
                          <p className="text-colorSecondaryLight text-xs capitalize">
                            Unique ID: {props?.data?.product}
                          </p>
                        )}
                        {props?.data?.product && (
                          <Link to={`/product/${props?.data?.product}`}>
                            <div className="w-max bg-colorPrimary text-colorFifth text-sm px-2 py-1 rounded-md cursor-pointer">
                              Learn More
                            </div>
                          </Link>
                        )}

                        {props?.data?.product && (
                          <button
                            onClick={() =>
                              cancelSubscriptionHandler(
                                props.data?.subscriptionId
                              )
                            }
                          >
                            {props?.data?.type === "subscription" && (
                              <div className="w-max bg-red-400 text-colorFifth text-sm px-2 py-1 rounded-md cursor-pointer">
                                Cancel Subscription
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* close button */}
                  <div className="flex items-center justify-center mt-4">
                    <div
                      onClick={props.onClose}
                      className="text-colorFourth cursor-pointer"
                    >
                      <Icon icon="carbon:close-filled" className="w-6 h-auto" />
                    </div>
                  </div>

                  {/* Stripe Modal */}
                  {showStripe && (
                    <div>
                      <form
                        className="space-y-8"
                        onSubmit={(e) => submitHandler(e)}
                      >
                        {/* Payment */}
                        <div className="space-y-3">
                          <h3 className="font-bold">
                            Resume Subscription and Pay
                          </h3>
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

                        <div className="flex items-center justify-end">
                          {payLoading ? (
                            <div>
                              <Spinner />
                            </div>
                          ) : (
                            <input
                              type="submit"
                              value={`Pay $${props?.data?.price}`}
                              // ref={payBtn}
                              className="bg-colorPrimary text-white text-sm font-semibold tracking-wider rounded-md p-5 cursor-pointer transition-all ease-in-out duration-150"
                            />
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default memo(OrderModal);
