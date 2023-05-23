import React, { useState, useEffect } from "react";
import { Button, Modal, Image, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { getOnlyStores } from "../services/storeServices";
import { getPacks } from "../services/packServices";
import { getCurrentStockStore } from "../services/stockServices";
import { updateMultipleStock, updateStock } from "../services/orderServices";

export default function FormRetirePack() {
  // Listas cargadas en render
  const [agencias, setAgencias] = useState([]);
  const [packs, setPacks] = useState([]);
  const [allPacks, setAllPacks] = useState([]);
  // Listas y valores cargados manualmente
  const [selectedPackId, setSelectedPackId] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [productStock, setProductStock] = useState([]);
  const [productList, setProductList] = useState([]);
  const [cantPack, setCantPack] = useState(0);
  // Validadores de estado
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isAgency, setIsAgency] = useState(false);
  const [isPack, setIsPack] = useState(false);
  const [packNStock, setPackNStock] = useState({});
  useEffect(() => {
    const ag = getOnlyStores();
    ag.then((age) => {
      console.log("Age", age);
      setAgencias(age.data);
    });
    const packList = getPacks();
    packList
      .then((res) => {
        console.log("Packs", res);
        setAllPacks(res.data);
        let uniqueArray = res.data.reduce((acc, curr) => {
          if (!acc.find((obj) => obj.nombrePack === curr.nombrePack)) {
            acc.push(curr);
          }
          return acc;
        }, []);

        setPacks(uniqueArray);
      })
      .catch((err) => {});
  }, []);

  const handleClose = () => {
    setIsAlert(false);
    setIsAlertSec(false);
  };
  function getStoreStock(value) {
    setSelectedStoreId(value);
    const stock = getCurrentStockStore(value);
    stock.then((st) => {
      setProductStock(st.data);
      setIsAgency(true);
    });
  }
  function selectPack(value) {
    setIsPack(true);
    setSelectedPackId(value);
    console.log("Pack seleccionado", value);
    const prodList = allPacks.filter((pk) => pk.idPack == value);
    setProductList(prodList);
    getPackQuantity(value);
  }
  function getPackQuantity(id) {
    const packId = allPacks.find((ap) => ap.idPack == id).idPackProd;
    const pack = productStock.find((ps) => ps.idProducto == packId);
    console.log("Stock del pack", pack);
    setPackNStock(pack);
  }
  function retirePack() {
    if (cantPack > packNStock.cantidad) {
      setAlert("La cantidad de packs a retirar no está disponible en stock");
      setIsAlert(true);
    } else {
      setAlertSec("Retirando pack");
      setIsAlertSec(true);
      const selectedProducts = [];
      productList.map((pl) => {
        const prodObj = {
          idProducto: pl.idProducto,
          cantProducto: pl.cantProducto * cantPack,
        };
        selectedProducts.push(prodObj);
      });
      const prodPack = [
        {
          idProducto: packNStock.idProducto,
          cantProducto: cantPack,
        },
      ];
      const objProdsTake = {
        accion: "take",
        idAlmacen: selectedStoreId,
        productos: prodPack,
        detalle: `DCPACK-${selectedPackId}`,
      };
      const objProdsAdd = {
        accion: "add",
        idAlmacen: selectedStoreId,
        productos: selectedProducts,
        detalle: `DVPACK-${selectedPackId}`,
      };

      // const updatedForTake = updateStock(objProdsTake);
      // const updatedForAdd = updateStock(objProdsAdd);

      const updateMultiple = updateMultipleStock([objProdsTake, objProdsAdd]);

      updateMultiple.then((res) => {
        setTimeout(() => {
          if (res) {
            setAlertSec("Pack retirado correctamente");
            setIsAlertSec(true);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }else{
            setAlertSec("Error al retirar pack");
            setIsAlertSec(true);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }, 3100);
      });
    }
  }
  return (
    <div>
      <div className="formLabel">Retirar Packs</div>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
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
            Confirmo, cerrar Mensaje del Sistema
          </Button>
        </Modal.Footer>
      </Modal>

      <Form>
        <div className="formLabel">Agencias</div>
        <Form.Select
          onChange={(e) => {
            getStoreStock(e.target.value);
          }}
          value={selectedStoreId}
        >
          <option>Seleccione agencia</option>
          {agencias.map((ag, index) => {
            return (
              <option key={index} value={ag.idAgencia}>
                {ag.Nombre}
              </option>
            );
          })}
        </Form.Select>
        {selectedStoreId != "" ? (
          <div>
            <div className="formLabel">Packs</div>
            <Form.Select
              onChange={(e) => {
                selectPack(e.target.value);
              }}
            >
              <option>Seleccione pack</option>
              {packs.map((pk, index) => {
                return (
                  <option key={index} value={pk.idPack}>
                    {pk.nombrePack}
                  </option>
                );
              })}
            </Form.Select>
            <div className="formLabel">
              {`Stock disponible de ${packNStock.nombreProducto} en ${packNStock.NombreAgencia}: ${packNStock.cantidad}`}
            </div>
            <div>
              {" "}
              <div className="formLabel">Cantidad de packs a retirar</div>
              <div className="formLabel"></div>
              <Form.Control
                type="Number"
                onChange={(e) => setCantPack(e.target.value)}
              />
            </div>
            <div className="formLabel">
              Detalles de productos del pack seleccionado
            </div>
            <div>
              {isAgency && isPack ? (
                <div>
                  <Table>
                    <thead className="tableHeader">
                      <tr>
                        <th>Nro</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Cantidad a reponer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((pl, index) => {
                        return (
                          <tr key={index} className="tableRow">
                            <td>{index + 1}</td>
                            <td>{pl.nombreProducto}</td>
                            <td>{pl.cantProducto}</td>
                            <td>{pl.cantProducto * cantPack}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr></tr>
                    </tfoot>
                  </Table>
                  <Button
                    variant="warning"
                    className="yellowLarge"
                    onClick={() => retirePack()}
                  >
                    Retirar packs
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Form>
    </div>
  );
}
