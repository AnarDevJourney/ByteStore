import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import Loader from "./Loader";
import { toast } from "react-toastify";

// Function for log out users
import { logoutAPI } from "../services/apiAuthentication";

// Action for deleting user info from redux store and localstorage
import { logout } from "../slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Getting cart items from redux store
  const { cartItems } = useSelector((state) => state.cart);
  // Getting user data from redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Logout mutation
  const mutation = useMutation({
    mutationFn: logoutAPI,
    onSuccess: (data) => {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  function logoutHandler() {
    mutation.mutate();
  }

  if (mutation.isPending) {
    return <Loader />;
  }
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md">
        <Container>
          <Navbar.Brand>
            <Link to="/" className="link-reset">
              ByteStore
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link>
                <Link to="/cart" className="link-reset">
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="primary" className="mx-2">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item>
                    <Link to="/profile" className="link-reset">
                      Profile
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link>
                  <Link to="/login" className="link-reset">
                    <FaUser /> Sign In
                  </Link>
                </Nav.Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item>
                    <Link to="/admin/productlist" className="link-reset">
                      Products
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="/admin/userlist" className="link-reset">
                      Users
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="/admin/orderlist" className="link-reset">
                      Orders
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
