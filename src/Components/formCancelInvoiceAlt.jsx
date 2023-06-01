import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import {
  cancelInvoiceUpdate,
  getStoreInvoices,
} from "../services/invoiceServices";
import { Button, Form, Modal, Table, Image } from "react-bootstrap";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";

import { CancelInvoice } from "../Xml/cancelInvoice";
import { updateStock } from "../services/orderServices";
import { getMobileSalePoints } from "../services/storeServices";

export default function FormCancelInvoiceAlt() {
  const [userStore, setUserStore] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [isCanceled, setIsCanceled] = useState(false);
  const [motivo, setMotivo] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [allFacts, setAllFacts] = useState([]);
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [auxFac, setAuxFac] = useState([]);
  const [filter, setFilter] = useState("");
  const [pointOfSale, setPointOfSale] = useState("");
  const [isSudo, setIsSudo] = useState(false);
  const [sucList, setSucList] = useState([]);
  const [selectedSuc, setSelectedSuc] = useState("");
  const [usuAct, setUsuact] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUsuact(UsuarioAct);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      const mobilepdvdata = getMobileSalePoints(
        JSON.parse(UsuarioAct).idAlmacen == "AL001"
          ? ""
          : JSON.parse(UsuarioAct).idAlmacen
      );
      mobilepdvdata.then((res) => {
        const datos = res.data[0];
        if (datos == undefined) {
          const pdve = Cookies.get("pdv");
          const PuntoDeVentas = pdve != undefined ? pdve : 0;
          setPointOfSale(PuntoDeVentas);
          getInvoices(UsuarioAct, PuntoDeVentas);
        } else {
          //setPointOfSale(datos.nroPuntoDeVenta);
          //Cookies.set("pdv", datos.nroPuntoDeVenta, { expires: 0.5 });
          //getInvoices(UsuarioAct, datos.nroPuntoDeVenta);
          setSucList(res.data);
          setIsSudo(true);
        }
      });
    }
  }, []);

  function getInvoices(UsuarioAct, PuntoDeVentas) {
    const facturas = getStoreInvoices(
      JSON.parse(UsuarioAct).idAlmacen,
      PuntoDeVentas
    );
    facturas.then((fc) => {
      const filteredDates = filterDates(fc.data);
      filteredDates.then((res) => {
        setAllFacts(res);
        let uniqueArray = res.reduce((acc, curr) => {
          if (!acc.find((obj) => obj.idFactura === curr.idFactura)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setFacturas(uniqueArray);
        setAuxFac(uniqueArray);
      });
    });
  }

  function formattedCuf(cuf) {
    const splitted = cuf.match(/.{25}/g);
    return splitted ? splitted.join(" ") : cuf;
  }
  function filterById(id) {
    setFilter(id);
    const newList = auxFac.filter(
      (dt) =>
        dt.nroFactura.includes(id) ||
        dt.razonSocial.toLowerCase().includes(id.toLowerCase()) ||
        dt.nitCliente.includes(id)
    );
    setFacturas([...newList]);
  }
  function cancelInvoice(invoice) {
    setIsAlert(true);
    setAlert("Anulando Factura");
    console.log("Datos factura", invoice);
    const cancelObj = {
      transaccionId: invoice.nroTransaccion,
      puntoDeVentaId: invoice.idImpuestos,
      numeroComprobante: parseInt(invoice.nroFactura),
      tipoComprobante: process.env.REACT_APP_COMPRAVENTA,
      motivoAnulacion: motivo,
      nit: parseInt(process.env.REACT_APP_NIT_EMPRESA),
      caja: pointOfSale,
    };
    console.log("Anulando factura", cancelObj);
    const canceled = CancelInvoice(cancelObj);
    canceled
      .then((cld) => {
        console.log("Cancelada", cld);
        const mensaje =
          cld.response.data.AnularComprobanteResponse[0]
            .AnularComprobanteResult[0];
        if (
          mensaje.includes("Anulación confirmada del comprobante") ||
          mensaje.includes("se encuentra anulado")
        ) {
          const products = allFacts.filter(
            (af) => af.idFactura == invoice.idFactura
          );
          console.log("Selected invoice", selectedInvoice);
          const returnToStock = updateStock({
            accion: "add",
            idAlmacen: selectedInvoice.idAgencia,
            productos: products,
            detalle: `ANFAC-${invoice.idFactura}`,
          });
          console.log("Updateando stock", products);
          returnToStock.then((returned) => {
            const anulada = cancelInvoiceUpdate(invoice.idFactura);
            anulada
              .then((an) => {
                setAlert("Factura anulada");
                setTimeout(() => {
                  window.location.reload(false);
                }, 5000);
              })
              .catch((err) => {
                console.log("Error al anular en sistema breick", err);
              });
          });
        }
      })
      .catch((err) => {
        console.log("Error al anular en sistema de impuestos", err);
      });
  }

  function handleSuc(nroPuntoDeVenta) {
    const selected = sucList.find(
      (sl) => sl.nroPuntoDeVenta == nroPuntoDeVenta
    );
    const idSelected = selected.idAgencia;
    setSelectedSuc(selected.nroPuntoDeVenta);
    setPointOfSale(nroPuntoDeVenta);
    Cookies.set("pdv", nroPuntoDeVenta, { expires: 0.5 });
    getInvoices(JSON.stringify({ idAlmacen: idSelected }), nroPuntoDeVenta);
  }

  function filterDates(array) {
    const today = new Date();
    const dia_actual = today.getDate();
    const mes_actual = today.getMonth() + 1;
    const anio_actual = today.getFullYear();
    const filtered = [];

    array.map((ar) => {
      const fecha = ar.fechaHora.split(" ").shift();
      const fechaParts = fecha.split("/");
      const anio_fac = fechaParts[2];
      const mes_fac = fechaParts[1];
      if (anio_actual > anio_fac) {
        if (mes_actual === 1) {
          if (13 - mes_fac < 2) {
            if (dia_actual < 11) {
              filtered.push(ar);
            }
          }
        }
      } else {
        if (mes_actual - mes_fac < 2) {
          if (mes_actual == mes_fac) {
            filtered.push(ar);
          } else {
            if (dia_actual < 11) {
              filtered.push(ar);
            }
          }
        }
      }
    });
    return new Promise((resolve) => resolve(filtered));
  }
  return (
    <div>
      <Modal show={isAlert}>
        <Modal.Header closeButton>
          <Modal.Title>{alert}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isCanceled}>
        <Modal.Header className="modalHeader">
          Seleccione motivo de anulación
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Select onChange={(e) => setMotivo(e.target.value)}>
              <option value={1}>Factura mal emitida</option>
              <option value={2}>Datos Erróneos</option>
              <option value={3}>Nota de Crédito-Débito mal emitida</option>
              <option value={4}>
                Factura o nota de Crédito-Débito devuelta
              </option>
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modalFooter">
          <Button
            variant="warning"
            onClick={() => cancelInvoice(selectedInvoice)}
          >
            Anular
          </Button>
          <Button variant="danger" onClick={() => setIsCanceled(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="formLabel">ANULAR FACTURAS</div>
      <div>
        <Form>
          <Form.Group>
            <Form.Label>
              Filtrar por número de factura - Razón Social - Nit
            </Form.Label>
            <Form.Control
              type="text"
              value={filter}
              onChange={(e) => filterById(e.target.value)}
            />
          </Form.Group>
          <div className="formLabel"></div>
          {isSudo ? (
            <Form.Group>
              <Form.Label>Seleccionar Almacen/Agencia Movil</Form.Label>
              <Form.Select
                value={selectedSuc}
                onChange={(e) => handleSuc(e.target.value)}
              >
                <option> -Seleccione sucursal- </option>
                {sucList.map((sl, index) => {
                  return (
                    <option value={sl.nroPuntoDeVenta} key={index}>
                      {sl.idAgencia}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          ) : null}
        </Form>
      </div>
      <div className="formLabel">Facturas Agencia</div>
      <div>
        <Table>
          <thead className="tableHeader">
            <tr>
              <th>Nro Factura</th>
              <th>CUF</th>
              <th>Nit</th>
              <th>Razon Social</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((fc, index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td>{fc.nroFactura}</td>
                  <td>{formattedCuf(fc.cuf)}</td>
                  <td>{fc.nitCliente}</td>
                  <td>{fc.razonSocial}</td>
                  <td>{parseFloat(fc.importeBase).toFixed(2)}</td>
                  <td>{fc.fechaHora}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setIsCanceled(true);
                        setSelectedInvoice(fc);
                      }}
                    >
                      Anular
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <thead className="tableHeader">
            <tr>
              <td colSpan={7}></td>
            </tr>
          </thead>
        </Table>
      </div>
    </div>
  );
}
