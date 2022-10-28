import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Image, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  addProductToOrder,
  cancelOrder,
  getOrderDetail,
  getOrderList,
  getOrderProdList,
  updateDbOrder,
  updateOrderProduct,
  updateStock,
} from "../services/orderServices";
import loading2 from "../assets/loading2.gif";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import { availableProducts } from "../services/productServices";
export default function FormModifyOrders() {
  const [pedidosList, setPedidosList] = useState([]);

  const [selectedProds, setSelectedProds] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [cliente, setCliente] = useState("");
  const [zona, setZona] = useState("");
  const [idPedido, setIdPedido] = useState("");
  const [total, setTotal] = useState("");
  const [descuento, setDescuento] = useState("");
  const [facturado, setFacturado] = useState("");
  const [isProduct, setIsProduct] = useState(false);
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [fechaCrea, setFechaCrea] = useState("");
  const [codigoPedido, setCodigoPedido] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [available, setAvailable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [auxSelectedProds, setAuxSelectedProds] = useState([]);
  const [auxOrder, setAuxOrder] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userStore, setUserStore] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const navigate = useNavigate();
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      console.log("Usuario actual", UsuarioAct.correo);
    }
    const listaPedidos = getOrderList("");
    listaPedidos.then((res) => {
      setPedidosList(res.data.data[0]);
      console.log("Lista de pedidos", res.data.data[0]);
    });

    const interval = setInterval(() => {
      const disponibles = availableProducts(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      disponibles.then((fetchedAvailable) => {
        console.log("Stock automaticamente actualizado");
        console.log("Disponibles", fetchedAvailable.data.data[0]);
        setAvailable(fetchedAvailable.data.data[0]);
      });
    }, 60000);
    const disponibles = availableProducts(
      JSON.parse(Cookies.get("userAuth")).idUsuario
    );
    disponibles.then((fetchedAvailable) => {
      console.log("Disponibles", fetchedAvailable.data.data[0]);
      console.log("Stock automaticamente actualizado");
      setAvailable(fetchedAvailable.data.data[0]);
    });
  }, []);
  function selectProduct(product) {
    console.log(
      "Estructura del producto al querer agregar",
      JSON.parse(product)
    );
    const parsed = JSON.parse(product);
    var aux = false;
    const prodObj = {
      cantPrevia: 0,
      cantidadProducto: 0,
      codInterno: parsed.codInterno,
      idPedido: idPedido,
      idPedidoProducto: null,
      idProducto: parsed.idProducto,
      nombreProducto: parsed.nombreProducto,
      precioDeFabrica: parsed.precioDeFabrica,
      totalProd: 0,
    };
    selectedProds.map((sp) => {
      if (sp.codInterno === JSON.parse(product).codInterno) {
        console.log("Producto repetido");
        aux = true;
      }
    });
    if (!aux) {
      setSelectedProds([...selectedProds, prodObj]);
    }
    setIsProduct(true);
  }
  function deleteProduct(index, cod) {
    const auxArray = [...selectedProds];
    auxArray.splice(index, 1);
    setSelectedProds(auxArray);
  }

  const handleClose = () => {
    setIsAlert(false);
    setIsLoading(false);
  };
  function setOrderDetails(stringPedido) {
    const stringParts = stringPedido.split("|");
    setIsLoading(true);
    setCodigoPedido(stringParts[1]);
    setSelectedOrder(stringParts[0]);
    const order = getOrderDetail(stringParts[0]);

    order.then((res) => {
      setSelectedProds([]);
      console.log("Detalles de la orden", res.data.data[0][0]);
      setAuxOrder(res.data.data[0][0]);
      const fechaDesc = res.data.data[0][0].fechaCrea
        .substring(0, 10)
        .split("-");
      setFechaCrea(
        fechaDesc[2] + " de " + meses[fechaDesc[1] - 1] + " de " + fechaDesc[0]
      );
      console.log("Pedido Seleccionado:", res);
      setIdPedido(res.data.data[0][0].idPedido);
      const prodHeaderObj = {
        vendedor: res.data.data[0][0].nombreVendedor,
        cliente: res.data.data[0][0].razonSocial,
        zona: res.data.data[0][0].zona,
        montoTotal: res.data.data[0][0].montoFacturar,
        descuento: res.data.data[0][0].descuento,
        facturado: res.data.data[0][0].montoTotal,
        fechaCrea:
          fechaDesc[2] +
          " de " +
          meses[fechaDesc[1] - 1] +
          " de " +
          fechaDesc[0],
      };
      setVendedor(res.data.data[0][0].nombreVendedor);
      setCliente(res.data.data[0][0].razonSocial);
      setZona(res.data.data[0][0].zona);
      setTotal(res.data.data[0][0].montoFacturar);
      setDescuento(res.data.data[0][0].descuento);
      setFacturado(res.data.data[0][0].montoTotal);
      const prodList = getOrderProdList(stringParts[0]);

      prodList.then((res) => {
        console.log("Lista de productos", res.data.data[0]);
        res.data.data[0].map((prod) => {
          const objProd = {
            cantProducto: prod.cantidadProducto,
            idProducto: prod.idProducto,
          };
          setAuxSelectedProds((auxSelectedProds) => [
            ...auxSelectedProds,
            objProd,
          ]);
        });

        res.data.data[0].map((parsed) => {
          const prodObj = {
            cantPrevia: parsed.cantidadProducto,
            cantidadProducto: parsed.cantidadProducto,
            codInterno: parsed.codInterno,
            idPedido: parsed.idPedido,
            idPedidoProducto: parsed.idPedidoProducto,
            idProducto: parsed.idProducto,
            nombreProducto: parsed.nombreProducto,
            precioDeFabrica: parsed.precioDeFabrica,
            totalProd: parsed.totalProd,
          };
          setSelectedProds((selectedProds) => [...selectedProds, prodObj]);
          setIsLoading(false);
        });
        const auxDetail = [...productDetail];
        setProductDetail([...auxDetail, prodHeaderObj]);

        setIsOrder(true);
        setIsPdf(true);
      });
    });
  }
  function changeQuantitys(index, cantidad, prod) {
    console.log("Prod cantidad cambiada", prod);
    console.log("Cantidad nueva", cantidad);
    console.log("Index", index);
    let auxObj = {
      cantPrevia: prod.cantPrevia,
      cantidadProducto: cantidad,
      codInterno: prod.codInterno,
      idPedido: prod.idPedido,
      idPedidoProducto: prod.idPedidoProducto,
      idProducto: prod.idProducto,
      nombreProducto: prod.nombreProducto,
      precioDeFabrica: prod.precioDeFabrica,
      totalProd: cantidad * prod.precioDeFabrica,
    };
    let auxSelected = [...selectedProds];
    auxSelected[index] = auxObj;
    setSelectedProds(auxSelected);
  }
  function deleteOrderAndUpdate() {
    if (idPedido === "") {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    } else {
      setAlertSec("Cancelando pedido y actualizando kardex");
      setIsAlertSec(true);
      console.log("Id del pedido a cancelar", idPedido);
      console.log("Productos a borrar", auxSelectedProds);
      const objProdsDelete = {
        accion: "add",
        idAlmacen: userStore,
        productos: auxSelectedProds,
      };
      const reStocked = updateStock(objProdsDelete);
      reStocked.then((rs) => {
        console.log(rs);
        const canceled = cancelOrder(idPedido);
        canceled.then((cld) => {
          setAlertSec("Pedido cancelado y kardex actualizado, redirigiendo...");
          setIsAlertSec(true);
          setTimeout(() => {
            navigate("/principal");
          }, 1500);
        });
      });
    }
  }
  function updateOrder() {
    if (idPedido === "") {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    } else {
      var arrayAdds = [];
      var arrayTakes = [];
      var objProductsAdded = [];
      var objProductsUpdated = [];
      var total = selectedProds.reduce((accumulator, object) => {
        return accumulator + object.totalProd;
      }, 0);
      const totalDesc = total - (total * descuento) / 100;
      const objUpdateOrder = {
        idPedido: idPedido,
        montoFacturar: total,
        montoTotal: totalDesc,
      };
      var countProdsChanged = 0;
      selectedProds.map((sp) => {
        if (sp.cantidadProducto === sp.cantPrevia) {
          countProdsChanged++;
        }
        if (sp.cantidadProducto > sp.cantPrevia) {
          const objProd = {
            idProducto: sp.idProducto,
            cantProducto: sp.cantidadProducto - sp.cantPrevia,
            totalProd: sp.cantidadProducto * sp.precioDeFabrica,
          };
          arrayTakes.push(objProd);
        } else {
          const objProd = {
            idProducto: sp.idProducto,
            cantProducto: sp.cantPrevia - sp.cantidadProducto,
            totalProd: sp.cantidadProducto * sp.precioDeFabrica,
          };
          arrayAdds.push(objProd);
        }
        if (sp.idPedidoProducto === null) {
          const objProd = {
            idProducto: sp.idProducto,
            cantProducto: sp.cantidadProducto,
            totalProd: sp.cantidadProducto * sp.precioDeFabrica,
          };
          objProductsAdded.push(objProd);
        } else {
          const objProd = {
            idPedidoProducto: sp.idPedidoProducto,
            idProducto: sp.idProducto,
            cantProducto: sp.cantidadProducto,
            totalProd: sp.cantidadProducto * sp.precioDeFabrica,
          };
          objProductsUpdated.push(objProd);
        }
      });

      if (countProdsChanged === selectedProds.length) {
        console.log("No se han detectado cambios en el pedido ");
        setAlert("No se han detectado cambios en el pedido ");
        setIsAlert(true);
      } else {
        setAlertSec("Actualizando Pedido");
        setIsAlertSec(true);
        const toUpdateTakes = {
          accion: "take",
          idAlmacen: userStore,
          productos: arrayTakes,
        };
        const updatedStock = updateStock(toUpdateTakes);
        updatedStock
          .then((res) => {
            console.log("Stock Updateado para sacar productos");
            const toUpdateAdds = {
              accion: "add",
              idAlmacen: userStore,
              productos: arrayAdds,
            };
            const updatedStockThen = updateStock(toUpdateAdds);
            updatedStockThen
              .then((res) => {
                console.log("Stock Updateado para reponer productos");
                const toAddProducts = {
                  idPedido: idPedido,
                  productos: objProductsAdded,
                };
                const addedProds = addProductToOrder(toAddProducts);
                addedProds.then((added) => {
                  console.log("Productos agregados a pedido");
                  console.log(added);
                  const toUpdateProducts = {
                    idPedido: idPedido,
                    productos: objProductsUpdated,
                  };
                  const updatedProds = updateOrderProduct(toUpdateProducts);
                  updatedProds.then((res) => {
                    const updOrder = updateDbOrder(objUpdateOrder);
                    updOrder
                      .then((upo) => {
                        console.log("Productos actualizados en pedido");
                        setAlertSec("Pedido actualizado correctamente");
                        setIsAlertSec(true);
                        setTimeout(() => {
                          navigate("/principal");
                        }, 1500);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  });
                });
              })
              .catch((error) => {});
            console.log(res);
          })
          .catch((error) => {
            setIsAlertSec(false);
            setAlert(error.response.data.message);
            setIsAlert(true);
            console.log("Error en el update", error.response.data.message);
          });
      }
    }
  }
  return (
    <div>
      <div className="formLabel">MODIFICAR PEDIDO</div>
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
          <Modal.Title>ALERTA</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Select onChange={(e) => setOrderDetails(e.target.value)}>
            <option>Seleccione pedido</option>
            {pedidosList.map((pedido) => {
              return (
                <option
                  value={pedido.idPedido + "|" + pedido.codigoPedido}
                  key={pedido.idPedido}
                >
                  {pedido.codigoPedido}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </Form>
      <div className="secondHalf">
        <div className="formLabel">DETALLES DEL PEDIDO</div>
        <div>
          {isLoading ? <Image src={loading2} style={{ width: "2%" }} /> : null}
        </div>
        <Form>
          <div className="halfContainer">
            <Form.Group className="half" controlId="vendor">
              <Form.Label>Vendedor</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                disabled
                value={vendedor}
              />
            </Form.Group>
            <Form.Group className="half" controlId="client">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                disabled
                value={cliente}
              />
            </Form.Group>
          </div>
          <div className="halfContainer">
            <Form.Group className="half" controlId="vendor">
              <Form.Label>Zona</Form.Label>
              <Form.Control type="text" placeholder="" disabled value={zona} />
            </Form.Group>
            <Form.Group className="half" controlId="client">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                disabled
                value={fechaCrea}
              />
            </Form.Group>
          </div>
        </Form>
      </div>
      {selectedProds.length > 0 ? (
        <div className="secondHalf">
          <div className="formLabel">Agregar Productos</div>
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
        </div>
      ) : null}
      <div className="secondHalf">
        <div className="formLabel">Detalle productos</div>
        <div className="formLabel">
          NOTA: La cantidad inicial ya se encuentra reservada*
        </div>
        <div className="tableOne">
          {selectedProds.length > 0 ? (
            <div>
              <Table bordered striped hover className="table">
                <thead>
                  <tr className="tableHeader">
                    <td className="tableColumnSmall"></td>
                    <th className="tableColumnSmall">Codigo Producto</th>
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Disponible</th>
                    <th className="tableColumnSmall">Precio</th>
                    <th className="tableColumnSmall">Cantidad</th>
                    <th className="tableColumnMedium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProds.map((product, index) => {
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
                          {" "}
                          {available.find(
                            (pr) => pr.idProducto === product.idProducto
                          ) !== undefined
                            ? available.find(
                                (pr) => pr.idProducto === product.idProducto
                              ).cant_Actual + product.cantPrevia
                            : 0}
                        </td>
                        <td className="tableColumnSmall">{`${product.precioDeFabrica} Bs.`}</td>
                        <td className="tableColumnSmall">
                          <Form>
                            <Form.Group>
                              <Form.Control
                                type="number"
                                placeholder=""
                                className="tableTotal"
                                onChange={(e) =>
                                  changeQuantitys(
                                    index,
                                    e.target.value,
                                    product
                                  )
                                }
                                value={product.cantidadProducto}
                              />
                            </Form.Group>
                          </Form>
                        </td>

                        <td className="tableColumnMedium">{`${product.totalProd} Bs.`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText">Total</div>
                  <div className="totalColumnData">
                    {`${selectedProds.reduce((accumulator, object) => {
                      return accumulator + object.totalProd;
                    }, 0)} Bs.`}
                  </div>
                </div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText"> Descuento:</div>
                  <div className="totalColumnData">{`${descuento}%`}</div>
                </div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText"> A Facturar:</div>
                  <div className="totalColumnData">
                    {`${selectedProds.reduce((accumulator, object) => {
                      return accumulator + object.totalProd;
                    }, 0)} Bs.`}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="secondHalf">
          <div className="buttons">
            <Button
              variant="light"
              className="cyanLarge"
              onClick={() => updateOrder()}
            >
              Actualizar Pedido
            </Button>
            <Button
              variant="light"
              className="yellowLarge"
              onClick={() => deleteOrderAndUpdate()}
            >
              Cancelar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
