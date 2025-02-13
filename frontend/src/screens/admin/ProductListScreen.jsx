import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { toast } from "react-toastify";

// Functions for fetching, creating and deleting product
import {
  fetchProducts,
  createProduct,
  deleteProduct,
} from "../../services/apiProducts";

const ProductListScreen = () => {
  // Fetching products
  const {
    data: products,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allproducts"],
    queryFn: fetchProducts,
  });

  const queryClient = useQueryClient();

  // Create product mutation
  const { mutate: createNewProduct, isPending: isCreatingNewProduct } =
    useMutation({
      mutationFn: createProduct,
      onSuccess: (data) => {
        toast.success("New product created successfully");
        queryClient.invalidateQueries({
          queryKey: ["allproducts"],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create new product");
      },
    });

  // Delete product mutation
  const { mutate: deleteProductData, isPending: isDeletingProductData } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        toast.success("Product deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["allproducts"],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete product");
      },
    });

  if (isLoading || isCreatingNewProduct || isDeletingProductData) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  function handleCreateNewProduct() {
    createNewProduct();
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            type="button"
            variant="primary"
            className="m-3"
            onClick={handleCreateNewProduct}
          >
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      <Table striped bordered responsive hover className="table-sm mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <Link to={`/admin/product/${product._id}/edit`}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mx-1 mb-2 mb-md-0"
                  >
                    <FaEdit />
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="danger"
                  className="mx-1"
                  onClick={() => deleteProductData(product._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductListScreen;
