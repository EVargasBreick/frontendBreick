import React, { useEffect, useState, useRef } from "react";
import { Button, Image, Modal, Tab, Table } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import "../styles/buttonsStyles.css";
import {
  approveOrderFromId,
  cancelOrder,
  composedCancelOrder,
  getOrderDetail,
  getOrderList,
  getOrderProdList,
} from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { ExportToExcel } from "../services/exportServices";
import { OrderPDF } from "./orderPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getProducts } from "../services/productServices";
import { dateString } from "../services/dateServices";

import ReactToPrint from "react-to-print";
import { OrderNote } from "./orderNote";
import { OrderPDFAlt } from "./OrderPDFAlt";
import { toUpper } from "lodash";
export default function FormManageOrders() {
  const [pedidosList, setPedidosList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [cliente, setCliente] = useState("");
  const [zona, setZona] = useState("");
  const [total, setTotal] = useState("");
  const [descuento, setDescuento] = useState("");
  const [facturado, setFacturado] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [productTable, setProductTable] = useState([]);
  const [isExcel, setIsExcel] = useState(true);
  const [fechaCrea, setFechaCrea] = useState("");
  const [codigoPedido, setCodigoPedido] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [nit, setNit] = useState("");
  const pdfRef = useRef();
  const [descCalculado, setDescCalculado] = useState("");
  const [notas, setNotas] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [tipo, setTipo] = useState("");
  const [totalMuestra, setTotalMuestra] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [noteList, setNoteList] = useState([]);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [userStore, setUserStore] = useState("");
  const [auxPedidosList, setAuxPedidosList] = useState([]);
  const [filter, setFilter] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const buttonRef = useRef();
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
  const [prodList, setProdList] = useState([]);
  const navigate = useNavigate();
  const componentRef = useRef();
  useEffect(() => {
    const listaPedidos = getOrderList("");
    listaPedidos.then((res) => {
      console.log("Lista pedidos", res.data.data);
      setPedidosList(res.data.data);
      setAuxPedidosList(res.data.data);
    });
    const allProducts = getProducts("all");
    allProducts.then((res) => {
      setAllProducts(res.data.data);
    });
  }, []);
  const handleClose = () => {
    setIsAlert(false);
    setIsLoading(false);
  };
  function setOrderDetails(stringPedido) {
    const stringParts = stringPedido.split("|");
    setIsLoading(true);
    console.log("Codigo", stringParts[0]);
    setCodigoPedido(stringParts[1]);
    setSelectedOrder(stringParts[0]);
    const order = getOrderDetail(stringParts[0]);
    order
      .then((res) => {
        console.log("Order details", res.data.data[0]);
        //console.log(dateString().substring(0, 10).split("/"));
        const isSuperm = res.data.data[0].issuper;
        console.log("Is super", isSuperm);
        setIsSuper(isSuperm);
        const fechaDesc = res.data.data[0].fechaCrea
          .substring(0, 10)
          .split("/");
        const currentDate = dateString().substring(0, 10).split("/");
        setFechaCrea(
          fechaDesc[0] +
            " de " +
            meses[fechaDesc[1] - 1] +
            " de " +
            fechaDesc[2]
        );

        const prodHeaderObj = {
          vendedor: res.data.data[0].nombreVendedor,
          cliente: res.data.data[0].razonSocial,
          nit: res.data.data[0].nit,
          zona: res.data.data[0].zona,
          montoTotal: res.data.data[0].montoFacturar?.toFixed(2),
          descuento: res.data.data[0].descuento,
          "descuento calculado":
            res.data.data[0].descuentoCalculado?.toFixed(2),
          facturado: res.data.data[0].montoTotal?.toFixed(2),
          fechaCrea:
            currentDate[0] +
            " de " +
            meses[currentDate[1] - 1] +
            " de " +
            currentDate[2],
          tipo: toUpper(res.data.data[0].tipo),
        };
        setUserStore(res.data.data[0].idAlmacen);
        setVendedor(res.data.data[0].nombreVendedor);
        setCliente(res.data.data[0].razonSocial);
        setZona(res.data.data[0].zona);
        setTotal(res.data.data[0].montoFacturar);
        setDescuento(res.data.data[0].descuento);
        setFacturado(res.data.data[0].montoTotal);
        setDescCalculado(res.data.data[0].descuentoCalculado);
        setNit(res.data.data[0].nit);
        setNotas(res.data.data[0].notas);
        setTipo(res.data.data[0].tipo);
        const prodList = getOrderProdList(stringParts[0]);
        console.log("Tipo", res.data.data[0].tipo === "normal");
        var sumatoria = 0;
        prodList.then((resp) => {
          console.log("Order prod list", resp.data.data);
          const array = [];

          const element = {
            idNro: res.data.data[0].idPedido,
            id: res.data.data[0].codigoPedido,
            productos: resp.data.data,
            fechaSolicitud: res.data.data[0].fechaCrea,
            usuario: res.data.data[0].usuario,
            tipo: res.data.data[0].tipo,
            notas: res.data.data[0].notas,
            razonSocial: res.data.data[0].razonSocial,
            zona: res.data.data[0].zona,
          };
          array.push(element);
          setNoteList(array);
          console.log("Array test", array);
          resp.data.data.map((pr) => {
            const found = allProducts.find(
              (item) => item.nombreProducto === pr.nombreProducto
            );
            sumatoria += found?.precioDeFabrica * pr.cantidadProducto;
            setTotalMuestra(sumatoria);
            const total =
              res.data.data[0].tipo === "normal"
                ? pr.totalProd
                : isSuperm
                ? found.precioSuper * pr.cantidadProducto
                : found.precioDeFabrica * pr.cantidadProducto;

            //console.log("Found", found);
            const pTable = {
              producto: pr.nombreProducto,
              cantidad: pr.cantidadProducto,
              precio:
                pr.precio_producto != null
                  ? pr.precio_producto
                  : isSuperm
                  ? pr.precioSuper?.toFixed(2)
                  : pr.precioDeFabrica?.toFixed(2),
              total: total?.toFixed(2),
              "descuento calculado": pr.descuentoProducto?.toFixed(2),
            };

            setProductTable((productTable) => [...productTable, pTable]);
          });
          setProductList(resp.data.data);
          const auxDetail = [...productDetail];
          setProductDetail([prodHeaderObj]);
          if (res.data.data[0].tipo !== "normal") {
            const prodHeaderObj = {
              vendedor: res.data.data[0].nombreVendedor,
              cliente: res.data.data[0].razonSocial,
              nit: res.data.data[0].nit,
              zona: res.data.data[0].zona,
              montoTotal: sumatoria,
              descuento: 0,
              "descuento calculado": 0,
              facturado: sumatoria,
              fechaCrea:
                currentDate[0] +
                " de " +
                meses[currentDate[1] - 1] +
                " de " +
                currentDate[2],
              tipo: toUpper(res.data.data[0].tipo),
            };
            setProductDetail([prodHeaderObj]);
          }

          setIsLoading(false);
          setIsOrder(true);
          setIsPdf(true);
        });
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }
  function approveOrder(idPedido) {
    if (selectedOrder !== "") {
      setIsLoading(true);
      const approvedOrder = approveOrderFromId(idPedido);
      approvedOrder
        .then(() => {
          setAlert("Orden aprobada!");
          setIsAlert(true);
          setIsLoaded(true);
        })
        .catch(() => {
          setAlert("Error al aprobar la orden");
          setIsAlert(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        });
    } else {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    }
  }
  function handleAlert(mensaje, bool) {
    setAlert(mensaje);
    setIsAlert(bool);
  }
  function handlePdf() {
    pdfRef.current.click();
  }
  useEffect(() => {
    if (isLoaded) {
      buttonRef.current.click();
    }
  }, [isLoaded]);
  /*
  function deleteOrderAndUpdate() {
    if (selectedOrder === "") {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    } else {
      setAlertSec("Cancelando pedido y actualizando kardex");
      setIsAlertSec(true);
      const objProdsDelete = {
        accion: "add",
        idAlmacen: userStore,
        productos: productList,
        detalle: `DPCPD-${selectedOrder}`,
      };
      const reStocked = updateStock(objProdsDelete);
      reStocked.then((rs) => {
        const canceled = cancelOrder(selectedOrder);
        canceled.then((cld) => {
          setAlertSec("Pedido cancelado y kardex actualizado, redirigiendo...");
          setIsAlertSec(true);
          setTimeout(() => {
            navigate("/principal");
          }, 1500);
        });
      });
    }
  }*/

  async function deleteOrderAndUpdateAlt() {
    if (selectedOrder === "") {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    } else {
      setAlertSec("Cancelando pedido y actualizando kardex");
      setIsAlertSec(true);
      const objProdsDelete = {
        accion: "add",
        idAlmacen: userStore,
        productos: productList,
        detalle: `DPCPD-${selectedOrder}`,
      };
      const compBody = {
        stock: objProdsDelete,
        order: selectedOrder,
      };
      try {
        const canceled = await composedCancelOrder(compBody);
        console.log("Cancelado correctamente", canceled);
        setAlertSec("Pedido cancelado y kardex actualizado, redirigiendo...");
        setIsAlertSec(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        setIsAlertSec(false);
        console.log("Error al cancelar", error);
        setAlert("Error al cancelar", error);
        setIsAlert(true);
      }
    }
  }
  function filterOrders(value) {
    setFilter(value);
    const filtered = auxPedidosList.filter(
      (data) =>
        data.idPedido === value ||
        data.codigoPedido
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase())
    );
    setPedidosList(filtered);
  }
  return (
    <div>
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

      <div className="formLabel">ADMINISTRAR PEDIDOS</div>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Label>Filtrar por numero, usuario o tipo</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => {
              filterOrders(e.target.value);
            }}
            value={filter}
          />
          <Form.Label className="formLabel">Lista de Pedidos</Form.Label>
          <Form.Select
            onChange={(e) => {
              setProductTable([]);
              setOrderDetails(e.target.value);
            }}
          >
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
        <div>
          {isLoading ? <Image src={loading2} style={{ width: "2%" }} /> : null}
        </div>
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
          <Form.Group className="half" controlId="zone">
            <Form.Label>Zona</Form.Label>
            <Form.Control type="text" placeholder="" disabled value={zona} />
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="client">
            <Form.Label>Cliente</Form.Label>
            <Form.Control type="text" placeholder="" disabled value={cliente} />
          </Form.Group>

          <Form.Group className="half" controlId="total">
            <Form.Label>Nit</Form.Label>
            <Form.Control type="number" placeholder="" disabled value={nit} />
          </Form.Group>
        </div>

        <div className="halfContainer">
          <Form.Group className="half" controlId="discount">
            <Form.Label>Fecha de creación</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              disabled
              value={fechaCrea}
            />
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="discount">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              disabled
              value={toUpper(tipo)}
            />
          </Form.Group>
        </div>
      </Form>
      <div className="tableHalf">
        <div className="formLabel">Detalle</div>
        <div className="tableOne">
          {isOrder ? (
            <div>
              <Table bordered striped hover>
                <thead>
                  <tr className="tableHeader">
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Precio</th>
                    <th className="tableColumnSmall">Cantidad</th>
                    <th className="tableColumnSmall">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product, index) => {
                    const found = allProducts.find(
                      (item) => item.nombreProducto === product.nombreProducto
                    );
                    const total =
                      tipo === "normal"
                        ? product.totalProd
                        : found.precioDeFabrica * product.cantidadProducto;

                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumn">
                          {product.nombreProducto}
                        </td>
                        <td className="tableColumnSmall">
                          {product.precio_producto != null
                            ? product.precio_producto
                            : isSuper
                            ? product.precioSuper
                            : product.precioDeFabrica + " Bs."}
                        </td>
                        <td className="tableColumnSmall">
                          {product.cantidadProducto}
                        </td>
                        <td className="tableColumnSmall">
                          {`${total?.toFixed(2)} Bs.`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="tableRow">
                    <th className="totalColumnOrder" colSpan={3}>
                      Total
                    </th>
                    <td>{`${
                      tipo === "normal"
                        ? total?.toFixed(2)
                        : totalMuestra?.toFixed(2)
                    } Bs.`}</td>
                  </tr>
                  <tr className="tableRow">
                    <th
                      colSpan={3}
                      className="totalColumnOrder"
                    >{`Descuento (%)`}</th>
                    <td>{`${
                      tipo === "normal"
                        ? ((descCalculado / total) * 100).toFixed(2)
                        : 0
                    } %`}</td>
                  </tr>
                  <tr className="tableRow">
                    <th
                      colSpan={3}
                      className="totalColumnOrder"
                    >{`Descuento calculado`}</th>
                    <td>{`${
                      tipo === "normal" ? descCalculado?.toFixed(2) : 0.0
                    } Bs.`}</td>
                  </tr>
                  <tr className="tableRow">
                    <th
                      colSpan={3}
                      className="totalColumnOrder"
                    >{`Total a facturar`}</th>
                    <td>{`${
                      tipo === "normal"
                        ? facturado?.toFixed(2)
                        : totalMuestra?.toFixed(2)
                    } Bs.`}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          ) : null}
        </div>
        <div className="secondHalf">
          <div className="formLabel">NOTAS DEL PEDIDO</div>
          <Form.Control value={notas} disabled as="textarea" rows={3} />
        </div>
      </div>
      <div className="secondHalf">
        <div className="formLabel">APROBAR PEDIDO</div>
        <Form>
          <Form.Group className="halfRadioAlt" controlId="productDisccount">
            <div className="buttonsLargeAlt">
              <Button
                variant="warning"
                className="yellow"
                onClick={() => {
                  approveOrder(selectedOrder);
                }}
              >
                {isLoading ? (
                  <Image src={loading2} style={{ width: "10%" }} />
                ) : (
                  "Aprobar"
                )}
              </Button>

              <Dropdown className="yellowDrop">
                <Dropdown.Toggle
                  variant="success"
                  className="yellowDropOp"
                  id="dropdown-basic"
                  style={{ color: "white", backgroundColor: "#5cb8b2" }}
                >
                  {"Generar nota"}
                </Dropdown.Toggle>

                <Dropdown.Menu className="yellowDropOp" variant="warning">
                  <Dropdown.Item
                    variant="warning"
                    onClick={() => {
                      selectedOrder !== ""
                        ? ExportToExcel(
                            productTable,
                            productDetail,
                            codigoPedido,
                            "pedido"
                          )
                        : handleAlert("Por favor, seleccione un pedido", true);
                    }}
                  >
                    {"En Excel"}
                  </Dropdown.Item>
                  <Dropdown.Item
                    variant="warning"
                    onClick={() => {
                      selectedOrder !== ""
                        ? handlePdf()
                        : handleAlert("Por favor, seleccione un pedido", true);
                    }}
                  >
                    {"En PDF"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="danger"
                onClick={() => deleteOrderAndUpdateAlt()}
              >
                Cancelar Pedido
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
      {isPdf ? (
        <PDFDownloadLink
          document={
            <OrderPDFAlt
              detalle={productDetail[0]}
              productos={productTable}
              codigo={codigoPedido}
            />
          }
          fileName={`${codigoPedido}`}
        >
          <Button ref={pdfRef} className="hiddenButton"></Button>
        </PDFDownloadLink>
      ) : null}
      {isLoaded ? (
        <div>
          <div hidden>
            <OrderNote productList={noteList} ref={componentRef} />
          </div>
          <ReactToPrint
            trigger={() => (
              <Button variant="warning" className="yellowLarge" ref={buttonRef}>
                Imprimir ordenes
              </Button>
            )}
            content={() => componentRef.current}
            onAfterPrint={() => {
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
