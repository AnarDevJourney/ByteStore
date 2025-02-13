import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <Spinner
        animation="border"
        variant="secondary"
        className="loader-spinner"
      />
    </div>
  );
};

export default Loader;
