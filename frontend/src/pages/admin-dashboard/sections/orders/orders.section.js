import React, { Fragment, memo, useEffect, useState } from "react";
import _ from "lodash";
import { Spinner } from "../../../../element";
import axios from "axios";
import { DateTime } from "luxon";
import { Dialog, Transition } from "@headlessui/react";

const ORDERS = (props) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState({ orders: [] });
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function getAllOrders() {
    setLoading(true);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/admin/orders`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      setAllOrders(data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllOrders();
  }, []);

  const openModalForOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="bg-colorSeventh p-10">
      <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">
        Orders
      </h3>
      {/* loader */}
      {loading && (
        <div className="flex items-center justify-center mt-5">
          <Spinner rootClass="w-8 h-8" />
        </div>
      )}

      {/* content */}
      {!loading && allOrders.orders && allOrders.orders.length > 0 ? (
        <div className="mt-5 space-y-5">
          <table className="min-w-full max-h-96 overflow-auto">
            <thead>
              <tr className="font-bold text-sm sm:text-base">
                <td>Order</td>
                <td>Date</td>
                <td>Payment status</td>
                <td>Total</td>
              </tr>
            </thead>
            <tbody>
              {allOrders.orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => openModalForOrder(order)}
                  className="text-sm sm:text-base hover:bg-colorPrimary cursor-pointer group"
                >
                  <td className="text-yellow-600 group-hover:text-white">
                    #{order.orderNumber}
                  </td>
                  <td className="group-hover:text-white">
                    {DateTime.fromISO(order.createdAt).toFormat("LLL dd, yyyy")}
                  </td>
                  {order.paymentInfo.status === "succeeded" ? (
                    <td className="text-colorPrimary group-hover:text-white">
                      Paid
                    </td>
                  ) : (
                    <td className="text-red-600 group-hover:text-white">
                      Un-paid
                    </td>
                  )}
                  <td className="group-hover:text-white">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-colorSecondaryLight text-left text-lg mt-5">
          No order found!
        </p>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div>
          <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
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
                    <div className="w-11/12 max-w-2xl bg-white rounded-lg p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-medium leading-6 text-colorPrimary"
                      >
                        Order Information
                      </Dialog.Title>
                      <div className="mt-2">
                        <table>
                          <tbody>
                            {selectedOrder?.orderNumber && (
                              <tr>
                                <td className="align-top">Order Number</td>
                                <td>{selectedOrder?.orderNumber}</td>
                              </tr>
                            )}
                            {selectedOrder?.orderItems && (
                              <tr>
                                <td className="align-top">Order items</td>
                                <td>
                                  <div className="max-h-60 space-y-2 overflow-auto">
                                    {selectedOrder?.orderItems.map(
                                      (item, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center space-x-4"
                                        >
                                          {/* image */}
                                          <div>
                                            {item.image &&
                                              item.image !== "" && (
                                                <div
                                                  className="w-14 md:w-14 h-14 md:h-14 bg-cover bg-no-repeat bg-center rounded-2xl overflow-hidden"
                                                  style={{
                                                    backgroundImage: `url(${
                                                      imageBaseUrl + item.image
                                                    })`,
                                                  }}
                                                ></div>
                                              )}
                                          </div>

                                          <div className="space-y-0">
                                            <h3 className="text-colorSecondary text-base font-bold kalam">
                                              {item.name}
                                            </h3>
                                            {item?.variant && (
                                              <p className="text-colorSecondaryLight text-xs font-light">
                                                Country: {item?.variant?.name}
                                              </p>
                                            )}
                                            <p className="text-colorSecondaryLight text-xs font-light">
                                              Quantity: {item.quantity}
                                            </p>

                                            <p className="text-colorSecondaryLight text-xs font-light">
                                              ${item.price * item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {selectedOrder?.email && (
                              <tr>
                                <td className="align-top">Buyer Email</td>
                                <td>{selectedOrder?.email}</td>
                              </tr>
                            )}
                            {selectedOrder?.shippingInfo && (
                              <tr>
                                <td className="align-top">Buyer Address</td>
                                <td>
                                  {selectedOrder?.shippingInfo.address},{" "}
                                  {selectedOrder?.shippingInfo.city},{" "}
                                  {selectedOrder?.shippingInfo.country}
                                </td>
                              </tr>
                            )}
                            {selectedOrder?.paymentInfo && (
                              <tr>
                                <td className="align-top">Status</td>
                                <td>
                                  {selectedOrder?.paymentInfo.status ===
                                  "succeeded" ? (
                                    <p className="text-colorPrimary">Paid</p>
                                  ) : (
                                    <p className="text-red-500">Un-paid</p>
                                  )}
                                </td>
                              </tr>
                            )}
                            {selectedOrder?.totalPrice && (
                              <tr>
                                <td>
                                  <p>Total</p>
                                  <p className="text-xs">
                                    With tax and shipping
                                  </p>
                                </td>
                                <td>${selectedOrder?.totalPrice.toFixed(2)}</td>
                              </tr>
                            )}
                            {selectedOrder?.specialInstruction &&
                              !_.isNull(selectedOrder?.specialInstruction) &&
                              !_.isNil(selectedOrder?.specialInstruction) &&
                              !_.isUndefined(
                                selectedOrder?.specialInstruction
                              ) && (
                                <tr>
                                  <td className="align-top">
                                    Special instruction
                                  </td>
                                  <td>{selectedOrder?.specialInstruction}</td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 text-right">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/20 px-4 py-2 text-sm font-medium text-colorPrimary hover:bg-colorPrimary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      )}

      {/* error */}
      {error && (
        <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default memo(ORDERS);
