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
export default function FormNewOrder() {
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
  const [selectedProds, setSelectedProds] = useState([]);
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
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      console.log("Usuario actual", UsuarioAct.correo);
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      const disponibles = availableProducts(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      disponibles.then((fetchedAvailable) => {
        setAvailable(fetchedAvailable.data.data[0]);
      });
      const interval = setInterval(() => {
        const disponibles = availableProducts(
          JSON.parse(Cookies.get("userAuth")).idUsuario
        );
        disponibles.then((fetchedAvailable) => {
          console.log("Stock automaticamente actualizado");
          setAvailable(fetchedAvailable.data.data[0]);
        });
      }, 60000);
      const userStock = getUserStock(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      userStock.then((fetchedStock) => {
        setStock(fetchedStock.data);
      });
    }

    const allProducts = getProducts("");
    allProducts.then((fetchedProducts) => {
      setprodList(fetchedProducts.data.data[0]);
    });
    var idUsuarioAct;
    if (UsuarioAct) {
      idUsuarioAct = UsuarioAct.idUsuario;
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

  function selectProduct(product) {
    var aux = false;
    selectedProds.map((sp) => {
      if (sp.codInterno === JSON.parse(product).codInterno) {
        console.log("Producto repetido");
        aux = true;
      }
    });
    if (!aux) {
      setSelectedProds([...selectedProds, JSON.parse(product)]);
      const prodParsed = JSON.parse(product);
      console.log("Codigo interno", prodParsed.codInterno);
      var prod = {
        id: prodParsed.codInterno,
        producto: prodParsed,
        stock: prodParsed.cant_Actual,
      };
      setTotales((totales) => [...totales, prod]);
    }
    setIsProduct(true);
  }
  const handleClose = () => {
    setIsAlert(false);
    setisLoading(false);
  };
  function deleteProduct(index, cod) {
    const auxProds = [...productObj];
    auxProds.splice(index, 1);
    setProductObj(auxProds);
    const auxPre = [...precios];
    auxPre.splice(index, 1);
    setPrecios(auxPre);
    const auxArray = [...selectedProds];
    auxArray.splice(index, 1);
    setSelectedProds(auxArray);
    const auxTot = [...totales];
    auxTot.splice(index, 1);
    setTotales(auxTot);
    console.log("Length:", selectedProds.length);
  }
  function changeQuantitys(idBase, id, quantity, price, available) {
    const totAux = totalPrecio;
    const descAux = totalDesc;
    const aux = [...precios];
    const auxP = [...productObj];
    const indexOfObject = aux.findIndex((object) => {
      return object.idProducto === id;
    });
    if (indexOfObject !== -1) {
      aux.splice(indexOfObject, 1);
      auxP.splice(indexOfObject, 1);
    }
    var obj = {
      idBase: idBase,
      idProducto: id,
      cantidad: quantity,
      precio: price,
      total: quantity * price,
      descuento: descuento,
      disponible: available,
      descontado: quantity * price * (descuento / 100),
    };
    var objProd = {
      idProducto: idBase,
      cantProducto: quantity,
      totalProd: quantity * price,
    };
    setProductObj([...auxP, objProd]);
    setPrecios([...aux, obj]);
    setTotalPrecio(totAux + quantity * price);
    setTotalDesc(descAux + quantity * price);
  }
  function handleType(value) {
    setTipo(value);
    if (value === "muestra") {
      setDescuento(0);
      setIsDesc(true);
    } else {
      setIsDesc(false);
    }
  }
  function structureOrder(availables) {
    console.log("Se corrio la funcion de validar campos");
    return new Promise((resolve) => {
      console.log("Cantidades", precios);
      var error = false;
      if (selectedClient === "") {
        error = true;
        setAlert("Seleccione un cliente por favor");
      }
      if (selectedProds.length === 0) {
        error = true;
        setAlert("Por favor seleccione al menos un producto");
      }
      precios.map((pr) => {
        const dispo = availables.find(
          (av) => pr.idProducto === av.codInterno
        ).cant_Actual;
        console.log(
          `Cantidad escogida: ${pr.cantidad}, disponibilidad ${dispo}`
        );
        if (pr.cantidad > dispo) {
          error = true;
          setAlert(
            "Uno de los valores ingresados excede la capacidad disponible actualizada"
          );
        }
        if (pr.cantidad < 1 || pr.cantidad === "") {
          error = true;
          setAlert("La cantidad elegida de algun producto esta en 0");
        }
      });
      if (precios.length === 0 || selectedProds.length > precios.length) {
        error = true;
        setAlert("La cantidad elegida de algun producto esta en 0");
      }
      resolve(error);
    });
  }

  async function validateAvailability() {
    console.log("Se corrio la funcion de validacion y espera");
    setIsAlertSec(true);
    setAlertSec("Validando Pedido");
    setTimeout(() => {
      const validateAva = availabilityInterval();
      validateAva.then((res) => {
        console.log("Esperaste:", res);
        const disponibles = availableProducts(
          JSON.parse(Cookies.get("userAuth")).idUsuario
        );
        disponibles.then((fetchedAvailable) => {
          console.log("Disponibilidad verificada");
          const avaSetted = async () => {
            const setted = asyncSetAva(fetchedAvailable.data.data[0]);
            setted.then((res) => {
              setIsAlertSec(false);
              console.log("Llamando a la funcion guardar", res);
              saveOrder(fetchedAvailable.data.data[0]);
            });
          };
          avaSetted();
        });
      });
    }, 200);
  }

  const asyncSetAva = (array) => {
    return new Promise((resolve) => {
      setAvailable(array);
      resolve(true);
    });
  };

  function saveOrder(availables) {
    const validatedOrder = structureOrder(availables);
    validatedOrder.then((res) => {
      setisLoading(true);
      const tot = precios.reduce((accumulator, object) => {
        return accumulator + object.total;
      }, 0);
      console.log("Respuesta del validador", res);
      if (!res) {
        setAlertSec("Creando pedido ...");
        setIsAlertSec(true);
        const ped = {
          productos: precios,
          total: tot,
        };

        const objPedido = {
          pedido: {
            idUsuarioCrea: usuarioAct,
            idCliente: selectedClient,
            fechaCrea: dateString(),
            fechaActualizacion: dateString(),
            estado: 0,
            montoFacturar: tot,
            montoTotal: tot - (tot * descuento) / 100,
            tipo: tipo,
            descuento: descuento,
            notas: observaciones,
          },
          productos: productObj,
        };
        setPedidoFinal(ped);
        const stockObject = {
          accion: "take",
          idAlmacen: userStore,
          productos: productObj,
        };
        const updatedStock = updateStock(stockObject);
        updatedStock
          .then((updatedRes) => {
            console.log("Stock updateado", updatedRes);
            const newOrder = createOrder(objPedido);
            newOrder
              .then((res) => {
                console.log("Resposta del pedido", res.data.data.idCreado);
                const codPedido = getOrderList(res.data.data.idCreado);
                codPedido.then((res) => {
                  console.log(
                    "Codigo del pedido creado:",
                    res.data.data[0][0].codigoPedido
                  );
                  const emailBody = {
                    codigoPedido: res.data.data[0][0].codigoPedido,
                    correoUsuario: userEmail,
                    fecha: dateString(),
                  };
                  const emailSent = sendOrderEmail(emailBody);
                  emailSent
                    .then((response) => {
                      setIsAlertSec(false);
                      console.log("Respuesta de la creacion", response);
                      setAlert("Pedido Creado correctamente");
                      setIsAlert(true);
                      setTimeout(() => {
                        navigate("/principal");
                        setisLoading(false);
                      }, 3000);
                    })
                    .catch((error) => {
                      console.log("Error al enviar el correo", error);
                    });
                });
              })
              .catch((error) => {
                console.log("Error", error);
              });
          })
          .catch((error) => {
            console.log("errooooooor");
            setIsAlertSec(false);
            setAlert(error.response.data.message);
            setIsAlert(true);
            console.log("Error de updateo", error.response.data.message);
          });
      } else {
        setIsAlert(true);
      }
    });
  }

  function handleDiscount(value) {
    setDescuento(value);
  }
  return (
    <div>
      <div className="formLabel">REGISTRAR PEDIDOS</div>
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ALERTA</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Confirmo, cerrar alerta
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
                <th className="tableColumnSmall">Nit</th>
                <th className="tableColumn">Razon Social</th>
                <th className="tableColumn">Zona</th>
                <th className="tableColumn">Frecuencia</th>
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
                    <td className="tableColumnSmall">{client.nit}</td>
                    <td className="tableColumn">{client.razonSocial}</td>
                    <td className="tableColumn">{client.zona}</td>
                    <td className="tableColumn">{client.dias}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      <div className="formLabelPurple"></div>
      <div className="formLabel">SELECCIONE PRODUCTO</div>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Select
            className="selectorFull"
            onChange={(e) => selectProduct(e.target.value)}
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

      <div className="formLabel">SELECCIONE TIPO PEDIDO</div>
      <div>
        <Form>
          <Form.Group className="mb-3" controlId="order">
            <Form.Select
              className="selectorHalf"
              onChange={(e) => handleType(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="muestra">Muestra</option>
              <option value="reserva">Reserva</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <div className="comments">
              <Form.Control
                type="text"
                onChange={(e) => {
                  setObservaciones(e.target.value);
                }}
                value={observaciones}
                placeholder="Observaciones"
              ></Form.Control>
            </div>
          </Form.Group>
          <Form.Group>
            <div className="formLabel">DESCUENTO (%)</div>
            <div className="percent">
              <Form.Control
                min="0"
                max="100"
                value={descuento}
                disabled={isDesc}
                onChange={(e) => handleDiscount(e.target.value)}
                type="number"
                placeholder="Ingrese porcentaje"
              ></Form.Control>
            </div>
          </Form.Group>
          {isProduct && selectedProds.length > 0 ? (
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
                  {[...selectedProds].map((sp, index) => {
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumnSmall">
                          <div>
                            <Button
                              onClick={() =>
                                deleteProduct(index, sp.codInterno)
                              }
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
                          {sp.precioDeFabrica + " Bs."}
                        </td>
                        <td className="tableColumnSmall">
                          <Form.Control
                            type="number"
                            min="0"
                            placeholder="0"
                            value={
                              precios.find(
                                (pr) => pr.idProducto === sp.codInterno
                              )
                                ? precios.find(
                                    (pr) => pr.idProducto === sp.codInterno
                                  ).cantidad
                                : ""
                            }
                            onChange={(e) =>
                              changeQuantitys(
                                sp.idProducto,
                                sp.codInterno,
                                e.target.value,
                                sp.precioDeFabrica,
                                available.find(
                                  (pr) => pr.idProducto === sp.idProducto
                                ).cant_Actual
                              )
                            }
                          />
                        </td>
                        <td className="tableColumnSmall">
                          {precios.find((pr) => pr.idProducto === sp.codInterno)
                            ? precios.find(
                                (pr) => pr.idProducto === sp.codInterno
                              ).total
                            : 0}
                        </td>
                        <td className="tableColumnSmall">
                          {
                            available.find(
                              (pr) => pr.idProducto === sp.idProducto
                            ).cant_Actual
                          }
                        </td>
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
                      {" "}
                      {precios
                        ? precios.reduce((accumulator, object) => {
                            return accumulator + object.total;
                          }, 0)
                        : 0}
                    </th>
                    <th className="tableColumnSmall">{"Total descontado: "}</th>
                    <th className="tableColumnSmall">
                      {precios
                        ? precios.reduce((accumulator, object) => {
                            return accumulator + object.total;
                          }, 0) -
                          precios.reduce((accumulator, object) => {
                            return accumulator + object.descontado;
                          }, 0)
                        : 0}{" "}
                    </th>
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
                onClick={() => validateAvailability()}
              >
                {isLoading ? (
                  <Image src={loading2} style={{ width: "5%" }} />
                ) : (
                  "Cargar Pedido"
                )}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
