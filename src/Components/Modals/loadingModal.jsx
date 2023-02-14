import React from "react";
import { Image, Modal } from "react-bootstrap";
import loading2 from "../../assets/loading2.gif";
export default function LoadingModal({ isAlertSec, alertSec }) {
  return (
    <Modal show={isAlertSec}>
      <Modal.Header>
        <Modal.Title>{alertSec}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={loading2} style={{ width: "5%" }} />
      </Modal.Body>
    </Modal>
  );
}
