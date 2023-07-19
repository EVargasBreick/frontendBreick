import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Image, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
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
import { OrderNote } from "./orderNote";
import ReactToPrint from "react-to-print";
import { dateString } from "../services/dateServices";
export default function FormStoreRefill() {
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
  const [isInterior, setIsInterior] = useState(false);
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
      const parsed = JSON.parse(UsuarioAct);
      setUserId(JSON.parse(Cookies.get("userAuth")).idUsuario);
      setUser(JSON.parse(UsuarioAct).usuario);
      const stores = getStores();
      stores.then((store) => {
        setAlmacen(store.data);
        setNombreOrigen(
          store.data.find(
            (al) => al.idAgencia == JSON.parse(UsuarioAct).idAlmacen
          ).Nombre
        );
      });
      if (parsed.idDepto == 1) {
        setIdOrigen("AL001");
        setIdDestino(JSON.parse(Cookies.get("userAuth")).idAlmacen);
        const prods = getProductsWithStock("AL001", "all");
        prods.then((product) => {
          const available = product.data.filter((prod) => prod.cant_Actual > 0);
          console.log("disponibles", available);
          setProductos(available);
          setAuxProducts(available);
        });
      } else {
        setIsInterior(true);
        setIdOrigen(parsed.idAlmacen);
        setIdDestino(JSON.parse(Cookies.get("userAuth")).idAlmacen);
        const prods = getProductsWithStock(parsed.idAlmacen, "all");
        prods.then((product) => {
          setProductos(product.data);
          setAuxProducts(product.data);
        });
      }
    }
  }, []);
  const handleClose = () => {
    setIsAlert(false);
  };
  useEffect(() => {
    if (JSON.stringify(productList).length > 5) {
      console.log("Flag 2");
      setIsPrint(true);
    }
  }, [productList]);
  useEffect(() => {
    if (isPrint) {
      buttonRef.current.click();
    }
  }, [isPrint]);

  function prepareStoreId(id, action) {
    const idSub = id.split(" ");
    if (action === "origen") {
      setSelectedProducts([]);
      setIdOrigen(idSub[0]);
      if (idSub[1]) {
        const prods = getProductsWithStock(idSub[0], "all");
        prods.then((product) => {
          setProductos(product.data);
        });
      } else {
        const prods = getProductsWithStock(id, "all");
        prods.then((product) => {
          setProductos(product.data);
        });
        setIdOrigen(id + "");
      }
    } else {
      if (idSub[1]) {
        setIdDestino(idSub[0]);
        setNombreDestino(
          almacen.find((al) => al.idAgencia == idSub[0])?.Nombre
        );
      } else {
        setIdDestino(id + "");
        setNombreDestino(almacen.find((al) => al.idAgencia == id)?.Nombre);
      }
    }
  }
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
    if (idOrigen !== idDestino) {
      setAlertSec("Validando Traspaso");
      console.log("Is interior", isInterior);
      setIsAlertSec(true);
      const zeroValidated = validateZero();
      zeroValidated
        .then((validated) => {
          const validatedQuant = validateQuantities();
          validatedQuant
            .then((res) => {
              const transferObj = {
                idOrigen: idOrigen,
                idDestino: idDestino,
                idUsuario: userId,
                productos: selectedProducts,
                movil: 1,
                impreso: isInterior ? 1 : 0,
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
                      const productsArray = selectedProducts.map((item) => {
                        const obj = {
                          codInterno: item.codInterno,
                          nombreProducto: item.nombreProducto,
                          cantidadProducto: item.cantProducto,
                        };
                        return obj;
                      });
                      setIsAlertSec(false);
                      setAlert("Traspaso creado correctamente");
                      console.log("Traspaso creado correctamente");
                      const origenArray = nombreOrigen.split(" ");
                      const outputOrigen = origenArray.slice(1).join(" ");
                      const destinoArray = nombreDestino.split(" ");
                      const outputDestino = destinoArray.slice(1).join(" ");
                      const orderObj = [
                        {
                          rePrint: false,
                          fechaSolicitud: dateString(),
                          id: nt.data.data.idCreado,
                          usuario: user,
                          notas: "",
                          productos: productsArray,
                          origen: outputOrigen,
                          destino: outputDestino,
                        },
                      ];
                      setProductList(orderObj);
                    })
                    .catch((error) => {
                      setIsAlertSec(false);
                      setAlert(error.response.data.message);
                      console.log("Error", error);
                      setIsAlert(true);
                    });
                })
                .catch((error) => {
                  setIsAlertSec(false);
                  setAlert("Error al crear el traspaso", error);
                  setIsAlert(true);
                  console.log();
                });
            })
            .catch((err) => {
              setIsAlertSec(false);
              setAlert(
                "La cantidad de un producto seleccionado no se encuentra disponible"
              );
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
    } else {
      setAlert("El origen debe ser distinto al destino");
      setIsAlert(true);
    }
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

  function validateQuantities() {
    console.log("Ingresando a validar cantidades");
    var errCount = 0;
    return new Promise((resolve, reject) => {
      for (const product of selectedProducts) {
        if (product.cant_Actual < product.cantProducto) {
          errCount += 1;
        }
      }
      console.log("Err count", errCount);
      if (errCount == 0) {
        resolve(true);
      } else {
        reject(false);
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
    if (newList.length == 1) {
    }
    setProductos([...newList]);
  }

  function addWithEnter(e) {
    e.preventDefault();
    const found = auxProducts.find(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(filtered.toLowerCase()) ||
        dt.codInterno.toString().includes(filtered.toString()) ||
        dt.codigoBarras.toString().includes(filtered.toString())
    );
    console.log("Found", found);
    addProductToList(JSON.stringify(found));
    setFiltered("");
    setProductos(auxProducts);
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
          <div>{nombreOrigen}</div>
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
        <Form className="mb-3" onSubmit={(e) => addWithEnter(e)}>
          <Form.Group className="halfSelectAlt" controlId="order">
            <Form.Select
              className="selectorFullAlt"
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
            <Form.Control
              className="halfSearch"
              type="text"
              placeholder="Buscar"
              value={filtered}
              onChange={(e) => filterProducts(e.target.value)}
            ></Form.Control>
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
      {isPrint ? (
        <div>
          <div hidden>
            <OrderNote productList={productList} ref={componentRef} />
          </div>
          <ReactToPrint
            trigger={() => (
              <Button
                variant="warning"
                className="yellowLarge"
                ref={buttonRef}
                hidden
              >
                Imprimir ordenes
              </Button>
            )}
            content={() => componentRef.current}
            onAfterPrint={() => window.location.reload()}
          />
        </div>
      ) : null}
    </div>
  );
}
