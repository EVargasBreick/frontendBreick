import { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import "../../styles/CustomProgressBar.css";
import CustomProgressBar from "../CustomComponents/customProgressBar";
const ProgressToastComponent = ({
  show,
  setShow,
  autoclose,
  text,
  type,
  goal,
  total,
}) => {
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

  const batteryFillPercentage = (total / goal) * 100;

  const getVariant = (progress) => {
    if (progress < 20) {
      return "#D14224";
    } else if (progress < 35) {
      return "#E66C00";
    } else if (progress < 50) {
      return "#FFA500";
    } else if (progress < 75) {
      return "#ffd700";
    } else if (progress < 90) {
      return "#00EE00";
    } else {
      return "#00FF00";
    }
  };

  return (
    <ToastContainer
      className="p-3"
      position="bottom-end"
      style={{ zIndex: 20 }}
    >
      <Toast
        onClose={handleClose}
        show={showToast}
        delay={autoclose * 1000}
        autohide
        style={{ backgroundColor: "white" }}
      >
        <Toast.Header
          closeButton={false}
          style={{ backgroundColor: "#6a4593", color: "white" }}
        >
          <strong className="mr-auto">{"Tu meta diaria"}</strong>
        </Toast.Header>
        <Toast.Body className="text-black">
          <div
            style={{ margin: "5px" }}
          >{`Tu total diario hasta ahora es ${total} Bs`}</div>
          <div style={{ margin: "5px" }}>{` Tu meta de hoy es ${goal} Bs`}</div>
          {goal - total > 0 ? (
            <div style={{ margin: "5px" }}>{` Estás a ${
              goal - total
            } Bs de alcanzar tu meta`}</div>
          ) : (
            <div
              style={{ margin: "5px" }}
            >{`Alcanzaste tu meta! Sigue aportando a tus metas mensuales`}</div>
          )}

          <div style={{ marginTop: "20px" }}>
            <CustomProgressBar
              bgcolor={getVariant(batteryFillPercentage)}
              progress={batteryFillPercentage}
              height={25}
            />
          </div>

          <div className="mr-auto">
            {batteryFillPercentage < 100
              ? `${batteryFillPercentage.toFixed(2)}%`
              : "100%"}
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ProgressToastComponent;
