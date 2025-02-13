import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "./Message";
import Loader from "./Loader";

// Function for updating order to paid
import { updateToPaid } from "../services/apiOrders";

const PaymentForm = ({ orderId }) => {
  // Initializing React Hook Form
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();

  // Payment mutation
  const { mutate: updateToPaidMutation, isPending: isPendingPayment } =
    useMutation({
      mutationFn: () => updateToPaid(orderId),
      onSuccess: (data) => {
        toast.success("Order paid successfully");
        queryClient.invalidateQueries({
          queryKey: ["order"],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Payment Failed");
      },
    });

  if (isPendingPayment) {
    return <Loader />;
  }

  function onSubmit() {
    updateToPaidMutation();
  }

  return (
    <Card className="mt-3 p-3">
      <h4>Pay With Debit Or Credit Card</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="my-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter card number"
            {...register("cardNumber", {
              required: "This field is required",
              pattern: {
                value: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/,
                message: "Please provide a valid Visa or MasterCard number",
              },
            })}
          ></Form.Control>
          {errors?.cardNumber?.message && (
            <Message
              variant="danger"
              message={errors.cardNumber.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Expiration Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="MM/YY"
            {...register("expirationDate", {
              required: "This field is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                message: "Please provide a valid expiration date (MM/YY)",
              },
            })}
          ></Form.Control>
          {errors?.expirationDate?.message && (
            <Message
              variant="danger"
              message={errors.expirationDate.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter CVV"
            {...register("cvv", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]{3}$/,
                message: "CVV must be 3 digits",
              },
            })}
          ></Form.Control>
          {errors?.cvv?.message && (
            <Message
              variant="danger"
              message={errors.cvv.message}
              margin="mt-3"
            />
          )}
        </Form.Group>
        <Button type="submit" variant="primary">
          Pay
        </Button>
      </Form>
    </Card>
  );
};

export default PaymentForm;
