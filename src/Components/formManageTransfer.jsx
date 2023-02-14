import React, { useState, useEffect } from "react";
import { Button, Table, Image, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Switch from "../assets/switch.png";
import loading2 from "../assets/loading2.gif";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/buttonsStyles.css";
import "../styles/modalStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import {
  transferList,
  transferProducts,
  updateTransfer,
} from "../services/transferServices";
import { updateStock } from "../services/orderServices";
export default function FormManageTransfer() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [idOrigen, setIdOrigen] = useState("");
  const [idDestino, setIdDestino] = useState("");
  const [nombreOrigen, setNombreOrigen] = useState("");
  const [nombreDestino, setNombreDestino] = useState("");
  const [productos, setProductos] = useState([]);
  const [list, setList] = useState([]);
  const [isFormModal, setIsFormModal] = useState();
  const [correo, setCorreo] = useState("");
  const [nroOrden, setNroOrden] = useState("");
  const [fechaSoli, setFechaSoli] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [idTraspaso, setIdTraspaso] = useState("");
  const [isVfModal, setIsVfModal] = useState(false);
  const [vfModal, setVfModal] = useState();
  const [action, setAction] = useState("");
  useEffect(() => {
    const tList = transferList("p");
    tList.then((tl) => {
      setList(tl.data[0]);
    });
  }, []);
  const handleClose = () => {
    setIsAlert(false);
    setIsFormModal(false);
    setIsVfModal(false);
  };
  function setTransfer(tl) {
    return new Promise((resolve) => {
      setIsLoading(true);
      setProductos([]);
      setNombreOrigen(tl.nombreOrigen);
      setNombreDestino(tl.nombreDestino);
      setCorreo(tl.correo);
      setNroOrden(tl.nroOrden);
      setFechaSoli(tl.fechaCrea);
      setIdOrigen(tl.idOrigen);
      setIdDestino(tl.idDestino);
      setIdTraspaso(tl.idTraspaso);

      const productList = transferProducts(tl.idTraspaso);
      productList.then((pl) => {
        setProductos(pl.data.response.data[0]);
        setIsLoading(false);
      });
      resolve(true);
    });
  }

  async function viewTransfer(tl) {
    await setTransfer(tl);

    setIsFormModal(true);
  }

  async function viewNotSettedTransfer(tl, action) {
    setAction(action);
    await setTransfer(tl);

    setVfModal(
      action == "cancel" ? "Confirma cancelación?" : "Confirma aprobación?"
    );
    setIsVfModal(true);
  }

  function cancelTransfer() {
    setIsVfModal(false);
    setAlertSec("Cancelando Traspaso");
    setIsAlertSec(true);
    const canceledTransfer = updateTransfer({
      estado: 2,
      idTraspaso: idTraspaso,
    });
    canceledTransfer.then((res) => {
      const returnToStock = updateStock({
        accion: "add",
        idAlmacen: idOrigen,
        productos: productos,
      });
      returnToStock.then((returned) => {
        setIsFormModal(false);
        setAlertSec("Traspaso cancelado correctamente");
        setIsAlertSec(true);
        setTimeout(() => {
          window.location.reload(false);
        }, 1000);
      });
    });
  }
  function approveTransfer() {
    setIsVfModal(false);
    setAlertSec("Aprobando Traspaso");
    setIsAlertSec(true);
    const appTransfer = updateTransfer({
      estado: 1,
      idTraspaso: idTraspaso,
    });
    appTransfer.then((res) => {
      setIsFormModal(false);
      setAlertSec("Traspaso aprobado correctamente");
      setIsAlertSec(true);
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    });
  }
  return (
    <div>
      <div className="formLabel">APROBAR TRASPASOS</div>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isVfModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>{vfModal}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              action == "cancel" ? cancelTransfer() : approveTransfer();
            }}
          >
            Si
          </Button>
          <Button variant="danger" onClick={handleClose}>
            No, volver
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isFormModal}
        onHide={handleClose}
        size="xl"
        className="formModal"
      >
        <Modal.Header className="modalHeader">
          <Modal.Title>{" Detalles Traspaso"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered striped hover className="table">
            <thead>
              <tr className="tableHeader">
                <th className="tableColumnSmall">Codigo Traspaso</th>
                <th className="tableColumn">Solicitante</th>
                <th className="tableColumn">Origen</th>
                <th className="tableColumn">Destino</th>
                <th className="tableColumn">Fecha Solicitud</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tableRow">
                <td className="tableColumnSmall">{nroOrden}</td>
                <td className="tableColumn">{correo}</td>
                <td className="tableColumn">{nombreOrigen}</td>
                <td className="tableColumn">{nombreDestino}</td>
                <td className="tableColumn">{fechaSoli}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Header className="modalHeader">
          <Modal.Title>Productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading ? (
            <Table bordered striped hover className="tableSide">
              <thead>
                <tr className="tableHeader">
                  <th className="tableColumnSmall">Nro</th>
                  <th className="tableColumnSmall">Cod Interno</th>
                  <th className="tableColumn">Producto</th>
                  <th className="tableColumnSmall">Cantidad Solicitada</th>
                  <th className="tableColumnSmall">Cantidad Restante</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((pr, index) => {
                  return (
                    <tr className="tableRow" key={index}>
                      <td className="tableColumnSmall">{index + 1}</td>
                      <td className="tableColumnSmall">{pr.codInterno}</td>
                      <td className="tableColumn">{pr.nombreProducto}</td>
                      <td className="tableColumnSmall">
                        {pr.cantidadProducto}
                      </td>
                      <td className="tableColumnSmall">
                        {pr.cantidadRestante}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div>
              Cargando ... <Image src={loading2} style={{ width: "2%" }} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="greenButton"
            variant="success"
            onClick={() => {
              approveTransfer();
            }}
          >
            Aprobar
          </Button>
          <Button
            className="dangerButton"
            variant="danger"
            onClick={() => {
              cancelTransfer();
            }}
          >
            Cancelar
          </Button>
          <Button variant="warning" className="yellow" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="secondHalf">
        <div className="formLabel">Lista de solicitudes de traspaso</div>
        <Table bordered striped hover className="table">
          <thead>
            <tr className="tableHeader">
              <th className="tableColumnSmall">Codigo</th>
              <th className="tableColumn">Solicitante</th>
              <th className="tableColumn">Origen</th>
              <th className="tableColumn">Destino</th>
              <th className="tableColumn">Fecha Solicitud</th>
              <th className="tableColumnSmall"></th>
              <th className="tableColumnSmall"></th>
              <th className="tableColumnSmall"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((tl, index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td className="tableColumnSmall">{tl.nroOrden}</td>
                  <td className="tableColumn">{tl.correo}</td>
                  <td className="tableColumn">{tl.nombreOrigen}</td>
                  <td className="tableColumn">{tl.nombreDestino}</td>
                  <td className="tableColumn">{tl.fechaCrea}</td>
                  <td className="tableColumnSmall">
                    <Button
                      className="cyan"
                      variant="info"
                      onClick={() => {
                        viewTransfer(tl);
                      }}
                    >
                      Ver
                    </Button>
                  </td>
                  <td className="tableColumnSmall">
                    {" "}
                    <Button
                      className="greenButton"
                      variant="success"
                      onClick={() => {
                        viewNotSettedTransfer(tl, "approve");
                      }}
                    >
                      Aprobar
                    </Button>
                  </td>

                  <td className="tableColumnSmall">
                    <Button
                      className="dangerButton"
                      variant="danger"
                      onClick={() => {
                        viewNotSettedTransfer(tl, "cancel");
                      }}
                    >
                      Cancelar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
