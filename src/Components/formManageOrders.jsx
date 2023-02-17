import React, { useEffect, useState, useRef } from "react";
import { Button, Image, Modal, Tab, Table } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import "../styles/buttonsStyles.css";
import {
  approveOrderFromId,
  getOrderDetail,
  getOrderList,
  getOrderProdList,
} from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { ExportToExcel } from "../services/exportServices";
import { OrderPDF } from "./orderPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
    const listaPedidos = getOrderList("");
    listaPedidos.then((res) => {
      console.log("Lista pedidos", res.data.data);
      setPedidosList(res.data.data);
    });
  }, []);
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
      console.log("Order details", res);
      const fechaDesc = res.data.data[0].fechaCrea.substring(0, 10).split("/");

      setFechaCrea(
        fechaDesc[0] + " de " + meses[fechaDesc[1] - 1] + " de " + fechaDesc[2]
      );

      const prodHeaderObj = {
        vendedor: res.data.data[0].nombreVendedor,
        cliente: res.data.data[0].razonSocial,
        nit: res.data.data[0].nit,
        zona: res.data.data[0].zona,
        montoTotal: res.data.data[0].montoFacturar?.toFixed(2),
        descuento: res.data.data[0].descuento,
        "descuento calculado": res.data.data[0].descuentoCalculado?.toFixed(2),
        facturado: res.data.data[0].montoTotal?.toFixed(2),
        fechaCrea:
          fechaDesc[0] +
          " de " +
          meses[fechaDesc[1] - 1] +
          " de " +
          fechaDesc[2],
      };
      setVendedor(res.data.data[0].nombreVendedor);
      setCliente(res.data.data[0].razonSocial);
      setZona(res.data.data[0].zona);
      setTotal(res.data.data[0].montoFacturar);
      setDescuento(res.data.data[0].descuento);
      setFacturado(res.data.data[0].montoTotal);
      setDescCalculado(res.data.data[0].descuentoCalculado);
      setNit(res.data.data[0].nit);
      setNotas(res.data.data[0].notas);
      const prodList = getOrderProdList(stringParts[0]);
      prodList.then((res) => {
        res.data.data.map((pr) => {
          const pTable = {
            producto: pr.nombreProducto,
            cantidad: pr.cantidadProducto,
            precio: pr.precioDeFabrica?.toFixed(2),
            total: pr.totalProd?.toFixed(2),
            "descuento calculado": pr.descuentoProducto?.toFixed(2),
          };
          setProductTable((productTable) => [...productTable, pTable]);
        });
        setProductList(res.data.data);
        const auxDetail = [...productDetail];
        setProductDetail([...auxDetail, prodHeaderObj]);
        setIsLoading(false);
        setIsOrder(true);
        setIsPdf(true);
      });
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

          setTimeout(() => {
            navigate("/principal");
            setIsLoading(false);
          }, 2000);
        })
        .catch(() => {
          setAlert("Error al aprobar la orden");
          setIsAlert(true);

          setTimeout(() => {
            navigate("/principal");
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
  return (
    <div>
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
        <Form.Group
          className="mb-3"
          controlId="order"
          onChange={(e) => setOrderDetails(e.target.value)}
        >
          <Form.Select>
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
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumn">
                          {product.nombreProducto}
                        </td>
                        <td className="tableColumnSmall">
                          {product.precioDeFabrica + " Bs."}
                        </td>
                        <td className="tableColumnSmall">
                          {product.cantidadProducto}
                        </td>
                        <td className="tableColumnSmall">
                          {`${product.totalProd.toFixed(2)} Bs.`}
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
                    <td>{`${total?.toFixed(2)} Bs.`}</td>
                  </tr>
                  <tr className="tableRow">
                    <th
                      colSpan={3}
                      className="totalColumnOrder"
                    >{`Descuento (%)`}</th>
                    <td>{`${((descCalculado / total) * 100).toFixed(2)} %`}</td>
                  </tr>
                  <tr className="tableRow">
                    <th
                      colSpan={3}
                      className="totalColumnOrder"
                    >{`Descuento calculado`}</th>
                    <td>{`${descCalculado?.toFixed(2)} Bs.`}</td>
                  </tr>
                  <tr className="tableRow">
                    <th
                      colSpan={3}
                      className="totalColumnOrder"
                    >{`Total a facturar`}</th>
                    <td>{`${facturado?.toFixed(2)} Bs.`}</td>
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
          <Form.Group className="halfRadio" controlId="productDisccount">
            <div className="buttonsLarge">
              <Button
                variant="warning"
                className="cyanLarge"
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
            </div>
          </Form.Group>
        </Form>
      </div>
      {isPdf ? (
        <PDFDownloadLink
          document={
            <OrderPDF
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
    </div>
  );
}
