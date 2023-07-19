import React, { useState, useEffect } from "react";
import { Button, Table, Image, Modal, Badge, Form } from "react-bootstrap";

import loading2 from "../assets/loading2.gif";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/buttonsStyles.css";
import "../styles/modalStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import { ExportToExcel } from "../services/exportServices";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  transferList,
  transferProducts,
  updateTransfer,
} from "../services/transferServices";

import { TransferPDF } from "./transferPDF";
export default function FormViewTransfer() {
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
  const [estado, setEstado] = useState("");
  const [detalleExcel, setDetalleExcel] = useState();
  const [detalleTraspaso, setDetalleTraspaso] = useState();
  const [auxPedidosList, setAuxPedidosList] = useState([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const tList = transferList("todo");
    tList.then((tl) => {
      console.log("Datos", tl.data);
      setList(tl.data);
      setAuxPedidosList(tl.data);
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
      setDetalleTraspaso(tl);
      setNombreOrigen(tl.nombreOrigen);
      setNombreDestino(tl.nombreDestino);
      setCorreo(tl.correo);
      setNroOrden(tl.nroOrden);
      setFechaSoli(tl.fechaCrea);
      setIdOrigen(tl.idOrigen);
      setIdDestino(tl.idDestino);
      setIdTraspaso(tl.idTraspaso);
      setEstado(tl.estado === 1 || tl.listo === 1 ? 1 : 0);
      const detalleExcel = {
        codigoTraspaso: tl.nroOrden,
        solicitante: tl.correo,
        origen: tl.nombreOrigen,
        destino: tl.nombreDestino,
        fecha: tl.fechaCrea,
        estado:
          tl.estado === 0 && tl.listo === 0
            ? "Pendiente"
            : tl.estado === 1 || tl.listo === 1
            ? "Aprobado"
            : "Cancelado",
      };
      setDetalleExcel(detalleExcel);
      const productList = transferProducts(tl.idTraspaso);
      productList.then((pl) => {
        setProductos(pl.data.response);
        setIsLoading(false);
      });
      resolve(true);
    });
  }

  async function viewTransfer(tl) {
    await setTransfer(tl);
    setIsFormModal(true);
  }
  function filterOrders(value) {
    console.log("Lista", auxPedidosList);
    setFilter(value);
    const filtered = auxPedidosList.filter((entry) =>
      entry.nombreCompleto.toString().includes(value)
    );
    console.log("Flag", filtered);
    setList(filtered);
  }
  return (
    <div>
      <div className="formLabel">VER TRASPASOS </div>
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
                <th className="tableColumn">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tableRow">
                <td className="tableColumnSmall">{nroOrden}</td>
                <td className="tableColumn">{correo}</td>
                <td className="tableColumn">{nombreOrigen}</td>
                <td className="tableColumn">{nombreDestino}</td>
                <td className="tableColumn">{fechaSoli}</td>
                <td className="tableColumn">
                  {estado == 0
                    ? "Pendiente"
                    : estado === 1
                    ? "Aprobado"
                    : "Cancelado"}
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Header className="modalHeader">
          <Modal.Title>Productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading ? (
            <Table bordered striped hover className="table">
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
          <PDFDownloadLink
            document={
              <TransferPDF detalle={detalleTraspaso} productos={productos} />
            }
            fileName={`${nroOrden}-${fechaSoli}`}
          >
            <Button variant="outline-danger"> Descargar PDF </Button>
          </PDFDownloadLink>
          <Button
            variant="outline-success"
            onClick={() =>
              ExportToExcel(productos, [detalleExcel], nroOrden, "traspaso")
            }
          >
            Descargar Excel
          </Button>
          <Button
            variant="outline-warning"
            className="outline-yellow"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="secondHalf">
        <Table bordered striped hover className="table">
          <thead>
            <tr className="tableHeader">
              <th className="tableColumnSmall">Codigo</th>
              <th className="tableColumn">Solicitante</th>
              <th className="tableColumn">Origen</th>
              <th className="tableColumn">Destino</th>
              <th className="tableColumn">Fecha Solicitud</th>
              <th className="tableColumnMedium">Estado</th>
              <th className="tableColumnMedium"></th>
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
                  <th className="tableColumnMedium">
                    <Badge
                      bg={
                        tl.estado == 0 && tl.listo == 0
                          ? "warning"
                          : tl.estado === 1 || tl.listo == 1
                          ? "success"
                          : "danger"
                      }
                    >
                      {tl.estado == 0 && tl.listo == 0
                        ? "Pendiente"
                        : tl.estado == 1 || tl.listo == 1
                        ? "Aprobado"
                        : "Cancelado"}
                    </Badge>
                  </th>
                  <td className="tableColumnMedium">
                    <Button
                      className="info"
                      variant="info"
                      onClick={() => {
                        viewTransfer(tl);
                      }}
                    >
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
