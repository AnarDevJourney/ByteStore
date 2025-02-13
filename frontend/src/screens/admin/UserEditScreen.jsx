import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { toast } from "react-toastify";

// Functions for fetching user details and updating user data
import {
  getUserDetails,
  updateUserById,
} from "../../services/apiAuthentication";

const UserEditScreen = () => {
  const navigate = useNavigate();
  // Getting user id from URL
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetching user details
  const {
    data: user,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["editinguser", userId],
    queryFn: () => getUserDetails(userId),
  });

  const queryClient = useQueryClient();

  // Update product mutation
  const { mutate: updateUserData, isPending: isUpdatingUserData } = useMutation(
    {
      mutationFn: updateUserById,
      onSuccess: () => {
        toast.success("User data updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["editinguser", "allusers"],
        });
        navigate("/admin/userlist");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update user data");
      },
    }
  );

  // Filling edit form fields with actual product data that we fetched
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  function handleSubmit(e) {
    e.preventDefault();
    updateUserData({
      id: user._id,
      name,
      email,
      isAdmin,
    });
  }

  if (isLoading || isUpdatingUserData) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <Link onClick={() => navigate(-1)} className="btn btn-secondary my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="isadmin" className="my-3">
            <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
