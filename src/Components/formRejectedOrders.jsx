import React, { useEffect, useState, useRef } from "react";
import { ordersToReady, updateReady } from "../services/orderServices";
import Form from "react-bootstrap/Form";
import "../styles/generalStyle.css";
import "../styles/tableStyles.css";
import { Button, Modal, Table } from "react-bootstrap";
import { OrderNote } from "./orderNote";
import { rePrintTransferOrder } from "../services/printServices";
import ReactToPrint from "react-to-print";
import Cookies from "js-cookie";
import { dateString } from "../services/dateServices";
import {
  getRejected,
  logRejected,
  reviseRejected,
  updateRejected,
} from "../services/rejectedServices";
export default function FormRejectedOrders() {
  const [orderList, setOrderList] = useState([]);
  const [isDetails, setIsDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [isReviewed, setIsReviewed] = useState(false);
  const [complexRejected, setComplexRejected] = useState({});
  const [complexDetails, setComplexDetails] = useState([]);
  useEffect(() => {
    const orders = getRejected();
    orders.then((res) => {
      console.log("Respuesta de la data", res.data);
      setOrderList(res.data.logged);
      setComplexRejected(res.data.details);
    });
  }, []);

  function viewDetails(ol) {
    const filtered = complexRejected.filter(
      (cr) => cr.idTraspaso == ol.intId && ol.fechaRegistro == cr.fechaHora
    );
    console.log("Detalles filtrados", filtered);
    setComplexDetails(filtered);
    const details = rePrintTransferOrder(ol.intId, ol.tipo);
    details.then((dt) => {
      console.log("Detalles", dt);
      const details = {
        detalles: ol,
        productos: dt.data,
      };
      setOrderDetails(details);
      setIsDetails(true);
    });
  }
  function revisedRejected() {
    const id = orderDetails.detalles.idLogRechazo;
    const revised = reviseRejected(id);
    revised
      .then((res) => {
        const rejected = updateRejected(orderDetails.detalles.intId);
        rejected.then((res) => {
          console.log("Actualizado", res);
          window.location.reload();
        });
      })
      .catch((err) => {
        console.log("Error al marcar como revisado", err);
      });
  }

  return (
    <div>
      {isDetails ? (
        <Modal size="xl" show={isDetails}>
          <Modal.Header className="modalHeaderAlt">
            Detalles del Pedido/Traspaso Rechazado
          </Modal.Header>
          <Modal.Body>
            <div>
              <Table>
                <tbody>
                  <tr className="tableHeaderAlt">
                    <th colSpan={3}>Datos del Pedido/Traspaso</th>
                  </tr>
                  <tr className="tableHeaderYellow">
                    <th>Id del pedido/traspaso</th>
                    <th>Usuario solicitante</th>
                    <th>Fecha Solicitud</th>
                  </tr>
                  <tr className="tableRowSimple">
                    <td>{orderDetails.detalles.idOrden}</td>
                    <td>{orderDetails.productos[0].usuario}</td>
                    <td>{orderDetails.productos[0].fechaCrea}</td>
                  </tr>
                  <tr className="tableHeaderAlt">
                    <th colSpan={3}>Detalles de productos</th>
                  </tr>
                  <tr className="tableHeaderYellow">
                    <th>Codigo Interno</th>
                    <th>Nombre Producto</th>
                    <th>Cantidad</th>
                  </tr>
                  {orderDetails.productos.map((pr, index) => {
                    return (
                      <tr key={index} className="tableRowSimple">
                        <td>{pr.codInterno}</td>
                        <td>{pr.nombreProducto}</td>
                        <td>{pr.cantidadProducto}</td>
                      </tr>
                    );
                  })}
                  <tr className="tableHeaderAlt">
                    <th colSpan={3}>Detalles del rechazo</th>
                  </tr>
                  <tr className="tableHeaderYellow">
                    <th>Usuario que rechazó</th>
                    <th colSpan={2}>Fecha y hora del rechazo</th>
                  </tr>
                  <tr className="tableRowSimple">
                    <td>{orderDetails.detalles.usuarioRechazo}</td>
                    <td colSpan={2}>{orderDetails.detalles.fechaRegistro}</td>
                  </tr>
                  <tr className="tableHeaderYellow">
                    <th colSpan={3}>Motivo del rechazo</th>
                  </tr>
                  <tr className="tableRowSimple">
                    <td colSpan={3}>{orderDetails.detalles.motivo}</td>
                  </tr>
                  {complexDetails.length > 0 && (
                    <tr className="tableHeaderAlt">
                      <th colSpan={3}>Productos a devolver a origen</th>
                    </tr>
                  )}
                  {complexDetails.length > 0 && (
                    <tr className="tableHeaderYellow">
                      <th>Codigo Interno</th>
                      <th>Nombre Producto</th>
                      <th>Cantidad</th>
                    </tr>
                  )}
                  {complexDetails.map((cd, index) => {
                    return (
                      <tr key={index} className="tableRowSimple">
                        <td>{cd.codInterno}</td>
                        <td>{cd.nombreProducto}</td>
                        <td>{cd.cantProducto}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer className="modalHeaderAlt">
            <Button onClick={() => setIsReviewed(true)} variant="success">
              Revisado
            </Button>
            <Button
              onClick={() => setIsDetails(false)}
              variant="warning"
              className="yellow"
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
      <Modal show={isReviewed}>
        <Modal.Header className="modalHeaderAlt">Alerta</Modal.Header>
        <Modal.Body>
          Verifique que se notificó al creador del Pedido antes de marcar como
          revisado.
        </Modal.Body>
        <Modal.Footer className="modalHeaderAlt">
          <Button variant="success" onClick={() => revisedRejected()}>
            Confirmar
          </Button>
          <Button variant="warning" onClick={() => setIsReviewed(false)}>
            Volver
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="formLabel">PEDIDOS Y TRASPASOS RECHAZADOS</div>
      <div className="simpleTableContainer">
        <Table className="simpleTable">
          <thead>
            <tr className="tableHeader">
              <th>Id Orden</th>
              <th>Usuario que rechazó</th>
              <th>Fecha de rechazo</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((ol, index) => {
              return (
                <tr key={index} className="tableRow">
                  <td>{ol.idOrden}</td>
                  <td>{ol.usuarioRechazo}</td>
                  <td>{ol.fechaRegistro}</td>
                  <td className="columnButton">
                    <Button variant="warning" onClick={() => viewDetails(ol)}>
                      Ver detalles
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
