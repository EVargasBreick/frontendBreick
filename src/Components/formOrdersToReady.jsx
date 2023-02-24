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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
export default function FormOrdersToReady() {
  const navigate = useNavigate();
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
      console.log("Res", res);
      setOrderList(res.data);
      setAuxOrderList(res.data);
    });
    const intervalId = setInterval(() => {
      navigate("/almacenes/recepcionar-pedidos");
    }, 30000);
    return () => {
      clearInterval(intervalId);
    };
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
      console.log("Detalles", dt);
      const list = [
        {
          fechaSolicitud: ol.fechaCrea,
          id: ol.nroOrden,
          usuario: ol.usuario,
          productos: dt.data,
          rePrint: true,
        },
      ];
      setProductList(list);
      setIsPrint(true);
    });
  }

  const handleDownloadPdf = async () => {
    const element = componentRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = 75;
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

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
      <div className="formLabel">ALISTAR PEDIDOS Y TRASPASOS</div>
      <Modal show={isRejected}>
        <Modal.Header className="modalHeader">Motivo del Rechazo</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Por favor ingrese el motivo del rechazo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              maxLength="250"
            />
            <div style={{ color: "red" }}>{`${motiveError}`}</div>
            <div>{`${250 - motivo.length} caracteres restantes`}</div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modalHeader">
          <Button
            variant="danger"
            onClick={() => {
              rejectOrder();
            }}
          >
            Rechazar
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              setIsRejected(false);
              setMotivo("");
            }}
          >
            Volver
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isReady}>
        <Modal.Header className="modalHeader">Pedido listo</Modal.Header>
        <Modal.Body>
          <div>
            Está seguro que quiere marcar como listo? Esta acción no se puede
            deshacer
          </div>
        </Modal.Body>
        <Modal.Footer className="modalHeader">
          <Button
            variant="success"
            onClick={() => {
              updateReadyOrder();
            }}
          >
            Si, marcar como listo
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              setIsReady(false);
            }}
          >
            Volver
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Form>
          <Form.Label>Buscar por código</Form.Label>
          <Form.Control
            type="text"
            value={filtered}
            onChange={(e) => filterOrders(e.target.value)}
          />
        </Form>
      </div>
      <div className="formLabel">Lista de pedidos y traspasos</div>
      <div className="simpleTableContainer">
        <Table className="simpleTable">
          <thead>
            <tr className="tableHeader">
              <th>Id Orden</th>
              <th>Usuario</th>
              <th>Fecha Creacion</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Acciones
              </th>
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
                    <Button
                      variant="success"
                      onClick={() => {
                        setIsReady(true);
                        setReadyOrder(ol);
                      }}
                    >
                      Listo
                    </Button>
                  </td>
                  <td className="columnButton">
                    <Button
                      variant="danger"
                      onClick={() => {
                        setIsRejected(true);
                        setRejectedOrder(ol);
                      }}
                    >
                      Rechazar
                    </Button>
                  </td>
                  <td className="columnButton">
                    <Button variant="warning" onClick={() => rePrint(ol)}>
                      Reimprimir
                    </Button>
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

/*

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

*/
