import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Error from "../components/Error";
import PaymentForm from "../components/PaymentForm";
import { toast } from "react-toastify";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { formatDateTime } from "../utils/helpers";

// Function for fetching order data
import { getOrderById } from "../services/apiOrders";

// Function for updating order to delivered
import { updateToDelivered } from "../services/apiOrders";

const OrderScreen = () => {
  // Getting order id from URL
  const { id: orderId } = useParams();

  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Fetching order data
  const {
    data: order,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
  });

  const queryClient = useQueryClient();

  // Updating to delivered mutation
  const mutation = useMutation({
    mutationFn: () => updateToDelivered(order._id),
    onSuccess: (data) => {
      toast.success("Order updated to delivered successfully");
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order as delivered");
    },
  });

  function handleClickDelivered() {
    mutation.mutate();
  }

  if (isLoading || mutation.isPending) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <h1 className="mb-2">Order</h1>
      <h4 className="mb-3 mb-md-2">{order._id}</h4>
      <Row>
        <Col md={8} className="mb-3 mb-md-0">
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Alert variant="success">
                  Delivered on: {formatDateTime(order.deliveredAt)}
                </Alert>
              ) : (
                <Alert variant="danger">Not delivered</Alert>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Alert variant="success">
                  Paid on: {formatDateTime(order.paidAt)}
                </Alert>
              ) : (
                <Alert variant="danger">Not paid</Alert>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item>
                    <Row>
                      <Col md={1} className="mb-2 mb-md-0">
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col className="mb-2 mb-md-0">{item.name}</Col>
                      <Col md={4}>
                        {item.qty} x ${item.price} = $
                        {(item.qty * item.price).toFixed(2)}
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
                  <Col>Items Price</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Price: </Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax Price: </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price: </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleClickDelivered}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
          {!order.isPaid && !userInfo.isAdmin && (
            <PaymentForm orderId={order._id} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
