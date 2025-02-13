import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

// Function for fetching orders
import { getAllOrders } from "../../services/apiOrders";

const OrderListScreen = () => {
  // Fetching orders
  const {
    data: orders,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allorders"],
    queryFn: getAllOrders,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <h1>Orders</h1>
      <Table striped bordered responsive hover className="table-sm mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user.name}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid ? (
                  order.paidAt.substring(0, 10)
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  order.deliveredAt.substring(0, 10)
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                <Link to={`/order/${order._id}`}>
                  <Button type="button" variant="secondary">
                    Details
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default OrderListScreen;
