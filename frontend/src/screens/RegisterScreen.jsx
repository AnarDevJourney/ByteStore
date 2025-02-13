import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormContainer from "../components/FormContainer";
import { Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";

// Function for creating new account
import { createNewAccount } from "../services/apiAuthentication";

const RegisterScreen = () => {
  const navigate = useNavigate();
  // Initializing React Hook Form
  const { register, formState, getValues, handleSubmit } = useForm();
  const { errors } = formState;

  // Register mutation
  const mutation = useMutation({
    mutationFn: createNewAccount,
    onSuccess: (data) => {
      toast.success("Account created successfully"); // Succes message
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Register failed");
    },
  });

  function onSubmit({ name, email, password }) {
    mutation.mutate({ name, email, password });
  }

  if (mutation.isPending) {
    return <Loader />;
  }
  return (
    <FormContainer>
      <h1>Create New Account</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="my-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            {...register("name", {
              required: "This field is required",
            })}
          ></Form.Control>
          {errors?.name?.message && (
            <Message
              variant="danger"
              message={errors.name.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3" controlId="name">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
          ></Form.Control>
          {errors?.email?.message && (
            <Message
              variant="danger"
              message={errors.email.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3" controlId="name">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "This field is required",
            })}
          ></Form.Control>
          {errors?.password?.message && (
            <Message
              variant="danger"
              message={errors.password.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3" controlId="name">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: "This field is required",
              validate: (value) =>
                value === getValues().password || "Passwords need to match",
            })}
          ></Form.Control>
          {errors?.confirmPassword?.message && (
            <Message
              variant="danger"
              message={errors.confirmPassword.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
      <Row className="my-3">
        <Col>
          Already have an account? <Link to="/login">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
