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
import { logRejected } from "../services/rejectedServices";
export default function FormRejectedOrders() {
  const [orderList, setOrderList] = useState([]);
  const [auxOrderList, setAuxOrderList] = useState([]);
  const [filtered, setFiltered] = useState("");
  const [idToPrint, setIdToPrint] = useState("");
  const [isPrint, setIsPrint] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [productList, setProductList] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [userId, setUserId] = useState("");
  const [rejectedOrder, setRejectedOrder] = useState({});
  const [readyOrder, setReadyOrder] = useState({});
  const [motiveError, setMotiveError] = useState("");
  const componentRef = useRef();
  const buttonRef = useRef();
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserId(JSON.parse(UsuarioAct).idUsuario);
    }
    const orders = ordersToReady();
    orders.then((res) => {
      console.log("Pedidos listos", res.data.data);
      setOrderList(res.data.data[0]);
      setAuxOrderList(res.data.data[0]);
    });
  }, []);
  useEffect(() => {
    if (isPrint) {
      buttonRef.current.click();
    }
  }, [isPrint]);
  useEffect(() => {
    if (motivo.length > 0) {
      setMotiveError("");
    }
  }, [motivo]);

  function filterOrders(value) {
    setFiltered(value);
    const newList = auxOrderList.filter((dt) =>
      dt.nroOrden.toLowerCase().includes(value.toLowerCase())
    );
    setOrderList([...newList]);
  }
  function rePrint(ol) {
    setIdToPrint(ol.nroOrden);
    const details = rePrintTransferOrder(ol.idOrden, ol.tipo);
    details.then((dt) => {
      const list = [
        {
          fechaSolicitud: ol.fechaCrea,
          id: ol.nroOrden,
          usuario: ol.usuario,
          productos: dt.data.data[0],
          rePrint: true,
        },
      ];
      console.log("Detalles a imprimir", list);
      setProductList(list);
      setIsPrint(true);
    });
  }
  function afterPrint() {
    setIsPrint(false);
  }

  function rejectOrder() {
    if (motivo.length > 0) {
      const ol = rejectedOrder;
      const body = {
        motivo: motivo,
        idOrden: ol.nroOrden,
        idUsuario: userId,
        fechaRegistro: dateString(),
        tipo: ol.tipo,
        intId: ol.idOrden,
      };
      console.log("Body body", body);
      const logged = logRejected(body);
      logged
        .then((lg) => {
          const changed = updateReady(
            ol.idOrden,
            2,
            ol.tipo == "P" ? "pedidos" : "traspaso"
          );
          changed
            .then((ch) => {
              console.log("Todo bieeen");
              window.location.reload();
            })
            .catch((err) => {
              console.log("Error al cambiar estado", err);
            });
        })
        .catch((err) => {
          console.log("Error al loggear", err);
        });
    } else {
      console.log("aa");
      setMotiveError("Por favor, proporcione un motivo para el rechazo");
    }
  }

  function updateReadyOrder() {
    const ol = readyOrder;
    const changed = updateReady(
      ol.idOrden,
      1,
      ol.tipo == "P" ? "pedidos" : "traspaso"
    );
    changed.then((res) => {
      window.location.reload();
    });
  }

  return (
    <div>
      <div className="formLabel">PEDIDOS Y TRASPASOS RECHAZADOS</div>
      <div className="simpleTableContainer">
        <Table className="simpleTable">
          <thead>
            <tr className="tableHeader">
              <th>Id Orden</th>
              <th>Usuario</th>
              <th>Fecha Creacion</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((ol, index) => {
              return (
                <tr key={index} className="tableRow">
                  <td>{ol.nroOrden}</td>
                  <td>{ol.usuario}</td>
                  <td>{ol.fechaCrea}</td>
                  <td className="columnButton">
                    <Button variant="warning">Ver detalles</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {isPrint ? (
        <div>
          <div hidden>
            <OrderNote productList={productList} ref={componentRef} />
          </div>
          <ReactToPrint
            trigger={() => (
              <Button
                variant="warning"
                className="yellowLarge"
                ref={buttonRef}
                hidden
              >
                Imprimir ordenes
              </Button>
            )}
            content={() => componentRef.current}
            onAfterPrint={() => afterPrint()}
          />
        </div>
      ) : null}
    </div>
  );
}
