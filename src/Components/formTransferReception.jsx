import React, { useEffect, useState } from "react";
import {
  acceptTransferById,
  composedAcceptTransfer,
  transitTransfer,
} from "../services/transferServices";
import Cookies from "js-cookie";
import { Button, Form, Modal, Table } from "react-bootstrap";
import "../styles/formLayouts.css";
import { logRejected } from "../services/rejectedServices";
import { updateMultipleStock, updateStock } from "../services/orderServices";
import { dateString } from "../services/dateServices";
import LoadingModal from "./Modals/loadingModal";
import { getStores } from "../services/storeServices";
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
  const [storeList, setStoreList] = useState([]);
  const [originDestinyData, setOriginDestinyData] = useState({});
  useEffect(() => {
    const sList = getStores();
    sList.then((data) => {
      console.log("Lista tiendas", data.data);
      setStoreList(data.data);
    });

    const UsuarioAct = Cookies.get("userAuth");
    const sudostore = Cookies.get("sudostore");
    const selectedStore = sudostore
      ? sudostore
      : JSON.parse(UsuarioAct).idAlmacen;
    if (UsuarioAct) {
      setStoreId(selectedStore);
      setUserId(JSON.parse(UsuarioAct).idUsuario);
      const pl = transitTransfer(selectedStore);
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
    console.log("Selected transfer data", JSON.parse(transfer));
    const id = JSON.parse(transfer).idTraspaso;
    setSelectedTransferId(id);
    setTransferDetails(JSON.parse(transfer));
    const parsedTransfer = JSON.parse(transfer);
    const origen = storeList
      .find((sl) => sl.idAgencia == parsedTransfer.idOrigen)
      ?.Nombre.substring(parsedTransfer.idOrigen.length + 1);
    const destino = storeList
      .find((sl) => sl.idAgencia == parsedTransfer.idDestino)
      ?.Nombre.substring(parsedTransfer.idDestino.length + 1);
    setOriginDestinyData({ origen, destino });
    console.log("Origen y destino", origen, destino);
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
      acceptTransferAlt(false);
    }
  }

  /*function acceptTransfer(condition) {
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
      logged.then(async () => {
        const returnBody = {
          accion: "add",
          idAlmacen: transferDetails.idOrigen,
          productos: lessProducts,
          detalle: `DVRTR-${transferDetails.idTraspaso}`,
        };

        const addBody = {
          accion: "add",
          idAlmacen: storeId,
          productos: transferProucts,
          detalle: `RPRTR-${transferDetails.idTraspaso}`,
        };

        const updateMultiple = await updateMultipleStock([returnBody, addBody]);

        const accepted = await acceptTransferById(transferDetails.idTraspaso);
        await Promise.all([updateMultiple, accepted])
          .then((res) => {
            setAlertSec("Traspaso aceptado correctamente");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          })
          .catch((err) => {
            setAlertSec("Error al aceptar traspaso");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          });
      });
    } else {
      const addBody = {
        accion: "add",
        idAlmacen: storeId,
        productos: transferProucts,
        detalle: `RPRTR-${transferDetails.idTraspaso}`,
      };
      const added = updateStock(addBody);
      added.then((res) => {
        const accepted = acceptTransferById(transferDetails.idTraspaso);
        accepted.then((acc) => {
          setAlertSec("Traspaso aceptado correctamente");
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        });
      });
    }
  }*/

  async function acceptTransferAlt(condition) {
    setAlertSec("Aceptando traspaso");
    setIsAlertSec(true);

    const body = condition
      ? {
          motivo: motivo,
          idOrden: transferDetails.nroOrden,
          idUsuario: userId,
          fechaRegistro: dateString(),
          tipo: "T",
          intId: transferDetails.idTraspaso,
          productos: lessProducts,
          withProds: true,
        }
      : {};
    const returnBody = {
      accion: "add",
      idAlmacen: transferDetails.idOrigen,
      productos: lessProducts,
      detalle: `DVRTR-${transferDetails.idTraspaso}`,
    };
    const addBody = {
      accion: "add",
      idAlmacen: storeId,
      productos: transferProucts,
      detalle: `RPRTR-${transferDetails.idTraspaso}`,
    };
    const stock = [addBody];
    try {
      const accepted = await composedAcceptTransfer({
        stock: stock,
        transfer: transferDetails.idTraspaso,
        condition: condition,
        logRejected: body,
      });
      console.log("Aceptado", accepted);
      setAlertSec("Traspaso aceptado correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      setAlertSec("Error al aceptar traspaso", error);
      console.log("Error al aceptar traspaso", error);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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
              acceptTransferAlt(true);
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
                <th colSpan={2}>Origen</th>
                <th colSpan={2}>Destino</th>
              </tr>
              <tr className="tableRow">
                <td colSpan={2}>{originDestinyData.origen}</td>
                <td colSpan={2}>{originDestinyData.destino}</td>
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
                          style={{ cursor: "pointer" }}
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
