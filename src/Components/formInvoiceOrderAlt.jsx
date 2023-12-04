import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Image, Modal, Table } from "react-bootstrap";
import { dateString } from "../services/dateServices";
import loading2 from "../assets/loading2.gif";
import {
  orderDetailsInvoice,
  orderToInvoiceList,
  updateInvoicedOrder,
} from "../services/orderServices";
import Cookies from "js-cookie";
import "../styles/generalStyle.css";
import Pagination from "./pagination";
import PaymentModal from "./paymentModal";
import PaymentModalAlt from "./paymentModalAlt";
import { getBranchesPs } from "../services/storeServices";
import { formatInvoiceProducts } from "../Xml/invoiceFormat";
import { v4 as uuidv4 } from "uuid";
import { debouncedFullInvoiceProcess } from "../services/invoiceServices";
import {
  downloadAndPrintFile,
  downloadOnlyFile,
} from "../services/exportServices";
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
  const [userName, setUserName] = useState("");
  const [idString, setIdString] = useState("");
  const [notas, setNotas] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [userList, setUserList] = useState([]);
  const [bulkList, setBulkList] = useState([]);
  const [isBulkModal, setIsBulkModal] = useState(false);
  const [tipoPago, setTipoPago] = useState("");
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [pdv, setPdv] = useState("");
  const [branchInfo, setBranchInfo] = useState({});
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      const pdve = Cookies.get("pdv");

      setUserName(JSON.parse(UsuarioAct).usuario);
      setIdAlmacen(JSON.parse(UsuarioAct).idAlmacen);
      const PuntoDeVentas = pdve != undefined ? pdve : 0;
      setPdv(PuntoDeVentas);
    }
    const suc = getBranchesPs();
    suc.then((resp) => {
      const sucursales = resp.data;

      const sucur = sucursales.find(
        (sc) => JSON.parse(UsuarioAct).idAlmacen == sc.idAgencia
      )
        ? sucursales.find(
            (sc) => JSON.parse(UsuarioAct).idAlmacen == sc.idAgencia
          )
        : sucursales.find((sc) => "AL001" == sc.idAgencia);

      const branchData = {
        nombre: sucur.nombre,
        dir: sucur.direccion,
        tel: sucur.telefono,
        ciudad: sucur.ciudad,
        nro: sucur.idImpuestos,
      };

      setBranchInfo(branchData);
    });
    const user = JSON.parse(UsuarioAct);
    const idDepto = user.idDepto;
    const list = orderToInvoiceList(idDepto);
    list
      .then((res) => {
        let uniqueArray = res.data.data.reduce((acc, curr) => {
          if (!acc.find((obj) => obj.usuario === curr.usuario)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setUserList(uniqueArray);

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

      var dia = spplited[2];
      var mes = spplited[1];
      var año = spplited[0];
      const reformated = `${dia}/${mes}/${año}`;

      const newList = auxOrderList.filter(
        (dt) =>
          dt.fechaCrea.includes(reformated) &&
          (dt.idString.toLowerCase().includes(search.toLowerCase()) ||
            dt.nit.includes(search))
      ); //
      setOrderList([...newList]);
    } else {
      if (dateFilter.length > 0) {
        const spplited = dateFilter.split("-");

        var dia = spplited[2];
        var mes = spplited[1];
        var año = spplited[0];
        const reformated = `${dia}/${mes}/${año}`;

        const newList = auxOrderList.filter((dt) =>
          dt.fechaCrea.includes(reformated)
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

  function filterByUser(value) {
    if (value === "Limpiar") {
      setOrderList(auxOrderList);
    } else {
      const newList = orderList.filter((dt) => dt.usuario === value); //
      setOrderList([...newList]);
    }
  }

  function handleChecks(value, index) {
    if (!bulkList.includes(value)) {
      setBulkList([...bulkList, value]);
    } else {
      const indexOf = bulkList.indexOf(value);
      const baux = [...bulkList];
      baux.splice(indexOf, 1);
      setBulkList(baux);
    }
  }

  async function bulkInvoicing() {
    setIsBulkModal(false);

    for (let i = 0; i < bulkList.length; i++) {
      setAlert(`Procesando pedido nro ${bulkList[i]}`);
      setIsAlert(true);

      const idFactura = bulkList[i];

      try {
        const os = await orderDetailsInvoice(idFactura);
        console.log("detallitos", os);
        const details = os.data.response;
        var saleProducts = [];
        details.forEach((dt) => {
          const precio =
            dt.precio_producto != null
              ? dt.precio_producto
              : dt.issuper == 1
              ? dt.precioSuper
              : dt.precioDeFabrica;
          const saleObj = {
            nombreProducto: dt.nombreProducto,
            idProducto: dt.idProducto,
            cantProducto: dt.cantidadProducto,
            total: dt.cantidadProducto * precio,
            descuentoProd: dt.descuentoProducto,
            codInterno: dt.codInterno,
            codigoUnidad: dt.codigoUnidad,
            precioDeFabrica: precio,
          };
          saleProducts.push(saleObj);
        });
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
        const client = {
          nit: tot.nit,
          razonSocial: tot.razonSocial,
        };
        try {
          console.log("Before invoicingProcess");
          await invoicingProcess(totis, saleProducts, client);
          console.log("After invoicingProcess");
          if (i === bulkList.length - 1) {
            setAlert("Pedidos facturados y facturas descargadas correctamente");
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          }
        } catch (err) {
          console.log("Error 1", err);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      } catch (err) {
        console.log("Error 2", err);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    }
  }

  useEffect(() => {
    console.log("Bulk list", bulkList);
  }, [bulkList]);

  function invoiceProcess(id) {
    const idString = currentData.find((cd) => cd.idPedido == id).idString;
    const note = currentData.find((cd) => cd.idPedido == id).notas;
    setIdString(idString);
    setNotas(note);
    console.log("Id String", idString);
    const orderDetails = orderDetailsInvoice(id);
    orderDetails
      .then((os) => {
        console.log("detallitos", os.data.response);
        const details = os.data.response;
        var saleProducts = [];
        details.map((dt) => {
          const precio =
            dt.precio_producto != null
              ? dt.precio_producto
              : dt.issuper == 1
              ? dt.precioSuper
              : dt.precioDeFabrica;
          const saleObj = {
            nombreProducto: dt.nombreProducto,
            idProducto: dt.idProducto,
            cantProducto: dt.cantidadProducto,
            total: dt.cantidadProducto * precio,
            descuentoProd: dt.descuentoProducto,
            codInterno: dt.codInterno,
            codigoUnidad: dt.codigoUnidad,
            precioDeFabrica: precio,
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
          nit: tot.nit,
          razonSocial: tot.razonSocial,
        };
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

  async function invoicingProcess(totales, products, cliente) {
    return new Promise(async (resolve, reject) => {
      try {
        const uniqueId = uuidv4();
        const storeInfo = {
          nroSucursal: branchInfo.nro,
          puntoDeVenta: pdv,
        };
        const productos = formatInvoiceProducts(products);
        const saleBody = {
          pedido: {
            idUsuarioCrea: totales.idUsuarioCrea,
            idCliente: totales.idCliente,
            fechaCrea: dateString(),
            fechaActualizacion: dateString(),
            montoTotal: totales.montoTotal,
            descCalculado: totales.descuentoCalculado,
            descuento: totales.descuento,
            montoFacturar: totales.montoFacturar,
            idPedido: totales.idPedido,
            idFactura: 0,
          },
          productos: products,
        };
        const invoiceBody = {
          idCliente: totales.idCliente,
          nroFactura: 0,
          idSucursal: branchInfo.nro,
          nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
          fechaHora: dateString(),
          nitCliente: cliente.nit,
          razonSocial: cliente.razonSocial,
          tipoPago: tipoPago,
          pagado: totales.montoFacturar,
          cambio: 0,
          nroTarjeta: ``,
          cuf: "",
          importeBase: parseFloat(totales.montoFacturar).toFixed(2),
          debitoFiscal: parseFloat(totales.montoFacturar * 0.13).toFixed(2),
          desembolsada: 0,
          autorizacion: `${dateString()}-${0}-${idAlmacen}`,
          cufd: "",
          fechaEmision: "",
          nroTransaccion: 0,
          idOtroPago: 0,
          vale: 0,
          aPagar: 1,
          puntoDeVenta: pdv,
          idAgencia: idAlmacen,
          voucher: 0,
          pya: false,
        };

        const emizorBody = {
          numeroFactura: 0,
          nombreRazonSocial: cliente.razonSocial,
          codigoPuntoVenta: parseInt(pdv),
          fechaEmision: "",
          cafc: "",
          codigoExcepcion: 0,
          descuentoAdicional: totales.descuentoCalculado,
          montoGiftCard: 0,
          codigoTipoDocumentoIdentidad: totales.tipoDocumento,
          numeroDocumento: cliente.nit == 0 ? "1000001" : `${cliente.nit}`,
          complemento: "",
          codigoCliente: `${totales.idCliente}`,
          codigoMetodoPago: tipoPago,
          numeroTarjeta: "",
          montoTotal: parseFloat(totales.montoFacturar).toFixed(2),
          codigoMoneda: 1,
          tipoCambio: 1,
          montoTotalMoneda: parseFloat(totales.montoFacturar.toFixed(2)),
          usuario: userName,
          emailCliente: totales.correo,
          telefonoCliente: "",
          extras: { facturaTicket: uniqueId },
          codigoLeyenda: 0,
          montoTotalSujetoIva: parseFloat(
            parseFloat(totales.montoFacturar)
          ).toFixed(2),
          tipoCambio: 1,
          detalles: productos,
        };
        const updateStockBody = {
          idAlmacen: idAlmacen,
          productos: [],
        };
        const composedBody = {
          venta: saleBody,
          invoice: invoiceBody,
          emizor: emizorBody,
          stock: updateStockBody,
          storeInfo: storeInfo,
        };
        console.log("Body compuesto", composedBody);
        try {
          const invocieResponse = await debouncedFullInvoiceProcess(
            composedBody
          );
          console.log("Respuesta de la fac", invocieResponse);
          if (invocieResponse.data.code === 200) {
            const fecha = dateString();
            const parsed = JSON.parse(invocieResponse.data.data).data.data;
            console.log("Datos recibidos", parsed);
            const updated = updateInvoicedOrder(totales.idPedido, fecha);
            updated.then(async (res) => {
              try {
                console.log("antes de la descarga");
                await downloadOnlyFile(
                  parsed.shortLink,
                  parsed.numeroFactura,
                  cliente.nit
                );
                await debouncedFullInvoiceProcess.cancel();
                console.log("despues de la descarga");
                setTimeout(() => {
                  resolve(true);
                }, 3000); // Resolve the promise when the process is successful
              } catch (err) {
                reject(err); // Reject the promise if there's an error during the download
              }
            });
          } else {
            reject("Invoice response code is not 200"); // Reject the promise if the invoice response code is not 200
          }
        } catch (error) {
          console.log("Body compuesto", composedBody);
          reject(error); // Reject the promise if there's an error during the invoicing process
        }
      } catch (error) {
        console.log("Error aki?");
        reject(false);
      }
    });
  }

  function validateFormOfPayment(e) {
    e.preventDefault();
    if (tipoPago === "") {
      setAlert("Por favor seleccione un tipo de pago general");
      setIsAlert(true);
      setTimeout(() => {
        setIsAlert(false);
      }, 5000);
    } else {
      bulkInvoicing();
    }
  }

  const handleClose = () => {
    setIsAlert(false);
  };
  return (
    <div>
      <Modal show={isAlert}>
        <Modal.Header>
          <Modal.Title>{alert}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isBulkModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tipo de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Select
              onChange={(e) => setTipoPago(e.target.value)}
              value={tipoPago}
            >
              <option>Seleccione tipo de pago</option>
              <option value="3">Cheque</option>
              <option value="6">Pago Posterior</option>
              <option value="7">Transferencia</option>
              <option value="8">Deposito en cuenta</option>
              <option value="9">Transferencia Swift</option>
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={(e) => validateFormOfPayment(e)}>
            Facturar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setIsBulkModal(false);
            }}
          >
            {" "}
            Cancelar
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
          <Form.Label className="lowerLabel">Filtrar por Usuario</Form.Label>
          <Form.Select onChange={(e) => filterByUser(e.target.value)}>
            <option value={"Limpiar"}>Seleccione un usuario / Limpiar</option>
            {userList.map((ul, index) => {
              return (
                <option key={index} value={ul.usuario}>
                  {ul.usuario}
                </option>
              );
            })}
          </Form.Select>
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
          <div></div>
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
                <th>Facturar</th>
                <th style={{ maxWidth: "5vw" }}>{`Selec. \nMúltiple`}</th>
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
                        disabled={bulkList.length > 0}
                      >
                        Facturar
                      </Button>
                    </td>

                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Form.Check
                        value={ol.idPedido}
                        onChange={(e) => handleChecks(e.target.value, index)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="tableFooterAlt">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={2}>
                  {bulkList.length > 0 ? (
                    <Button
                      variant="success"
                      onClick={(e) => setIsBulkModal(true)}
                    >
                      Facturar Todo
                    </Button>
                  ) : null}
                </td>
              </tr>
            </tfoot>
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
