import React from "react";
import { Modal, Button } from "react-bootstrap";

export const ConfirmModal = ({
  show,
  handleSubmit,
  handleCancel,
  title,
  text,
}) => {
  return (
    <Modal show={show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} autoFocus>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
