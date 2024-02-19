import React, { memo, useState } from "react";
import _ from "lodash";
import { HeadingTertiary, TextPrimary } from "../../element";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";

const Cart = () => {
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [specialInstruction, setSpecialInstruction] = useState("");

  const increaseQuantity = (id, quantity, selectedPrice, selectedStock) => {
    const newQty = quantity + 1;
    if (selectedStock <= quantity || quantity > 9) {
      return;
    }
    dispatch(addItemsToCart(id, newQty, selectedPrice, selectedStock));
  };

  const decreaseQuantity = (id, quantity, selectedPrice, selectedStock) => {
    const newQty = quantity - 1;
    if (quantity <= 1) {
      return;
    }
    dispatch(addItemsToCart(id, newQty, selectedPrice, selectedStock));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = () => {
    localStorage.setItem("specialInstruction", specialInstruction);
    navigate("/checkout");
  };

  const QUANTITY = ({ item }) => (
    <div>
      {/* range */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-colorSeventh border border-colorSecondaryLight rounded-xl space-x-4">
          <div
            onClick={() =>
              decreaseQuantity(
                item.product,
                item.quantity,
                item.price,
                item.stock
              )
            }
            className="w-12 h-12 flex items-center justify-center text-colorSecondaryLight text-xl cursor-pointer"
          >
            -
          </div>
          <p className="text-colorSecondary text-sm">{item.quantity}</p>
          <div
            onClick={() =>
              increaseQuantity(
                item.product,
                item.quantity,
                item.price,
                item.stock
              )
            }
            className="w-12 h-12 flex items-center justify-center text-colorSecondaryLight text-xl cursor-pointer"
          >
            +
          </div>
        </div>
        <div
          onClick={() => deleteCartItems(item.product)}
          className="w-max cursor-pointer"
        >
          <Icon icon="lucide:trash-2" className="text-colorSecondary" />
        </div>
      </div>
      {item.quantity === 10 && (
        <div className="flex items-center space-x-2 mt-3">
          <div>
            <Icon
              icon="material-symbols:error"
              className="text-sm text-red-600"
            />
          </div>
          <p className="text-colorSecondaryLight text-xs tracking-wider">
            You can't add more Nectarine to the cart.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {cartItems.length === 0 ? (
        <div className="w-11/12 max-w-[1100px] m-auto space-y-10 py-10 sm:py-20">
          <div className="flex flex-col items-center justify-center space-y-10">
            <HeadingTertiary
              rootClass="text-colorSecondary"
              text={"Your cart is empty"}
            />
            <Link to="/collections/all">
              <div className="buttonPrimary">Continue shopping</div>
            </Link>

            {!isAuthenticated && (
              <div className="space-y-3 text-center">
                <h4 className="kalam text-colorSecondary text-3xl font-bold">
                  Have an account?
                </h4>
                <div className="flex items-center justify-center space-x-1">
                  <Link to="/login">
                    <p className="text-colorSecondary tracking-wider underline hover:decoration-2">
                      Log in
                    </p>
                  </Link>
                  <p className="text-colorSecondaryLight tracking-wider">
                    to check out faster
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-11/12 max-w-[1100px] m-auto space-y-10 py-10 sm:py-20">
          {/* hero section */}
          <div className="flex items-center justify-between">
            <HeadingTertiary
              rootClass="text-colorSecondary"
              text={"Your cart"}
            />
            <Link to={"/collections/all"}>
              <TextPrimary
                rootClass="text-colorSecondary underline underline-offset-2 hover:decoration-2"
                text={"Continue shopping"}
              />
            </Link>
          </div>

          {/* products list */}
          <div>
            <table className="min-w-full border-0">
              <thead>
                <tr className="text-colorSecondaryLight text-xs uppercase border-b border-colorSecondary/10">
                  <td className="lg:w-2/3 border-0">Product</td>
                  <td className="hidden md:block border-0">Quantity</td>
                  <td className="text-right border-0">Total</td>
                </tr>
              </thead>
              <tbody>
                {cartItems &&
                  cartItems.map((item) => (
                    <tr key={item.product}>
                      <td className="border-0 align-top py-6">
                        <div className="flex items-start space-x-4">
                          {/* image */}
                          <div>
                            {item.image && (
                              <div
                                className="w-24 md:w-28 h-24 md:h-28 bg-cover bg-no-repeat bg-center rounded-2xl overflow-hidden"
                                style={{
                                  backgroundImage: `url(${
                                    imageBaseUrl + item.image
                                  })`,
                                }}
                              ></div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-colorSecondary text-[22px] font-bold kalam">
                              {item.name}
                            </h3>
                            <p className="text-colorSecondaryLight font-light">
                              ${item.price}
                            </p>
                            {!_.isUndefined(item.giftItem) && (
                              <>
                                {item?.giftItem?.recipientEmail && (
                                  <div className="text-colorSecondaryLight text-sm font-light leading-none">
                                    <p>Recipient email:</p>
                                    <p>{item?.giftItem?.recipientEmail}</p>
                                  </div>
                                )}
                                {item?.giftItem?.recipientName && (
                                  <p className="text-colorSecondaryLight text-sm font-light leading-none">
                                    <span>Recipient name:</span>
                                    <span className="ml-1 capitalize">
                                      {item?.giftItem?.recipientName}
                                    </span>
                                  </p>
                                )}
                              </>
                            )}
                            <div className="block md:hidden">
                              <QUANTITY item={item} />
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* ============== */}
                      <td className="hidden md:block align-top border-0 py-6">
                        {/* range */}
                        <QUANTITY item={item} />
                      </td>
                      {/* ================ */}
                      <td className="text-right align-top border-0 py-6">
                        <p className="text-colorSecondary">
                          ${item.price * item.quantity}
                        </p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* subtotal & instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-colorSecondary/10 pt-10 gap-10 lg:gap-0">
            <div>
              <form className="space-y-1">
                <label className="text-colorSecondaryLight tracking-wider">
                  Order special instructions
                </label>
                <textarea
                  rows={3}
                  value={specialInstruction}
                  onChange={(e) => setSpecialInstruction(e.target.value)}
                  className="w-full appearance-none bg-colorSeventh text-colorFourth placeholder:text-colorSecondary tracking-wider border border-colorSecondary/60 focus:border-colorSecondary focus:outline-none ring-1 ring-transparent focus:ring-colorSecondary rounded-xl rounded-br-none px-4 py-2.5"
                ></textarea>
              </form>
            </div>

            <div className="hidden lg:block"></div>

            <div className="flex flex-col items-center md:items-end space-y-6">
              <div className="flex items-center space-x-6">
                <h3 className="text-colorSecondary text-[22px] font-bold kalam">
                  Subtotal
                </h3>
                <p className="text-colorSecondaryLight">
                  $
                  {cartItems.reduce(
                    (acc, item) => acc + item.quantity * item.price,
                    0
                  )}
                </p>
              </div>
              <p className="text-colorSecondaryLight text-xs">
                Tax included and shipping calculated at checkout
              </p>
              <button
                onClick={checkoutHandler}
                className="buttonPrimary !w-full sm:!w-2/3 md:!w-full"
              >
                Check out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Cart);
