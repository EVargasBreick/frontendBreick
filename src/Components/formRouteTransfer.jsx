import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Image, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Switch from "../assets/switch.png";
import loading2 from "../assets/loading2.gif";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/buttonsStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import { getStores } from "../services/storeServices";
import { getProductsWithStock } from "../services/productServices";
import { createTransfer } from "../services/transferServices";
import { updateStock } from "../services/orderServices";
export default function FormRouteTransfer() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [almacen, setAlmacen] = useState([{ Nombre: "cargando..." }]);
  const [idOrigen, setIdOrigen] = useState("");
  const [idDestino, setIdDestino] = useState("");
  const [productos, setProductos] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [isPrint, setIsPrint] = useState(false);
  const [productList, setProductList] = useState([]);
  const [filtered, setFiltered] = useState("");
  const [auxProducts, setAuxProducts] = useState([]);
  const [nombreOrigen, setNombreOrigen] = useState("");
  const [nombreDestino, setNombreDestino] = useState();
  const componentRef = useRef();
  const buttonRef = useRef();
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserId(JSON.parse(Cookies.get("userAuth")).idUsuario);
      setUser(JSON.parse(UsuarioAct).usuario);
    }
    const stores = getStores();
    stores.then((store) => {
      setAlmacen(store.data);
      setNombreOrigen(
        store.data.find(
          (al) => al.idAgencia == JSON.parse(UsuarioAct).idAlmacen
        ).Nombre
      );
    });
    setIdOrigen("AL001");
    setIdDestino(JSON.parse(Cookies.get("userAuth")).idAlmacen);
    const prods = getProductsWithStock("AL001", "all");
    prods.then((product) => {
      setProductos(product.data);
      setAuxProducts(product.data);
    });
  }, []);
  const handleClose = () => {
    setIsAlert(false);
  };

  function addProductToList(product) {
    const produc = JSON.parse(product);
    var aux = false;

    selectedProducts.map((sp) => {
      if (sp.codInterno === produc.codInterno) {
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
        codigoUnidad: produc.codigoUnidad,
      };
      setSelectedProducts([...selectedProducts, productObj]);
    }
  }
  function changeQuantities(index, cantidad, prod) {
    let auxObj = {
      codInterno: prod.codInterno,
      cantProducto: cantidad,
      nombreProducto: prod.nombreProducto,
      idProducto: prod.idProducto,
      cant_Actual: prod.cant_Actual,
      cantidadRestante: prod.cant_Actual - cantidad,
      codigoUnidad: prod.codigoUnidad,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
  }
  function deleteProduct(index) {
    const auxArray = [...selectedProducts];
    auxArray.splice(index, 1);
    setSelectedProducts(auxArray);
  }
  function registerTransfer() {
    setAlertSec("Validando Traspaso");
    setIsAlertSec(true);
    const zeroValidated = validateZero();
    zeroValidated
      .then((validated) => {
        const transferObj = {
          idOrigen: idOrigen,
          idDestino: idDestino,
          idUsuario: userId,
          productos: selectedProducts,
          movil: 1,
          transito: 0,
        };
        setAlertSec("Creando traspaso");
        const newTransfer = createTransfer(transferObj);
        newTransfer
          .then((nt) => {
            const reservedProducts = updateStock({
              accion: "take",
              idAlmacen: idOrigen,
              productos: selectedProducts,
              detalle: `SSNTR-${nt.data.data.idCreado}`,
            });
            reservedProducts
              .then((res) => {
                setIsAlertSec(false);
                setAlert("Traspaso creado correctamente");
                setIsAlert(true);
                setTimeout(() => {
                  navigate("/principal");
                }, 1500);
              })
              .catch((error) => {
                setIsAlertSec(false);
                setAlert("Error al actualizar");
                setIsAlert(true);
              });
          })
          .catch((error) => {
            setIsAlertSec(false);
            setAlert("Error al crear el traspaso");
            setIsAlert(true);
          });
      })
      .catch((error) => {
        setIsAlertSec(false);
        setAlert(
          "La cantidad de un producto seleccionado se encuentra en cero"
        );
        setIsAlert(true);
      });
  }
  function validateZero() {
    var valQuan = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        selectedProducts.map((sp) => {
          if (sp.cantProducto === "0" || sp.cantProducto === "") {
            valQuan = false;
          }
        });
        if (valQuan) {
          resolve(true);
        } else {
          reject(false);
        }
      }, 1000);
    });
  }
  return (
    <div>
      <div className="formLabel">SOLICITAR TRASPASO A AGENCIA MOVIL</div>
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
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Form className="halfSelectors">
        <Form.Group className="mb-3 halfSelect" controlId="origin">
          <div className="formLabel">Origen</div>
          <div>Almacen Central</div>
        </Form.Group>

        <Form.Group className="mb-3 halfSelect" controlId="destiny">
          <div className="formLabel">Destino</div>
          <div>{idDestino}</div>
        </Form.Group>
      </Form>
      <div className="secondHalf">
        <div className="formLabel">Agregar Productos</div>
        <Form>
          <Form.Group className="mb-3" controlId="order">
            <Form.Select
              className="selectorFull"
              onChange={(e) => {
                addProductToList(e.target.value);
              }}
            >
              <option key="-2">Seleccione producto</option>
              {idOrigen === "" ? (
                <option key="-1">
                  Seleccione una agencia/almacen de origen
                </option>
              ) : null}
              {productos.map((producto) => {
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
      </div>

      <div className="secondHalf">
        <div className="tableOne">
          {selectedProducts.length > 0 ? (
            <div>
              <div className="formLabel">Detalle productos</div>
              <Table bordered striped hover className="table">
                <thead>
                  <tr className="tableHeader">
                    <td className="tableColumnSmall"></td>
                    <th className="tableColumnSmall">Codigo Producto</th>
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Cantidad</th>
                    <th className="tableColumnSmall">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product, index) => {
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumnSmall">
                          <Button
                            className="yellow"
                            variant="warning"
                            onClick={() => {
                              deleteProduct(index);
                            }}
                          >
                            Quitar
                          </Button>
                        </td>
                        <td className="tableColumnSmall">
                          {product.codInterno}
                        </td>
                        <td className="tableColumn">
                          {product.nombreProducto}
                        </td>
                        <td className="tableColumnSmall">
                          <Form>
                            <Form.Group>
                              <Form.Control
                                type="number"
                                placeholder=""
                                className="tableTotal"
                                onChange={(e) =>
                                  changeQuantities(
                                    index,
                                    e.target.value,
                                    product
                                  )
                                }
                                value={product.cantProducto}
                              />
                            </Form.Group>
                          </Form>
                        </td>
                        <td className="tableColumnSmall">
                          {product.codigoUnidad == "57"
                            ? parseFloat(product.cant_Actual).toFixed(0)
                            : parseFloat(product.cant_Actual).toFixed(3)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : null}
        </div>
        <div className="secondHalf">
          <div className="buttons">
            <Button
              variant="light"
              className="cyanLarge"
              onClick={() => {
                registerTransfer();
              }}
            >
              Crear Traspaso
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
