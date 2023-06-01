import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { dateString } from "../services/dateServices";
import {
  orderDetailsInvoice,
  orderToInvoiceList,
} from "../services/orderServices";
import Cookies from "js-cookie";
import "../styles/generalStyle.css";
import Pagination from "./pagination";
import PaymentModal from "./paymentModal";
import PaymentModalAlt from "./paymentModalAlt";

export default function FormInvoiceOrderAlt() {
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [auxOrderList, setAuxOrderList] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = orderList.slice(indexOfFirstRecord, indexOfLastRecord);
  const [search, setSearch] = useState("");
  const [isSaleModal, setIsSaleModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totales, setTotales] = useState({});
  const [cliente, setCliente] = useState({});
  const [isInvoice, setIsInvoice] = useState(false);
  const [idAlmacen, setIdAlmacen] = useState("");
  const [userRol, setUserRol] = useState("");
  const [idString, setIdString] = useState("");
  const [notas, setNotas] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    const user = JSON.parse(UsuarioAct);
    const idDepto = user.idDepto;
    const list = orderToInvoiceList(idDepto);
    list
      .then((res) => {
        console.log("Res", res);
        setOrderList(res.data.data);
        setAuxOrderList(res.data.data);
      })
      .catch((err) => {
        console.log("Error al cargar los pedidos", err);
      });
  }, []);
  function filter() {
    if (dateFilter.length > 0 && search.length > 0) {
      const spplited = dateFilter.split("-");
      var dia = spplited[2] > 9 ? spplited[2] : spplited[2].substring(1, 2);
      var mes = spplited[1] > 9 ? spplited[1] : spplited[1].substring(1, 2);
      var año = spplited[0];
      const reformated = `${dia}/${mes}/${año}`;
      const newList = auxOrderList.filter(
        (dt) =>
          dt.fechaCrea.substring(0, 9).includes(reformated) &&
          (dt.idString.toLowerCase().includes(search.toLowerCase()) ||
            dt.nit.includes(search))
      ); //
      setOrderList([...newList]);
    } else {
      if (dateFilter.length > 0) {
        const spplited = dateFilter.split("-");
        var dia = spplited[2] > 9 ? spplited[2] : spplited[2].substring(1, 2);
        var mes = spplited[1] > 9 ? spplited[1] : spplited[1].substring(1, 2);
        var año = spplited[0];
        const reformated = `${dia}/${mes}/${año}`;
        const newList = auxOrderList.filter((dt) =>
          dt.fechaCrea.substring(0, 9).includes(reformated)
        ); //
        setOrderList([...newList]);
      } else {
        const newList = auxOrderList.filter(
          (dt) =>
            dt.idString.toLowerCase().includes(search.toLowerCase()) ||
            dt.nit.includes(search)
        ); //
        setOrderList([...newList]);
      }
    }
  }
  function clearDate() {
    setOrderList(auxOrderList);
  }
  function invoiceProcess(id) {
    const idString = currentData.find((cd) => cd.idPedido == id).idString;
    const note = currentData.find((cd) => cd.idPedido == id).notas;
    setIdString(idString);
    setNotas(note);
    console.log("Id String", idString);
    const orderDetails = orderDetailsInvoice(id);
    orderDetails
      .then((os) => {
        console.log("detallitos", os);
        const details = os.data.response;
        var saleProducts = [];
        details.map((dt) => {
          const saleObj = {
            nombreProducto: dt.nombreProducto,
            idProducto: dt.idProducto,
            cantProducto: dt.cantidadProducto,
            total: dt.cantidadProducto * dt.precioDeFabrica,
            descuentoProd: dt.descuentoProducto,
            codInterno: dt.codInterno,
            codigoUnidad: dt.codigoUnidad,
            precioDeFabrica: dt.precioDeFabrica,
          };
          saleProducts.push(saleObj);
        });

        setSelectedProducts(saleProducts);
        const tot = os.data.response[0];
        console.log("Totales", tot);
        var totis = {
          idUsuarioCrea: tot.idUsuarioCrea,
          idCliente: tot.idCliente,
          fechaCrea: dateString(),
          fechaActualizacion: dateString(),
          montoTotal: tot.montoFacturar,
          descuento: tot.descuento,
          descuentoCalculado: tot.descuentoCalculado,
          montoFacturar: tot.montoTotal,
          idPedido: tot.idPedido,
          idAlmacen: tot.idAlmacen,
          correo: tot.correo,
          tipoDocumento: tot.tipoDocumento,
        };
        setIdAlmacen(tot.idAlmacen);
        setTotales(totis);
        setCliente({
          nit: tot.nit,
          razonSocial: tot.razonSocial,
        });
        setIsInvoice(true);
        setIsSaleModal(true);
      })
      .catch((err) => {
        console.log("Error al recibir los datos de la factura", err);
      });
  }
  const handleClose = () => {
    setIsAlert(false);
  };
  return (
    <div>
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
      {isInvoice ? (
        <div>
          <PaymentModalAlt
            setIsInvoice={setIsInvoice}
            isSaleModal={isSaleModal}
            setIsSaleModal={setIsSaleModal}
            isAlert={isAlert}
            setIsAlert={setIsAlert}
            setAlert={setAlert}
            cliente={cliente}
            setCliente={setCliente}
            totales={totales}
            selectedProducts={selectedProducts}
            idAlmacen={idAlmacen}
            orderDetails={{
              idString: idString,
              notas: notas,
            }}
            isOrder={true}
          />
        </div>
      ) : null}
      <div>
        <div className="formLabel">FACTURAR PEDIDOS</div>
      </div>
      <div className="dateInvoice">
        <Form className="dateInvoiceSelector">
          <Form.Label>Filtrar por fecha</Form.Label>
          <Form.Control
            type="date"
            onChange={(e) => {
              setDateFilter(e.target.value);
            }}
          />
          <Form.Label className="lowerLabel">
            Filtrar por Codigo Pedido o Nit
          </Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Form>
        <div className="invoiceButtonGroup">
          <div>
            <Button variant="warning" onClick={() => filter()}>
              Filtrar
            </Button>
          </div>
          <div>
            <Button variant="danger" onClick={() => clearDate()}>
              Limpiar
            </Button>
          </div>
        </div>
      </div>
      <div className="invoiceListCointainer">
        <div className="invoiceTable">
          <Table striped bordered>
            <thead className="reportHeader">
              <tr>
                <th>Nro</th>
                <th>Codigo Pedido</th>
                <th>Fecha</th>
                <th>Razon Social</th>
                <th>Nit</th>
                <th>Total</th>
                <th>Descuento</th>
                <th>Total Facturar</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="tableRow">
              {currentData.map((ol, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ol.idString}</td>
                    <td>{ol.fechaCrea.split(" ")[0]}</td>
                    <td>{ol.razonSocial}</td>
                    <td>{ol.nit}</td>
                    <td>{ol.montoFacturar.toFixed(2)}</td>
                    <td>{ol.descuentoCalculado.toFixed(2)}</td>
                    <td>{ol.montoTotal.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => invoiceProcess(ol.idPedido)}
                      >
                        Facturar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <Pagination
          postsperpage={recordsPerPage}
          totalposts={orderList.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
}
