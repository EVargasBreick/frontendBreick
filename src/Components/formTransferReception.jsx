import React, { useEffect, useState } from "react";
import {
  acceptTransferById,
  transitTransfer,
} from "../services/transferServices";
import Cookies from "js-cookie";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "../styles/formLayouts.css";
import { logRejected } from "../services/rejectedServices";
import { updateStock } from "../services/orderServices";
import { dateString } from "../services/dateServices";
import LoadingModal from "./Modals/loadingModal";
export default function FormTransferReception() {
  const [storeId, setStoreId] = useState();
  const [transferList, setTransferList] = useState([]);
  const [fullTransfers, setFullTransfers] = useState([]);
  const [selectedTransferId, setSelectedTransferId] = useState("");
  const [transferDetails, setTransferDetails] = useState({});
  const [transferProucts, setTransferProducts] = useState([]);
  const [auxTransferProducts, setAuxTransferProducts] = useState([]);
  const [lessProducts, setLessProducts] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [isLess, setIsLess] = useState(false);
  const [userId, setUserId] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setStoreId(JSON.parse(UsuarioAct).idAlmacen);
      setUserId(JSON.parse(UsuarioAct).idUsuario);
      const pl = transitTransfer(JSON.parse(UsuarioAct).idAlmacen);
      pl.then((response) => {
        console.log("En transito", response);
        setFullTransfers(response.data);
        let uniqueArray = response.data.reduce((acc, curr) => {
          if (!acc.find((obj) => obj.idTraspaso === curr.idTraspaso)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setTransferList(uniqueArray);
      });
    }
  }, []);
  function selectTransfer(transfer) {
    const id = JSON.parse(transfer).idTraspaso;
    setSelectedTransferId(id);
    setTransferDetails(JSON.parse(transfer));

    const filtered = fullTransfers.filter((ft) => ft.idTraspaso == id);
    const arrayProd = [];
    filtered.map((ft) => {
      const obj = {
        idProducto: ft.idProducto,
        cantProducto: ft.cantidadProducto,
        correcto: true,
        codInterno: ft.codInterno,
        nombreProducto: ft.nombreProducto,
      };
      arrayProd.push(obj);
    });
    setTransferProducts(arrayProd);
    setAuxTransferProducts(arrayProd);
  }
  function handelCheck(index, checked) {
    const updatedArray = transferProucts.map((obj, i) => {
      if (i == index) {
        return {
          ...obj,
          correcto: checked,
        };
      }
      return obj;
    });
    setTransferProducts(updatedArray);
  }
  function changeQuantities(index, cantidad) {
    const updatedArray = transferProucts.map((obj, i) => {
      if (i == index) {
        return {
          ...obj,
          cantProducto:
            cantidad >
            auxTransferProducts.find((aux) => aux.idProducto == obj.idProducto)
              .cantProducto
              ? obj.cantProducto
              : cantidad,
        };
      }
      return obj;
    });
    setTransferProducts(updatedArray);
  }
  function verifyProducts() {
    const lessArray = [];
    auxTransferProducts.map((aux) => {
      if (
        aux.cantProducto >
        transferProucts.find((tp) => tp.idProducto == aux.idProducto)
          .cantProducto
      ) {
        const obj = {
          idProducto: aux.idProducto,
          cantProducto:
            aux.cantProducto -
            transferProucts.find((tp) => tp.idProducto == aux.idProducto)
              .cantProducto,
        };
        lessArray.push(obj);
      }
    });
    setLessProducts(lessArray);
    if (lessArray.length > 0) {
      setIsLess(true);
    } else {
      acceptTransfer(false);
    }
  }

  function acceptTransfer(condition) {
    setAlertSec("Aceptando traspaso");
    setIsAlertSec(true);
    if (condition) {
      const body = {
        motivo: motivo,
        idOrden: transferDetails.nroOrden,
        idUsuario: userId,
        fechaRegistro: dateString(),
        tipo: "T",
        intId: transferDetails.idTraspaso,
      };
      const logged = logRejected(body);
      logged.then(() => {
        const returnBody = {
          accion: "add",
          idAlmacen: "AL001",
          productos: lessProducts,
        };
        const returned = updateStock(returnBody);
        returned.then(() => {
          const addBody = {
            accion: "add",
            idAlmacen: storeId,
            productos: transferProucts,
          };
          const added = updateStock(addBody);
          added.then((res) => {
            const accepted = acceptTransferById(transferDetails.idTraspaso);
            accepted.then((acc) => {
              setAlertSec("Traspaso aceptado correctamente");
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            });
          });
        });
      });
    } else {
      const addBody = {
        accion: "add",
        idAlmacen: storeId,
        productos: transferProucts,
      };
      const added = updateStock(addBody);
      added.then((res) => {
        const accepted = acceptTransferById(transferDetails.idTraspaso);
        accepted.then((acc) => {
          setAlertSec("Traspaso aceptado correctamente");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      });
    }
  }

  return (
    <div>
      <div className="formLabel">RECEPCIÓN DE TRASPASOS</div>
      <LoadingModal isAlertSec={isAlertSec} alertSec={alertSec} />
      <Modal show={isLess}>
        <Modal.Header className="modalHeader">
          Cambio en cantidades
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>
              Uno de los productos tiene menos de la cantidad indicada en el
              traspaso, indique el motivo
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              maxLength="250"
            />

            <div>{`${250 - motivo.length} caracteres restantes`}</div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modalHeader">
          <Button
            variant="success"
            onClick={() => {
              acceptTransfer(true);
            }}
          >
            Aceptar Traspaso
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              setIsLess(false);
              setMotivo("");
            }}
          >
            Volver
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Form>
          <Form.Select onChange={(e) => selectTransfer(e.target.value)}>
            <option>Seleccione traspaso</option>
            {transferList.map((tl, index) => {
              return (
                <option value={JSON.stringify(tl)} key={index}>
                  {tl.nroOrden}
                </option>
              );
            })}
          </Form.Select>
        </Form>
      </div>
      {selectedTransferId != "" ? (
        <div>
          <div className="formLabel">DETALLES TRASPASO SELECCIONADO</div>
          <Table>
            <thead>
              <tr className="tableHeader">
                <th colSpan={2}>Id Traspaso</th>
                <th colSpan={2}>Fecha creación</th>
              </tr>
              <tr className="tableRow">
                <td colSpan={2}>{transferDetails.nroOrden}</td>
                <td colSpan={2}>{transferDetails.fechaCrea}</td>
              </tr>
              <tr className="tableHeader">
                <td colSpan={4}>Detalle productos</td>
              </tr>
            </thead>
            <tbody>
              <tr className="tableHeader">
                <th>Cod Interno</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Recibido</th>
              </tr>
              {transferProucts.map((tp, index) => {
                return (
                  <tr key={index} className="tableRow">
                    <td>{tp.codInterno}</td>
                    <td>{tp.nombreProducto}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={tp.cantProducto}
                        disabled={tp.correcto}
                        max={
                          auxTransferProducts.find(
                            (aux) => aux.idProducto == tp.idProducto
                          ).cantProducto
                        }
                        min={0}
                        onChange={(e) =>
                          changeQuantities(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div className="checkBoxContainer">
                        <input
                          className="checkBoxInput"
                          type="checkbox"
                          onChange={(e) => handelCheck(index, e.target.checked)}
                          checked={tp.correcto}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Button
            onClick={() => verifyProducts()}
            variant="warning"
            className="yellowLarge"
          >
            Aceptar Traspaso
          </Button>
        </div>
      ) : (
        <div className="formLabel">Seleccione un traspaso en tránsito</div>
      )}
    </div>
  );
}