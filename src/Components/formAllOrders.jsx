import React, { useEffect, useState, useRef } from "react";
import { Button, Image, Modal, Tab, Table } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import "../styles/buttonsStyles.css";
import {
  approveOrderFromId,
  getAllOrderList,
  getOrderDetail,
  getOrderList,
  getOrderProdList,
} from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { ExportToExcel } from "../services/exportServices";
import { OrderPDF } from "./orderPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { dateString } from "../services/dateServices";
import { getProducts } from "../services/productServices";
import { rePrintTransferOrder } from "../services/printServices";
import { OrderNote } from "./orderNote";
import ReactToPrint from "react-to-print";
export default function FormAllOrders() {
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
  const [auxPedidosList, setAuxPedidosList] = useState([]);
  const [filter, setFilter] = useState("");
  const componentRef = useRef();
  const buttonRef = useRef();
  const [isPrint, setIsPrint] = useState(false);
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
    const listaPedidos = getAllOrderList("");
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
  useEffect(() => {
    if (isPrint) {
      buttonRef.current.click();
    }
  }, [isPrint]);
  function setOrderDetails(stringPedido) {
    setProductDetail(null);
    setProductTable([]);

    setSelectedOrder({});
    setCodigoPedido("");
    setVendedor("");
    setCliente("");
    setZona("");
    setTotal("");
    setDescuento("");
    setFacturado("");
    setDescCalculado("");
    setNit("");
    setNotas("");
    setIsOrder(false);
    setProductList([]);
    setIsPdf(false);
    const stringParts = stringPedido.split("|");
    setIsLoading(true);
    setCodigoPedido(stringParts[1]);
    setSelectedOrder(stringParts[0]);

    const order = getOrderDetail(stringParts[0]);
    order.then((res) => {
      console.log("Order details", res);
      const fechaDesc = res.data.data[0].fechaCrea.substring(0, 10).split("/");
      const currentDate = dateString().substring(0, 10).split("/");
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
          currentDate[0] +
          " de " +
          meses[currentDate[1] - 1] +
          " de " +
          currentDate[2],
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
      setTipo(res.data.data[0].tipo);
      var sumatoria = 0;
      const prodList = getOrderProdList(stringParts[0]);
      prodList.then((resp) => {
        resp.data.data.map((pr) => {
          const found = allProducts.find(
            (item) => item.nombreProducto === pr.nombreProducto
          );
          sumatoria += found.precioDeFabrica * pr.cantidadProducto;
          setTotalMuestra(sumatoria);
          const total =
            res.data.data[0].tipo === "normal"
              ? pr.totalProd
              : found.precioDeFabrica * pr.cantidadProducto;

          //console.log("Found", found);
          const pTable = {
            producto: pr.nombreProducto,
            cantidad: pr.cantidadProducto,
            precio: pr.precioDeFabrica?.toFixed(2),
            total: total?.toFixed(2),
            "descuento calculado": pr.descuentoProducto?.toFixed(2),
          };
          setProductTable((productTable) => [...productTable, pTable]);
        });
        setProductList(resp.data.data);
        const auxDetail = [...productDetail];
        setProductDetail([...auxDetail, prodHeaderObj]);
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
          };
          setProductDetail([...auxDetail, prodHeaderObj]);
        }
        setIsLoading(false);
        setIsOrder(true);
        setIsPdf(true);
      });
    });
  }

  function handleAlert(mensaje, bool) {
    setAlert(mensaje);
    setIsAlert(bool);
  }
  function handlePdf() {
    pdfRef.current.click();
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

  function rePrint() {
    const details = rePrintTransferOrder(selectedOrder, "P");
    details.then((dt) => {
      console.log("Detalles", dt);
      const list = [
        {
          fechaSolicitud: fechaCrea,
          id: selectedOrder,
          usuario: vendedor,
          productos: dt.data,
          notas: dt.data[0].notas,
          rePrint: true,
          razonSocial: dt.data[0].razonSocial,
          zona: dt.data[0].zona,
          origen: dt.data[0].origen,
          destino: dt.data[0].destino,
        },
      ];
      setProductList(list);
      setIsPrint(true);
    });
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

      <div className="formLabel">TODOS LOS PEDIDOS</div>
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
                          {product?.precioDeFabrica + " Bs."}
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
      {selectedOrder != "" ? (
        <div className="secondHalf">
          <div className="formLabel">EXPORTAR PEDIDO</div>
          <Form>
            <Form.Group className="halfRadio" controlId="productDisccount">
              <div className="buttonsLarge">
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
                          : handleAlert(
                              "Por favor, seleccione un pedido",
                              true
                            );
                      }}
                    >
                      {"En Excel"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      variant="warning"
                      onClick={() => {
                        selectedOrder !== ""
                          ? handlePdf()
                          : handleAlert(
                              "Por favor, seleccione un pedido",
                              true
                            );
                      }}
                    >
                      {"En PDF"}
                    </Dropdown.Item>
                    <Dropdown.Item variant="warning" onClick={() => rePrint()}>
                      {"En Rollo"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Form.Group>
          </Form>
        </div>
      ) : null}
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
