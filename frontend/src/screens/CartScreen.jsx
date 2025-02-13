import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

// Actions for change item quantity in the cart and remove item from the cart
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Getting cart from redux store
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  function changeQuantityHandler(product, qty) {
    dispatch(addToCart({ ...product, qty }));
  }

  function removeFromCartHandler(id) {
    dispatch(removeFromCart(id));
  }

  // Function for redirecting to the shipping page
  function checkOutHandler() {
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/shipping");
    }
  }
  return (
    <Row>
      <Col md={8} className="mb-3 mb-md-0">
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Alert variant="primary">
            Your cart is empty <Link to="/">&larr; Go Back</Link>{" "}
          </Alert>
        ) : (
          <ListGroup>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2} className="mb-2 mb-md-0">
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3} className="mb-2 mb-md-0">
                    <Link to={`/product/${item._id}`} className="link-reset">
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2} className="mb-2 mb-md-0">
                    ${item.price}
                  </Col>
                  <Col md={2} className="mb-2 mb-md-0">
                    <Form.Control
                      as={"select"}
                      value={item.qty}
                      onChange={(e) =>
                        changeQuantityHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h2>
                Subtotal {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                variant="primary"
                disabled={cartItems.length === 0}
                onClick={checkOutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
