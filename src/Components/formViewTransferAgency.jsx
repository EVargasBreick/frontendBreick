import React, { useState, useEffect } from "react";
import { Button, Table, Badge, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/buttonsStyles.css";
import "../styles/modalStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import {
  transferList,
  transferProductList,
} from "../services/transferServices";
import { useRef } from "react";
export default function FormViewTransferAgency() {
  const [list, setList] = useState([]);
  const [auxList, setAuxList] = useState([]);
  const originalList = useRef([]);
  const sudostore = Cookies.get("sudostore");
  const userStore = sudostore
    ? sudostore
    : JSON.parse(Cookies.get("userAuth"))?.idAlmacen;
  const [transferDetaillist, setTransferDetaillist] = useState({});
  const [isDetails, setIsDetails] = useState(false);

  useEffect(() => {
    // get user cookies
    const tList = transferList("todo");
    tList.then((tl) => {
      console.log("All data", tl.data);
      setAuxList(tl.data);
      tl.data = tl.data.filter((t) => t.idOrigen == userStore);
      setList(tl.data);
    });
  }, []);

  function filtrarOrigenDestino(value) {
    console.log("aux data", userStore);
    if (value == "1") {
      const data = auxList.filter((t) => t.idOrigen == userStore);
      setList(data);
    } else {
      const auxData = [...auxList];
      const filtered = auxData.filter((t) => t.idDestino == userStore);
      setList(filtered);
    }
  }

  async function transferDetails(tl) {
    try {
      const parsed = JSON.parse(tl);
      const productList = await transferProductList(parsed.idTraspaso);
      setTransferDetaillist({ detalles: parsed, productos: productList.data });
      setIsDetails(true);
      console.log("Detalles del traspaso", productList);
    } catch (error) {
      console.log("Error en el proceso", error);
    }
  }

  return (
    <div>
      <div className="formLabel">VER TRASPASOS: Agencia {userStore} </div>
      <div className="formLabel">Filtrar por Origen o Destino:</div>
      <div className="formLabel">
        <Form.Select
          className="formInput"
          onChange={(e) => {
            filtrarOrigenDestino(e.target.value);
          }}
        >
          <option value="1">SALIENTES - ORIGEN</option>
          <option value="2">ENTRANTES - DESTINO</option>
        </Form.Select>
      </div>

      <div className="secondHalf">
        <Table striped>
          <thead>
            <tr className="tableHeader">
              <th className="tableColumnSmall">Codigo</th>
              <th className="tableColumn">Origen</th>
              <th className="tableColumn">Destino</th>
              <th className="tableColumn">Fecha Solicitud</th>
              <th className="tableColumnMedium">Estado</th>

              <th className="tableColumnMedium">Recibido</th>
              <th className="tableColumnMedium">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {list.map((tl, index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td className="tableColumnSmall">{tl.nroOrden}</td>
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

                  <th className="tableColumnMedium">
                    <Badge bg={tl.transito == 0 ? "warning" : "success"}>
                      {tl.transito == 0 ? "No" : "Si"}
                    </Badge>
                  </th>
                  <th>
                    <Button
                      variant="success"
                      onClick={() => transferDetails(JSON.stringify(tl))}
                    >
                      Ver
                    </Button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {isDetails && (
        <Modal size="lg" show={isDetails}>
          <Modal.Header className="modalHeader">
            Detalles del traspaso
          </Modal.Header>
          <Modal.Body>
            <Table>
              <thead>
                <tr className="tableHeader">
                  <th>Id Traspaso</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
                <tr className="tableRow">
                  <td>{transferDetaillist.detalles.idTraspaso}</td>
                  <td>{transferDetaillist.detalles.fechaCrea}</td>
                </tr>
                <tr className="tableHeader">
                  <th>Origen</th>
                  <th>Destino</th>
                  <th></th>
                </tr>
                <tr className="tableRow">
                  <td>{transferDetaillist.detalles.nombreOrigen}</td>
                  <td>{transferDetaillist.detalles.nombreDestino}</td>
                </tr>
              </thead>
              <tbody>
                <tr className="tableHeader">
                  <th colSpan={3}>Detalle de Productos</th>
                </tr>
                <tr className="tableHeader">
                  <th>Cod Interno</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                </tr>
                {transferDetaillist.productos.map((pr, index) => {
                  return (
                    <tr key={index} className="tableRow">
                      <td>{pr.codInterno}</td>
                      <td>{pr.nombreProducto}</td>
                      <td> {pr.cantidadProducto}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={() => setIsDetails(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
