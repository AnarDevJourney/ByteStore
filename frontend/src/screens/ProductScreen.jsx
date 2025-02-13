import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Card,
  ListGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Rating from "../components/Rating";
import { toast } from "react-toastify";

// Function for fetching product data by id and creating roduct review
import { fetchProductById, createProductReview } from "../services/apiProducts";

// Action for adding item into cart
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Getting product id from URL
  const { id: productId } = useParams();

  // Fetching product data
  const {
    data: product,
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
  });

  const queryClient = useQueryClient();

  // Create review mutation
  const mutation = useMutation({
    mutationFn: createProductReview,
    onSuccess: () => {
      toast.success("Review added successfully");
      queryClient.invalidateQueries({
        queryKey: ["product"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create review");
    },
  });

  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  function handleAddToCart() {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    mutation.mutate({ id: productId, rating, comment });
  }

  if (isLoading || mutation.isPending) {
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
      <>
        <Row>
          <Col md={5} className="mb-3 mb-md-0">
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <ListGroup>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>Price: </Col>
                    <Col>
                      <strong>{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Quantity: </Col>
                      <Col>
                        <Form.Control
                          as={"select"}
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    className="btn btn-primary"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={handleAddToCart}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row className="review">
          <Col md={6}>
            <h2>Reviews</h2>
            {product.reviews.length === 0 && (
              <Alert variant="info">No Reviews</Alert>
            )}
            <ListGroup>
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>Write a Customer Review</h2>
                {userInfo ? (
                  <Form onSubmit={handleSubmitReview}>
                    <Form.Group controlId="rating" className="my-2">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment" className="my-2">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                  </Form>
                ) : (
                  <Alert variant="info">
                    Please <Link to="/login">Sign In</Link> to write a review
                  </Alert>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </>
    </>
  );
};

export default ProductScreen;
