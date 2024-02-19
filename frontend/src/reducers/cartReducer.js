import {
  BUY_NOW_ITEM,
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  DELETE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  SAVE_USER_EMAIL_INFO,
  BUY_SUBSCRIBE_ITEM,
} from "../constants/cartConstants";

export const cartReducer = (
  state = {
    buyNowItem: [],
    cartItems: [],
    shippingInfo: {},
    userEmailInfo: {},
    buySubscribeItem: [],
  },
  action
) => {
  switch (action.type) {
    case BUY_NOW_ITEM:
      return {
        ...state,
        cartItems: [action.payload],
      };
    case BUY_SUBSCRIBE_ITEM:
      return {
        ...state,
        cartItems: [action.payload],
      };
    case ADD_TO_CART:
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    case DELETE_CART_ITEM:
      return {
        ...state,
        cartItems: [],
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    case SAVE_USER_EMAIL_INFO:
      return {
        ...state,
        userEmailInfo: action.payload,
      };

    default:
      return state;
  }
};
