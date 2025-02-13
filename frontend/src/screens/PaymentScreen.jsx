import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";

// Action for saving payment method in redux store and local storage
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }
  return (
    <FormContainer>
      <h1>Payment Method</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3">
          <Form.Check
            type="radio"
            label="Credit Card"
            value="Credit Card"
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
