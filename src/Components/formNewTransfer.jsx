import React, { useState, useEffect } from "react";
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
export default function FormNewTransfer() {
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
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserId(JSON.parse(Cookies.get("userAuth")).idUsuario);
    }
    const stores = getStores();
    stores.then((store) => {
      console.log("Almacenes", store.data[0]);
      setAlmacen(store.data[0]);
    });
  }, []);
  const handleClose = () => {
    setIsAlert(false);
  };

  function prepareStoreId(id, action) {
    const idSub = id.split(" ");
    if (action === "origen") {
      console.log("Origen", idSub[0]);
      setSelectedProducts([]);
      setIdOrigen(idSub[0]);
      if (idSub[1]) {
        const prods = getProductsWithStock(idSub[0], "all");
        prods.then((product) => {
          console.log("Productos encontrados", product.data[0]);
          setProductos(product.data[0]);
        });
      } else {
        const prods = getProductsWithStock(id, "all");
        prods.then((product) => {
          console.log("Productos encontrados", product.data);
          setProductos(product.data[0]);
        });
        setIdOrigen(id + "");
      }
    } else {
      if (idSub[1]) {
        setIdDestino(idSub[0]);
      } else {
        setIdDestino(id + "");
      }
    }
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
        console.log("Validado correctamente", validated);
        const transferObj = {
          idOrigen: idOrigen,
          idDestino: idDestino,
          idUsuario: userId,
          productos: selectedProducts,
        };
        const reservedProducts = updateStock({
          accion: "take",
          idAlmacen: idOrigen,
          productos: selectedProducts,
        });
        reservedProducts
          .then((res) => {
            setAlertSec("Creando traspaso");
            console.log(res);
            const newTransfer = createTransfer(transferObj);
            newTransfer
              .then((nt) => {
                setIsAlertSec(false);
                setAlert("Traspaso creado correctamente");
                setIsAlert(true);
                setTimeout(() => {
                  navigate("/principal");
                }, 1500);
              })
              .catch((error) => {
                setIsAlertSec(false);
                setAlert("Error al crear el traspaso", error);
                setIsAlert(true);
              });
          })
          .catch((error) => {
            setIsAlertSec(false);
            setAlert(error.response.data.message);
            setIsAlert(true);
            console.log("Error al actualizar", error.response.data.message);
          });
      })
      .catch((error) => {
        setIsAlertSec(false);
        setAlert(
          "La cantidad de un producto seleccionado se encuentra en cero"
        );
        setIsAlert(true);
        console.log("Algun producto seleccionado se encuentra en cero", error);
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
      <div className="formLabel">CREAR TRASPASO</div>
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
          <Form.Select
            className="selectorFull"
            onChange={(e) => {
              prepareStoreId(e.target.value, "origen");
            }}
          >
            <option>Seleccione origen</option>
            {almacen.map((ag) => {
              return (
                <option value={ag.Nombre} key={ag.Nombre}>
                  {ag.Nombre.includes("-")
                    ? `Agencia movil ${ag.Nombre}`
                    : ag.Nombre}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 halfSelect" controlId="destiny">
          <div className="formLabel">Destino</div>
          <Form.Select
            className="selectorFull"
            onChange={(e) => {
              prepareStoreId(e.target.value, "destino");
            }}
          >
            <option>Seleccione destino</option>
            {almacen.map((ag) => {
              return (
                <option value={ag.Nombre} key={ag.Nombre}>
                  {ag.Nombre}
                </option>
              );
            })}
          </Form.Select>
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
                          {product.cant_Actual}
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
