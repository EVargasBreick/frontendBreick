import { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastComponent = ({ show, setShow, autoclose, text, type }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setShowToast(show);
    if (show && autoclose > 0) {
      setTimeout(() => setShowToast(!showToast), autoclose * 1000);
    }
  }, [show, autoclose]);

  const handleClose = () => {
    setShowToast(!showToast);
    setShow(!show);
  };

  return (
    <ToastContainer className="p-3" position="top-end" style={{ zIndex: 20 }}>
      <Toast
        onClose={handleClose}
        show={showToast}
        delay={autoclose * 1000}
        autohide
      >
        <Toast.Header closeButton={false} className={`bg-${type}  text-white`}>
          <strong className="mr-auto">{type}</strong>
        </Toast.Header>
        <Toast.Body className="text-black">{text}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
