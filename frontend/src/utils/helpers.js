// Function for showing numbers as decimals
export function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

// Function for updating cart informations
export function updateCart(state) {
  // Calculating items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculating shipping price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // Calculating tax price
  state.taxPrice = addDecimals(Number(state.itemsPrice * 0.15).toFixed(2));

  // Calculating total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Saving in local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
}

export const formatDateTime = (isoString) =>
  new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
