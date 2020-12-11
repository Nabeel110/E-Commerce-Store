import axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";
import URL from "../utils/server";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(URL + `/products/${id}`);
  const { product } = await data;
  //   console.log(product);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: product.id,
      name: product.title,
      image: product.image,
      price: product.price,
      quantity: product.quantity,
      qty,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
