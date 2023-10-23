import React from "react";
import { Modal, Button } from "react-bootstrap";

export const ConfirmModal = ({
  show,
  handleSubmit,
  handleCancel,
  title,
  text,
  isButtons = true,
}) => {
  return (
    <Modal show={show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <Button variant="secondary" onClick={handleCancel}>
          X
        </Button>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      {isButtons && (
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancel} autoFocus>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Confirmar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};
