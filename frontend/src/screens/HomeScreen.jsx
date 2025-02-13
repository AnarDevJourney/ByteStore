import { useQuery } from "@tanstack/react-query";
import { Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Product from "../components/Product";
import ProductCarousel from "../components/ProductCarousel";

// Functions for fetching products and top 3 products
import { fetchProducts } from "../services/apiProducts";

const HomeScreen = () => {
  // Fetching products
  const {
    data: products,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <ProductCarousel />
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
