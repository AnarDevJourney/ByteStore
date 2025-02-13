import { Alert } from "react-bootstrap";

const Message = ({ variant, message, margin }) => {
  return (
    <Alert variant={variant} className={margin}>
      {message}
    </Alert>
  );
};

export default Message;
