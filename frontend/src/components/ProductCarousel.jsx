import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import Error from "./Error";

// Function for fetching top 3 products
import { getTopProducts } from "../services/apiProducts";

const ProductCarousel = () => {
  // Fetching top 3 products
  const {
    data: topProducts,
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["topproducts"],
    queryFn: getTopProducts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <Carousel pause="hover" className="bg-dark mb-4">
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} ${product.price}
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
