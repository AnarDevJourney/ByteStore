import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Button, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

// Function for creating new order
import { placeOrder } from "../services/apiOrders";

// Action for clearing all cart items after successfully placed order
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Getting cart state from redux store
  const cart = useSelector((state) => state.cart);

  // Placing new order mutation
  const mutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      toast.success("Your order placed successfully"); // Success message
      dispatch(clearCartItems()); // Clearing cart items after placing the order
      navigate(`/order/${data._id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create order");
    },
  });

  function handlePlaceOrder() {
    mutation.mutate({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
  }

  if (mutation.isPending) {
    return <Loader />;
  }

  return (
    <>
      <Row>
        <Col md={8} className="mb-3 mb-md-0">
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup>
                {cart.cartItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1} className="mb-2 mb-md-0">
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <p>{item.name}</p>
                      </Col>
                      <Col md={4}>
                        <p>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </p>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items Price: </Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Price: </Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax Price: </Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price: </Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  variant="primary"
                  disabled={cart.cartItems.lenght === 0}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
