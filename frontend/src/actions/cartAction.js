import {
  BUY_NOW_ITEM,
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  DELETE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  SAVE_USER_EMAIL_INFO,
  BUY_SUBSCRIBE_ITEM,
} from "../constants/cartConstants";
import axios from "axios";
import _ from "lodash";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// buy now
export const buyNowItem = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`${apiBaseUrl}/api/v1/product/${id}`);

  dispatch({
    type: BUY_NOW_ITEM,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.simple.price,
      image: data.product.images[0],
      stock: data.product.simple.Stock,
      quantity,
      noOfItems: data.product.noOfItems * quantity,
      noOfCo2: _.isUndefined(data?.product?.moreinfo?.CO2?.value)
        ? 0
        : parseFloat(data?.product?.moreinfo?.CO2?.value) * quantity,
      countries: data.product.countries,
    },
  });

  localStorage.setItem("buyNowItem", JSON.stringify(getState().cart.cartItems));
};
// buy now
export const buySubscribeItem =
  (
    id,
    quantity,
    selectedStock,
    selectedPrice,
    monthlyPriceId,
    yearlyPriceId,
    couponApplicable
  ) =>
  async (dispatch, getState) => {
    const { data } = await axios.get(`${apiBaseUrl}/api/v1/product/${id}`);

    dispatch({
      type: BUY_SUBSCRIBE_ITEM,
      payload: {
        couponApplicable,
        quantity,
        monthlyPriceId,
        yearlyPriceId,
        product: data.product._id,
        name: data.product.name,
        subscription: data.product.subscription,
        image: data.product.images[0],
        price: selectedPrice,
        countries: data?.product?.countries,
        productType: data?.product?.productType,
        noOfItems: data.product.noOfItems * quantity,
        noOfCo2: _.isUndefined(data?.product?.moreinfo?.CO2?.value)
          ? 0
          : parseFloat(data?.product?.moreinfo?.CO2?.value) * quantity,
      },
    });

    localStorage.setItem(
      "buySubscribeItem",
      JSON.stringify(getState().cart.cartItems)
    );
  };

// Add to Cart
export const addItemsToCart =
  (id, quantity, selectedPrice, selectedStock, variant, giftItem) =>
  async (dispatch, getState) => {
    const { data } = await axios.get(`${apiBaseUrl}/api/v1/product/${id}`);
    // if (data.product.productType !== "subscription") {
    if (quantity < 2) {
      localStorage.setItem(
        "cartDrop",
        JSON.stringify({
          name: data.product.name,
          image: data.product.images[0],
        })
      );
    }

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: _.isNil(selectedPrice)
          ? data.product.simple.price
          : selectedPrice,
        image: data.product.images[0],
        stock: _.isNil(selectedStock)
          ? data.product.simple.stock
          : selectedStock,
        quantity,
        noOfItems: data.product.noOfItems * quantity,
        noOfCo2: _.isUndefined(data?.product?.moreinfo?.CO2?.value)
          ? 0
          : parseFloat(data?.product?.moreinfo?.CO2?.value) * quantity,
        countries: data?.product?.countries,
        giftItem,
        variant,
        productType: data?.product?.productType,
        // subscriptions: {
        // monthlyPriceId: _.isNil(monthlyPriceId)
        //   ? data?.product?.subscriptions?.monthlyPriceId
        //   : monthlyPriceId,
        // yearlyPriceId: _.isNil(yearlyPriceId)
        //   ? data?.product?.subscriptions?.yearlyPriceId
        //   : yearlyPriceId,

        // },
        // productType,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
    // }
  };

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// delete cart
export const deleteCart = () => async (dispatch, getState) => {
  dispatch({
    type: DELETE_CART_ITEM,
  });

  localStorage.removeItem("cartItems");
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};

// SAVE USER EMAIL INFO
export const saveUserEmailInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_USER_EMAIL_INFO,
    payload: data,
  });

  localStorage.setItem("userEmailInfo", JSON.stringify(data));
};
