// Function for placing a new order
export async function placeOrder(orderData) {
  try {
    const res = await fetch(`/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not place new order");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
}

// Function for fetching a single order by ID
export async function getOrderById(id) {
  try {
    const res = await fetch(`/api/orders/${id}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch order");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching order"
    );
  }
}

// Function for updating order to paid
export async function updateToPaid(id) {
  try {
    const res = await fetch(`/api/orders/${id}/pay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Something went wrong in payment");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for fetching user's orders
export async function getMyOrders() {
  try {
    const res = await fetch("/api/orders/mine");

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch orders");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching orders"
    );
  }
}

// Function for fetching all orders
export async function getAllOrders() {
  try {
    const res = await fetch("/api/orders");

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch orders");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching orders"
    );
  }
}

// Function for updating order to delivered
export async function updateToDelivered(id) {
  try {
    const res = await fetch(`/api/orders/${id}/deliver`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message ||
          "Something went wrong can not update order to delivered"
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
