import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ConfirmModal } from "./confirmModal";
import Cookies from "js-cookie";
import { userService } from "../../services/userServices";
import ToastComponent from "./Toast";

const ChangePasswordModal = ({ show, handleClose }) => {
  const [originalPassword, setOriginalPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("");

  const handleSubmit = () => {
    if (newPassword !== confirmNewPassword) {
      setError("La nueva contraseña no coincide con la confirmación.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Contraseña debe ser de 6 caracteres minimo.");
      return;
    }
    setShowConfirmModal(true);
  };

  const changePassword = async () => {
    try {
      const response = await userService.changePassword(
        originalPassword,
        newPassword,
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      setToastText(response);
      setToastType("success");
    } catch (error) {
      setToastText(
        error?.response?.data?.error ?? "Error al cambiar contraseña"
      );
      setToastType("danger");
    } finally {
      setShowToast(!showToast);
    }
  };

  return (
    <>
      <ToastComponent
        show={showToast}
        setShow={setShowToast}
        autoclose={2}
        text={toastText}
        type={toastType}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="originalPassword">
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={originalPassword}
                onChange={(e) => setOriginalPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirmNewPassword">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </Form.Group>
            {error && <div className="text-danger">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            type="button"
            onClick={() => {
              handleSubmit();
            }}
          >
            Cambiar Contraseña
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmModal
        show={showConfirmModal}
        handleSubmit={() => {
          changePassword();
          setShowConfirmModal(false);
          handleClose();
          setConfirmNewPassword("");
          setNewPassword("");
          setOriginalPassword("");
        }}
        handleCancel={() => {
          setShowConfirmModal(false);
        }}
        title="Confirmar Cambio de Contraseña"
        text="¿Está seguro que desea cambiar su contraseña?"
      />
    </>
  );
};

export default ChangePasswordModal;
