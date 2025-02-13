import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import FormContainer from "../components/FormContainer";
import { Row, Col, Form, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

// Function for saving user data in redux
import { setCredentials } from "../slices/authSlice";

// Function to auth users
import { login } from "../services/apiAuthentication";

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Auth user mutation
  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      dispatch(setCredentials({ ...data }));
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    mutation.mutate();
  }

  if (mutation.isPending) {
    return <Loader />;
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>
      <Row className="my-3">
        <Col>
          New customer? <Link to="/register">Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
