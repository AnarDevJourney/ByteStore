import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { toast } from "react-toastify";

// Function for fetching all users and deleting users
import { getAllUsers, deleteUser } from "../../services/apiAuthentication";

const UserListScreen = () => {
  // Fetching users
  const {
    data: users,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allusers"],
    queryFn: getAllUsers,
  });

  const queryClient = useQueryClient();

  // Delete user mutation
  const { mutate: deleteUserData, isPending: isDeletingUserData } = useMutation(
    {
      mutationFn: deleteUser,
      onSuccess: () => {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["allusers"],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete user");
      },
    }
  );

  if (isLoading || isDeletingUserData) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <h1>Users</h1>
      <Table striped bordered responsive hover className="table-sm mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <FaCheck style={{ color: "green" }} />
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                <Link to={`/admin/user/${user._id}/edit`}>
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
                  onClick={() => deleteUserData(user._id)}
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

export default UserListScreen;
