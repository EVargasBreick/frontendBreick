import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import loading2 from "../assets/loading2.gif";
import { getProductsWithStock } from "../services/productServices";
import { Button, Form, Table, Image, Modal } from "react-bootstrap";
import LoadingModal from "./Modals/loadingModal";
import { dateString } from "../services/dateServices";
import { registerDrop } from "../services/dropServices";
import { updateStock } from "../services/orderServices";
export default function FormProductDrop() {
  const [productList, setProductList] = useState([]);
  const [auxproductList, setauxProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({});
  const [motivo, setMotivo] = useState("");
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [isError, setIsError] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [userId, setUserid] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      const idAlmacen = JSON.parse(Cookies.get("userAuth")).idAlmacen;
      setUserid(JSON.parse(Cookies.get("userAuth")).idUsuario);
      setStoreId(idAlmacen);
      console.log("Id almacen", idAlmacen);
      const prods = getProductsWithStock(idAlmacen, "all");
      prods.then((product) => {
        setProductList(product.data);
        setauxProductList(product.data);
      });
    }
    console.log("Length", JSON.stringify(selectedProduct).length);
  }, []);
  function filterProducts(value) {
    setSearch(value);
    const newList = auxproductList.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    setProductList([...newList]);
  }
  function selectProduct(prodId) {
    console.log("idProducto", prodId);
    const prod = auxproductList.find((aux) => aux.idProducto == prodId);
    console.log("Producto seleccionado", prod);
    const prodObj = {
      nombreProducto: prod.nombreProducto,
      codInterno: prod.codInterno,
      idProducto: prod.idProducto,
      cantProducto: 0,
      cant_Actual: prod.cant_Actual,
    };
    setSelectedProduct(prodObj);
    setProductList(auxproductList);
  }
  const handleClose = () => {
    setIsAlert(false);
    setIsError(false);
  };

  function changeQuantity(value) {
    const aux = selectedProduct;
    const prodObj = {
      nombreProducto: aux.nombreProducto,
      codInterno: aux.codInterno,
      idProducto: aux.idProducto,
      cantProducto: value,
      cant_Actual: aux.cant_Actual,
    };
    setSelectedProduct(prodObj);
  }

  function dropProduct() {
    if (motivo == "") {
      setIsError(true);
      setAlert("Seleccione un motivo");
      setIsAlert(true);
    } else {
      if (selectedProduct.cantProducto < 1) {
        setIsError(true);
        setAlert("Ingrese una cantidad valida");
        setIsAlert(true);
      } else {
        setAlertSec("Dando de baja...");
        setIsAlertSec(true);
        const objBaja = {
          motivo: motivo,
          fechaBaja: dateString(),
          idUsuario: userId,
          idAlmacen: storeId,
          productos: [selectedProduct],
        };
        const bajaRegistrada = registerDrop(objBaja);
        bajaRegistrada.then((res) => {
          const objStock = {
            accion: "take",
            idAlmacen: storeId,
            productos: [selectedProduct],
          };
          const updatedStock = updateStock(objStock);
          updatedStock.then((response) => {
            setAlertSec("Baja registrada correctamente");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
        });
      }
    }
  }

  return (
    <div>
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          {!isError ? (
            <Button variant="success" onClick={handleClose}>
              Confirmar
            </Button>
          ) : null}
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <LoadingModal isAlertSec={isAlertSec} alertSec={alertSec} />
      <div className="formLabel">BAJA DE PRODUCTOS</div>
      <div>
        <Form>
          <Form.Label>Lista de Productos</Form.Label>
          <Form.Group className="columnForm">
            <Form.Select
              className="mediumForm"
              onChange={(e) => selectProduct(e.target.value)}
            >
              <option>Seleccione un producto</option>
              {productList.map((pl, index) => {
                return (
                  <option value={pl.idProducto} key={index}>
                    {pl.nombreProducto}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="buscar"
              className="mediumForm"
              onChange={(e) => {
                filterProducts(e.target.value);
              }}
              value={search}
            />
          </Form.Group>
        </Form>
      </div>

      <div className="formLabel">Detalles producto seleccionado</div>
      {JSON.stringify(selectedProduct).length > 2 ? (
        <div>
          <Table>
            <thead className="tableHeader">
              <tr>
                <th>Cod Interno</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Restante</th>
              </tr>
            </thead>
            <tbody className="tableRow">
              <tr>
                <td>{selectedProduct?.codInterno}</td>
                <td>{selectedProduct?.nombreProducto}</td>
                <td style={{ width: "15%" }}>
                  {
                    <Form.Control
                      value={selectedProduct.cantProducto}
                      onChange={(e) => changeQuantity(e.target.value)}
                    />
                  }
                </td>
                <td>
                  {selectedProduct?.cant_Actual - selectedProduct?.cantProducto}
                </td>
              </tr>
            </tbody>
          </Table>
          <Form.Label>Motivo de la baja</Form.Label>
          <Form.Select
            className="columnForm"
            onChange={(e) => setMotivo(e.target.value)}
          >
            <option value={""}>Seleccione un motivo</option>
            <option value={"Presentación mala de empaque/ envoltura"}>
              Presentación mala de empaque/ envoltura
            </option>
            <option value={"Producto vencido"}>Producto vencido</option>
            <option value={"Producto con afloramiento de manteca"}>
              Producto con afloramiento de manteca
            </option>
            <option value={"Producto roto"}>Producto roto</option>
            <option value={"Producto derretido"}>Producto derretido</option>
          </Form.Select>
          <Button
            className="yellowLarge"
            variant="warning"
            onClick={() => dropProduct()}
          >
            Dar de baja
          </Button>
        </div>
      ) : null}
    </div>
  );
}