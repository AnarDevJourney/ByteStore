// Function for fetching products from API
export async function fetchProducts() {
  try {
    const res = await fetch("/api/products");

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch products");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching products"
    );
  }
}

// Function for fetching single product by id
export async function fetchProductById(id) {
  try {
    const res = await fetch(`/api/products/${id}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch product data");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching product data"
    );
  }
}

// Function for creating new product
export async function createProduct() {
  try {
    const res = await fetch(`/api/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Something went wrong. Can not create new product"
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while creating product"
    );
  }
}

// Function for updating product data
export async function updateProduct({
  id,
  name,
  price,
  image,
  brand,
  category,
  countInStock,
  description,
}) {
  const putData = {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
  };

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not update product");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while updating the product"
    );
  }
}

// Function for deleting product
export async function deleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not delete product");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while deleting the product"
    );
  }
}

// Function for creating review
export async function createProductReview({ id, rating, comment }) {
  const postData = {
    rating,
    comment,
  };

  try {
    const res = await fetch(`/api/products/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not create review");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to create review");
  }
}

// Function for fetching top 3 products
export async function getTopProducts() {
  try {
    const res = await fetch("/api/products/top");

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch products");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch top products");
  }
}
