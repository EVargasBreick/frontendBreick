import React, { useState, useEffect } from "react";
import { Button, Modal, Image, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { getOnlyStores } from "../services/storeServices";
import { getPacks } from "../services/packServices";
import { getCurrentStockStore } from "../services/stockServices";
import { updateStock } from "../services/orderServices";

export default function FormAsignPack() {
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
  useEffect(() => {
    const ag = getOnlyStores();
    ag.then((age) => {
      console.log("Agencias cargadas", age.data[0]);
      setAgencias(age.data[0]);
    });
    const packList = getPacks();
    packList
      .then((res) => {
        console.log("Pcks", res.data.data[0]);
        setAllPacks(res.data.data[0]);
        let uniqueArray = res.data.data[0].reduce((acc, curr) => {
          if (!acc.find((obj) => obj.nombrePack === curr.nombrePack)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        console.log("UNIQUE", uniqueArray);
        setPacks(uniqueArray);
      })
      .catch((err) => {
        console.log("Error al cargar", err);
      });
  }, []);

  const handleClose = () => {
    setIsAlert(false);
    setIsAlertSec(false);
    window.location.reload();
  };
  function getStoreStock(value) {
    setSelectedStoreId(value);
    const stock = getCurrentStockStore(value);
    stock.then((st) => {
      console.log("Probando", st.data[0]);
      setProductStock(st.data[0]);
      setIsAgency(true);
    });
  }
  function selectPack(value) {
    setIsPack(true);
    setSelectedPackId(value);
    console.log(value);
    const prodList = allPacks.filter((pk) => pk.idPack[0] == value);
    console.log("Pack seleccionado", prodList);
    setProductList(prodList);
  }
  function asignPack() {
    const selectedProducts = [];
    productList.map((pl) => {
      const prodObj = {
        idProducto: pl.idProducto,
        cantProducto: pl.cantProducto * cantPack,
      };
      selectedProducts.push(prodObj);
    });
    const objProdsTake = {
      accion: "take",
      idAlmacen: selectedStoreId,
      productos: selectedProducts,
    };
    const updatedForTake = updateStock(objProdsTake);
    updatedForTake.then((resp) => {
      console.log("Store id", selectedStoreId);
      const found = productList.find(
        (pl) => (pl.idPack[0] = selectedPackId)
      ).idPackProd;
      console.log("FOUNDDDD", found);
      const objProdsAdd = {
        accion: "add",
        idAlmacen: selectedStoreId,
        productos: [
          {
            idProducto: found,
            cantProducto: cantPack,
          },
        ],
      };
      const updatedForAdd = updateStock(objProdsAdd);
      updatedForAdd.then((res) => {
        console.log("Respuesta de supuestamente agregar", res);
        setAlertSec("Pack asignado correctamente");
        setIsAlertSec(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    });
  }
  return (
    <div>
      <div className="formLabel">Asignar Packs</div>
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
        <Form.Select
          onChange={(e) => {
            selectPack(e.target.value);
          }}
        >
          <option>Seleccione pack</option>
          {packs.map((pk, index) => {
            return (
              <option key={index} value={pk.idPack[0]}>
                {pk.nombrePack}
              </option>
            );
          })}
        </Form.Select>
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
      </Form>
      <div>
        <div className="formLabel">Cantidad de packs a armar</div>
        <Form>
          <Form.Control
            type="Number"
            onChange={(e) => setCantPack(e.target.value)}
          />
        </Form>
      </div>
      <div className="formLabel">Detalles pack seleccionado</div>
      <div>
        {isAgency && isPack ? (
          <div>
            <Table>
              <thead className="tableHeader">
                <tr>
                  <th>Nro</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Disponible</th>
                  <th>Restante</th>
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
                      <td>
                        {
                          productStock.find(
                            (ps) => pl.idProducto == ps.idProducto
                          ).cantidad
                        }
                      </td>
                      <td>
                        {productStock.find(
                          (ps) => pl.idProducto == ps.idProducto
                        ).cantidad -
                          pl.cantProducto * cantPack}
                      </td>
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
              onClick={() => asignPack()}
            >
              Asignar Pack
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
