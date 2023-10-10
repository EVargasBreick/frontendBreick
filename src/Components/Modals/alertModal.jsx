import React from "react";
import { Image, Modal } from "react-bootstrap";
export default function AlertModal({ isAlertSec, alertSec, setIsAlertSec }) {
  const handleClose = () => {
    setIsAlertSec(false);
  };
  return (
    <Modal show={isAlertSec} onHide={handleClose}>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#6a4593", color: "white" }}
      >
        <Modal.Title>{"Mensaje del sistema"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{alertSec}</Modal.Body>
    </Modal>
  );
}
