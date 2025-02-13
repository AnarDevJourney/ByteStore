import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { toast } from "react-toastify";

// Function for fetching and updating product data
import { updateProduct, fetchProductById } from "../../services/apiProducts";

// Function for image upload
import { uploadImage } from "../../services/apiUploads";

const ProductEditScreen = () => {
  const navigate = useNavigate();

  // Getting product id fromm URL
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  // Fetching product data
  const {
    data: product,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["editingproduct", productId],
    queryFn: () => fetchProductById(productId),
  });

  const queryClient = useQueryClient();

  // Image upload mutation
  const { mutate: uploadImageMutation, isPending: isUploading } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImage(data.image);
      toast.success("Image uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload image");
    },
  });

  // Update product mutation
  const { mutate: updateProductData, isPending: isUpdatingProductData } =
    useMutation({
      mutationFn: updateProduct,
      onSuccess: () => {
        toast.success("Product updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["editingproduct", "allproducts"],
        });
        navigate("/admin/productlist");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update product data");
      },
    });

  // Filling edit form fields with actual product data that we fetched
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  // Handling file upload
  function uploadFileHandler(e) {
    const file = e.target.files[0];
    if (file) {
      uploadImageMutation(file);
    }
  }

  // Handling form submission
  function handleSubmit(e) {
    e.preventDefault();
    updateProductData({
      id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    });
  }

  if (isLoading || isUploading || isUpdatingProductData) {
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
      <FormContainer>
        <h1>Edit Product</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="price" className="my-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="image" className="my-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control
              type="file"
              label="Choose file"
              onChange={uploadFileHandler}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="brand" className="my-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="category" className="my-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="countInStock" className="my-3">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter count in stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="description" className="my-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
