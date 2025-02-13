import { createSlice } from "@reduxjs/toolkit";
// Helper function for updating cart informations
import { updateCart } from "../utils/helpers";

// Checking local storage for initial state
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "Credit Card" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Reducer function for adding item to shopping cart
    addToCart: (state, action) => {
      const item = action.payload;

      // Checking if item already exist in the cart or not
      const existItem = state.cartItems.find((i) => i._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((i) =>
          i._id === existItem._id ? item : i
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);
    },
    // Reducer function for deleting item from the cart
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
      return updateCart(state);
    },
    // Reducer function for saving shipping adress im redux store and localstorage
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    // Reducer function for saving payment method in redux store and localstorage
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    // Reducer function for clearing cart
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

// Exporting actions and reducer
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
