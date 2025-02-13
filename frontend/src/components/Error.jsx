import { Alert, Button } from "react-bootstrap";

const Error = ({ message, onRetry }) => {
  return (
    <Alert variant="danger" className="p-4">
      <p>Error: {message}</p>
      <Button className="outline-danger" onClick={onRetry}>
        Retry
      </Button>
    </Alert>
  );
};

export default Error;
