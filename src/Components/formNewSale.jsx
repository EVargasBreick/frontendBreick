import React, { useState } from "react";
import { Form, Button, Table, Modal, Image } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import { getClient } from "../services/clientServices";
import { useEffect } from "react";
import { getProductsWithStock } from "../services/productServices";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import FormRegisterClient from "./formRegisterClient";
import { convertToText } from "../services/numberServices";
import QrComponent from "./qrComponent";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./invoicePDF";
import SaleModal from "./saleModal";
export default function FormNewSale() {
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isLoading, setisLoading] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
  const [filtered, setFiltered] = useState("");
  const [willCreate, setWillCreate] = useState(false);
  const [available, setAvailable] = useState([
    { nombreProducto: "Cargando..." },
  ]);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userStore, setUserStore] = useState("");
  const [isCreate, setIsCreate] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [datos, setDatos] = useState("");
  const [auxProducts, setAuxProducts] = useState([]);

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
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      const disponibles = getProductsWithStock(
        JSON.parse(Cookies.get("userAuth")).idAlmacen,
        "all"
      );
      disponibles.then((fetchedAvailable) => {
        setAvailable(fetchedAvailable.data[0]);
        setAuxProducts(fetchedAvailable.data[0]);
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
        setWillCreate(true);
        setIsAlert(true);
        setAlert("Usuario no encontrado");
      }
    });
  }

  function filterProducts(value) {
    setFiltered(value);
    const newList = auxProducts.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    setAvailable([...newList]);
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

  function addProductToList(action, product) {
    if (action == "manual") {
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
          cantProducto: 1,
          nombreProducto: produc.nombreProducto,
          idProducto: produc.idProducto,
          cant_Actual: produc.cant_Actual,
          cantidadRestante: produc.cant_Actual,
          precioDeFabrica: produc.precioDeFabrica,
          total: produc.precioDeFabrica,
        };
        setSelectedProducts([...selectedProducts, productObj]);
      }
    } else {
      const selected = available.find((pr) => pr.codigoBarras === filtered);
      if (selected) {
        var aux = false;
        selectedProducts.map((sp) => {
          if (sp.codInterno === selected.codInterno) {
            const indexSelected = selectedProducts.indexOf(sp);
            changeQuantities(indexSelected, sp.cantProducto + 1, sp);
            aux = true;
          }
        });
        if (!aux) {
          const productObj = {
            codInterno: selected.codInterno,
            cantProducto: 1,
            nombreProducto: selected.nombreProducto,
            idProducto: selected.idProducto,
            cant_Actual: selected.cant_Actual,
            cantidadRestante: selected.cant_Actual,
            precioDeFabrica: selected.precioDeFabrica,
            total: selected.precioDeFabrica,
          };
          setSelectedProducts([...selectedProducts, productObj]);
        }

        console.log("Selected:", selected);
      }
      setFiltered("");
    }
  }

  const handleClose = () => {
    setIsAlert(false);
    setWillCreate(false);
    setisLoading(false);
    setIsCreate(false);
  };
  function deleteProduct(index) {
    const auxArray = [...selectedProducts];
    auxArray.splice(index, 1);
    setSelectedProducts(auxArray);
  }
  function addWithScanner(e) {
    e.preventDefault();
    console.log("Leido por scanner", e.target.value);
    addProductToList("scanner");
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
    setTotalDesc(
      (selectedProducts.reduce((accumulator, object) => {
        return accumulator + object.total;
      }, 0) *
        (100 - descuento)) /
        100
    );
  }
  function handleModal() {
    console.log("Cliente", clientes);
    setIsInvoice(false);
    setTimeout(() => {
      setIsInvoice(true);
    }, 100);
  }
  return (
    <div>
      <div className="formLabel">VENTAS AGENCIA</div>
      {isInvoice ? (
        <div>
          <SaleModal
            datos={{
              total: selectedProducts.reduce((accumulator, object) => {
                return accumulator + object.total;
              }, 0),
              descuento,
              totalDescontado:
                (selectedProducts.reduce((accumulator, object) => {
                  return accumulator + object.total;
                }, 0) *
                  (100 - descuento)) /
                100,
              nit: clientes[0].nit,
              razonSocial: clientes[0].razonSocial,
            }}
            show={true}
          />
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
          {willCreate ? (
            <Button variant="success" onClick={() => setIsCreate(true)}>
              Crear Cliente
            </Button>
          ) : null}
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
          placeholder="Ingrese Nit"
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
            "Buscar"
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
                <th className="tableColumn">Zona</th>
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
                    <td className="tableColumn">{client.zona}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      <div className="formLabelPurple"></div>
      <div className="formLabel">AGREGAR PRODUCTOS</div>
      <div className="rowFormInputs">
        <Form className="mb-3 halfSelect">
          <Form.Group controlId="order">
            <Form.Select
              className="selectorColor"
              onChange={(e) => {
                addProductToList("manual", e.target.value);
              }}
            >
              {available.map((producto, index) => {
                return (
                  <option value={JSON.stringify(producto)} key={index}>
                    {producto.nombreProducto}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Form>
        <Form onSubmit={(e) => addWithScanner(e)} className="mb-3 searchHalf">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar"
              value={filtered}
              onChange={(e) => filterProducts(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>
      </div>
      <div>
        <Form>
          {selectedProducts.length > 0 ? (
            <div className="tableOne">
              <Table>
                <thead>
                  <tr className="tableHeader">
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumnSmall">Codigo</th>
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Precio Unidad/Kg</th>
                    <th className="tableColumnSmall">{`Cantidad/Peso(Gr)`}</th>
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
                              onSubmit={(e) => e.preventDefault()}
                              variant="warning"
                              className="tableButtonAlt"
                              onClick={() => deleteProduct(index)}
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
              <Form.Group>
                <Form.Group>
                  <div className="formLabel">DESCUENTO (%)</div>
                  <div className="percent">
                    <Form.Control
                      min="0"
                      max="100"
                      value={descuento}
                      disabled={isDesc}
                      type="number"
                      placeholder="Ingrese porcentaje"
                      onChange={(e) => setDescuento(e.target.value)}
                    ></Form.Control>
                  </div>
                </Form.Group>
                <div className="formLabel">CONFIRMAR PRODUCTOS</div>
                <div className="percent">
                  <Button
                    variant="warning"
                    className="yellowLarge"
                    onClick={() => handleModal()}
                  >
                    Ir A Facturar
                  </Button>
                </div>
              </Form.Group>
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  );
}
