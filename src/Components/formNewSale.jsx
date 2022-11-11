import React, { useState } from "react";
import { Form, Button, Table, Modal, Image } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import { getClient } from "../services/clientServices";
import { useEffect } from "react";
import {
  availableProducts,
  getProducts,
  getProductsWithStock,
  getUserStock,
} from "../services/productServices";
import Cookies from "js-cookie";
import {
  availabilityInterval,
  createOrder,
  getOrderList,
  sendOrderEmail,
  updateStock,
} from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { dateString } from "../services/dateServices";
import FormRegisterClient from "./formRegisterClient";
import { convertToText } from "../services/numberServices";
import QrComponent from "./qrComponent";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./invoicePDF";
export default function FormNewSale() {
  const [isClient, setIsClient] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isLoading, setisLoading] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [prodList, setprodList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [totales, setTotales] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [totalDesc, setTotalDesc] = useState(0);
  const [tipo, setTipo] = useState("normal");
  const [isDesc, setIsDesc] = useState(false);
  const [pedidoFinal, setPedidoFinal] = useState({});
  const [usuarioAct, setUsuarioAct] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [productObj, setProductObj] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [available, setAvailable] = useState([]);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userStore, setUserStore] = useState("");
  const [isCreate, setIsCreate] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [datos, setDatos] = useState("");
  useEffect(() => {
    console.log("Convertidooo", convertToText(2898.5).texto);
    const preNit = Cookies.get("nit");
    if (preNit) {
      setSearch(preNit);
      Cookies.remove("nit");
    }
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      console.log("Usuario actual", UsuarioAct.correo);
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      const disponibles = getProductsWithStock(
        JSON.parse(Cookies.get("userAuth")).idAlmacen,
        "all"
      );
      disponibles.then((fetchedAvailable) => {
        setAvailable(fetchedAvailable.data[0]);
      });
      const interval = setInterval(() => {
        const disponibles = getProductsWithStock(
          JSON.parse(Cookies.get("userAuth")).idAlmacen,
          "all"
        );
        disponibles.then((fetchedAvailable) => {
          setAvailable(fetchedAvailable.data[0]);
        });
      }, 60000);
    }
  }, []);

  function searchClient() {
    setIsSelected(false);
    setClientes([]);
    setisLoading(true);
    const found = getClient(search);
    found.then((res) => {
      setIsClient(true);
      if (res.data.data[0][0]) {
        console.log("Cliente(s) encontrados:", res.data.data);
        setClientes(res.data.data[0]);
        console.log("Clientes encontrados:", res.data.data[0]);
        setisLoading(false);
      } else {
        setIsClient(false);
        setIsAlert(true);
        setAlert("Usuario no encontrado");
      }
    });
  }
  function filterSelectedClient(id) {
    setSelectedClient(id);
    const searchObject = clientes.find((cli) => cli.idCliente === id);
    const array = [];
    array.push(searchObject);
    setClientes(array);
    setIsSelected(true);
    console.log("Cliente seleccionado: ", searchObject);
  }

  function addProductToList(product) {
    const produc = JSON.parse(product);
    var aux = false;
    console.log("Producto seleccionado:", produc);
    selectedProducts.map((sp) => {
      if (sp.codInterno === produc.codInterno) {
        console.log("Producto repetido");
        setAlert("El producto ya se encuentra seleccionado");
        setIsAlert(true);
        aux = true;
      }
    });
    if (!aux) {
      const productObj = {
        codInterno: produc.codInterno,
        cantProducto: "",
        nombreProducto: produc.nombreProducto,
        idProducto: produc.idProducto,
        cant_Actual: produc.cant_Actual,
        cantidadRestante: produc.cant_Actual,
        precioDeFabrica: produc.precioDeFabrica,
        total: 0,
      };
      setSelectedProducts([...selectedProducts, productObj]);
    }
  }

  const handleClose = () => {
    setIsAlert(false);
    setisLoading(false);
    setIsCreate(false);
  };
  function deleteProduct(index) {
    const auxArray = [...selectedProducts];
    auxArray.splice(index, 1);
    setSelectedProducts(auxArray);
  }

  function changeQuantities(index, cantidad, prod) {
    let auxObj = {
      codInterno: prod.codInterno,
      cantProducto: cantidad,
      nombreProducto: prod.nombreProducto,
      idProducto: prod.idProducto,
      cant_Actual: prod.cant_Actual,
      cantidadRestante: prod.cant_Actual - cantidad,
      precioDeFabrica: prod.precioDeFabrica,
      total: prod.precioDeFabrica * cantidad,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
  }

  return (
    <div>
      <div className="formLabel">VENTAS AGENCIA</div>
      {isInvoice ? (
        <div>
          <QrComponent className="hiddenQr" datos={datos} />
          <Modal>
            <Modal.Header closeButton>
              <Modal.Title>CONFIRMAR VENTA</Modal.Title>
            </Modal.Header>
            <Modal.Body>{"Imprimir Factura?"}</Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Imprimir Factura
              </Button>
            </Modal.Footer>
          </Modal>
          <PDFDownloadLink
            fileName={`fileName`}
            document={<InvoicePDF datos={datos} />}
          >
            Click Me
          </PDFDownloadLink>
        </div>
      ) : null}
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ALERTA</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="success" onClick={() => setIsCreate(true)}>
            Crear Cliente
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isCreate} size="xl">
        <Modal.Header>
          <Modal.Title>Clientes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegisterClient isModal={true} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Buscar cliente por nit o razon social"
          className="me-2"
          aria-label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="warning"
          className="search"
          onClick={() => searchClient()}
        >
          {isLoading ? (
            <Image src={loading2} style={{ width: "5%" }} />
          ) : search.length < 1 ? (
            "Buscar todos"
          ) : (
            "Buscar"
          )}
        </Button>
      </Form>
      {isClient ? (
        <div className="tableOne">
          <Table>
            <thead>
              <tr className="tableHeader">
                <th className="tableColumnSmall"></th>
                <th className="tableColumn">Nit</th>
                <th className="tableColumn">Razon Social</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((client, index) => {
                return (
                  <tr key={index} className="tableRow">
                    <td className="tableColumnSmall">
                      <div>
                        <Button
                          variant="warning"
                          className="tableButtonAlt"
                          disabled={isSelected}
                          onClick={() => {
                            filterSelectedClient(client.idCliente);
                          }}
                        >
                          {isSelected ? "Seleccionado" : "Seleccionar"}
                        </Button>
                      </div>
                    </td>
                    <td className="tableColumn">{client.nit}</td>
                    <td className="tableColumn">{client.razonSocial}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      <div className="formLabelPurple"></div>
      <div className="formLabel">AGREGAR PRODUCTOS</div>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Select
            className="selectorFull"
            onChange={(e) => {
              addProductToList(e.target.value);
            }}
          >
            <option>Seleccione producto</option>

            {available.map((producto) => {
              return (
                <option
                  value={JSON.stringify(producto)}
                  key={producto.idProducto}
                >
                  {producto.nombreProducto}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </Form>

      <div>
        <Form>
          <Form.Group>
            <div className="formLabel">DESCUENTO (%)</div>
            <div className="percent">
              <Form.Control
                min="0"
                max="100"
                value={datos}
                disabled={isDesc}
                type="number"
                placeholder="Ingrese porcentaje"
                onChange={(e) => setDatos(e.target.value)}
              ></Form.Control>
            </div>
          </Form.Group>
          {selectedProducts.length > 0 ? (
            <div className="tableOne">
              <Table>
                <thead>
                  <tr className="tableHeader">
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumnSmall">Codigo Producto</th>
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Precio Unidad</th>
                    <th className="tableColumnSmall">Cantidad</th>
                    <th className="tableColumnSmall">Total</th>
                    <th className="tableColumnSmall">Cantidad Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {[...selectedProducts].map((sp, index) => {
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumnSmall">
                          <div>
                            <Button
                              variant="warning"
                              className="tableButtonAlt"
                            >
                              Quitar
                            </Button>
                          </div>
                        </td>
                        <td className="tableColumnSmall">{sp.codInterno}</td>
                        <td className="tableColumn">{sp.nombreProducto}</td>
                        <td className="tableColumnSmall">
                          {`${sp.precioDeFabrica} Bs.`}
                        </td>
                        <td className="tableColumnSmall">
                          <Form.Control
                            type="number"
                            min="0"
                            placeholder="0"
                            value={sp.cantProducto}
                            onChange={(e) => {
                              changeQuantities(index, e.target.value, sp);
                            }}
                          />
                        </td>
                        <td className="tableColumnSmall">{sp.total}</td>
                        <td className="tableColumnSmall">{sp.cant_Actual}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="tableHeader">
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumn"></th>
                    <th className="tableColumnSmall">{"Total: "}</th>
                    <th className="tableColumnSmall">
                      {`${selectedProducts.reduce((accumulator, object) => {
                        return accumulator + object.total;
                      }, 0)} Bs.`}
                    </th>
                    <th className="tableColumnSmall">{"Total descontado: "}</th>
                    <th className="tableColumnSmall">{`${
                      (selectedProducts.reduce((accumulator, object) => {
                        return accumulator + object.total;
                      }, 0) *
                        (100 - descuento)) /
                      100
                    } Bs.`}</th>
                  </tr>
                </tfoot>
              </Table>
            </div>
          ) : null}
          <Form.Group>
            <div className="formLabel">CONFIRMAR PRODUCTOS</div>
            <div className="percent">
              <Button
                variant="warning"
                className="yellowLarge"
                onClick={() => setIsInvoice(true)}
              >
                Facturar
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
