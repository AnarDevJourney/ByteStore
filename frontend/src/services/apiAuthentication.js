// Function for login
export async function login(email, password) {
  try {
    const res = await fetch("/api/users/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not login");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}

// Function for logout
export async function logoutAPI() {
  try {
    const res = await fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not logout");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}

// Function for register user
export async function createNewAccount({ name, email, password }) {
  try {
    const res = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not create new user");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}

// Function for updating user profile
export async function updateUserProfile({ name, email, password }) {
  const putData = {
    name,
    email,
    password,
  };

  try {
    const res = await fetch(`/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not update your profile");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while updating your profile"
    );
  }
}

// Function for fetch all users (Admin only)
export async function getAllUsers() {
  try {
    const res = await fetch("/api/users");

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch users");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching users"
    );
  }
}

// Function for delete user (Admin only)
export async function deleteUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not delete user");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function for fetch user data by id (Admin only)
export async function getUserDetails(id) {
  try {
    const res = await fetch(`/api/users/${id}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch user details");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching user details"
    );
  }
}

// Function for updating user by ID (Admin only)
export async function updateUserById({ id, name, email, isAdmin }) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, isAdmin }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not update user");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while updating user"
    );
  }
}
