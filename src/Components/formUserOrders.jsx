import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUserOrders } from "../services/orderServices";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import { Loader } from "./loader/Loader";

export default function FormUserOrders() {
  const [fullList, setFullList] = useState([]);
  const [uniqueList, setUniqueList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [orderModal, setOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userAct = JSON.parse(Cookies.get("userAuth"));
    const orderList = getUserOrders(userAct.idUsuario);
    orderList
      .then((ul) => {
        setFullList(ul.data);
        const array = [];
        for (const order of ul.data) {
          if (!array.find((ar) => ar.idPedido == order.idPedido)) {
            array.push(order);
          }
        }
        console.log("Unique", array);
        setUniqueList(array);
        setLoading(false);
      })
      .catch((err) => {});
  }, []);

  const showDetails = (id) => {
    const filtered = fullList.filter((fl) => fl.idPedido == id);
    setSelectedOrder(filtered);
    setOrderModal(true);
  };

  return (
    <div>
      <div className="formLabel">MIS PEDIDOS</div>
      <div>
        <Table>
          <thead className="tableHeader" style={{ textAlign: "center" }}>
            <tr>
              <th colSpan={8}>Listado de tus pedidos</th>
            </tr>
            <tr>
              <th>Id Pedido</th>
              <th>Nit</th>
              <th>Razon Social</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="tableRow">
            {uniqueList.map((ul, index) => {
              return (
                <tr key={index} style={{ textAlign: "center" }}>
                  <td>{ul.idPedido}</td>
                  <td>{ul.nit}</td>
                  <td>{ul.razonSocial}</td>
                  <td>{ul.fechaCrea}</td>
                  <td>{`${ul.montoTotal?.toFixed(2)} Bs`}</td>
                  <td>{ul.tipo}</td>
                  <td>
                    {
                      <Badge
                        bg={
                          ul.estado == 0
                            ? "warning"
                            : ul.estado == 1
                            ? "success"
                            : "danger"
                        }
                      >
                        {ul.estado == 0
                          ? "Pendiente"
                          : ul.estado == 1
                          ? "Aprobado"
                          : "Cancelado"}
                      </Badge>
                    }
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => showDetails(ul.idPedido)}
                    >
                      Detalles
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div>
        {orderModal && (
          <Modal show={orderModal} size="xl">
            <Modal.Header className="modalHeader">
              Detalles del Pedido
            </Modal.Header>
            <Modal.Body>
              <Table bordered striped>
                <thead>
                  <tr className="tableHeader">
                    <th>Id Pedido</th>
                    <th>Nit - Razon Social</th>
                    <th>Fecha</th>
                  </tr>
                  <tr className="tableRow">
                    <td>{selectedOrder[0]?.idPedido}</td>
                    <td>{`${selectedOrder[0]?.nit} - ${selectedOrder[0]?.razonSocial}`}</td>
                    <td>{selectedOrder[0]?.fechaCrea}</td>
                  </tr>
                  <tr className="tableHeader">
                    <th>Total</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                  <tr className="tableRow">
                    <td>{`${selectedOrder[0]?.montoTotal?.toFixed(2)}`}</td>
                    <td>{selectedOrder[0]?.tipo}</td>
                    <td>
                      {
                        <Badge
                          bg={
                            selectedOrder[0]?.estado == 0
                              ? "warning"
                              : selectedOrder[0]?.estado == 1
                              ? "success"
                              : "danger"
                          }
                        >
                          {selectedOrder[0]?.estado == 0
                            ? "Pendiente"
                            : selectedOrder[0]?.estado == 1
                            ? "Aprobado"
                            : "Cancelado"}
                        </Badge>
                      }
                    </td>
                  </tr>
                  <tr className="tableHeader">
                    <th colSpan={3}>Notas del Pedido</th>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      {selectedOrder[0].notas == ""
                        ? "Sin notas"
                        : selectedOrder[0].notas}
                    </td>
                  </tr>
                  <tr className="tableHeader">
                    <th>Codigo interno</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.map((so, index) => {
                    return (
                      <tr key={index}>
                        <td>{so?.codInterno}</td>
                        <td>{so?.nombreProducto}</td>
                        <td>{so?.cantidadProducto}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={(e) => {
                  setOrderModal(false);
                  setSelectedOrder([]);
                }}
                variant="danger"
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      {loading && <Loader />}
    </div>
  );
}
