import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Table } from "react-bootstrap";
import {
  getBranches,
  getSalePointsAndStores,
  getBranchesPs,
  getMobileSalePoints,
} from "../services/storeServices";
import Cookies from "js-cookie";
import { dateString } from "../services/dateServices";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import {
  firstAndLastReport,
  getEndOfDayReport,
} from "../services/reportServices";
import ReactToPrint from "react-to-print";
import { EndOfDayComponent } from "./endOfDayComponent";
import LoadingModal from "./Modals/loadingModal";
export default function BodyEodReport() {
  const [idSucursal, setIdSucursal] = useState("");
  const [puntoDeVenta, setPuntoDeVenta] = useState();
  const [storeData, setStoreData] = useState({});
  const [isReporte, setIsReporte] = useState(false);
  const [isNota, setIsNota] = useState(false);
  const [userStore, setUserStore] = useState("");
  //totales
  const [efectivo, setEfectivo] = useState(0);
  const [tarjeta, setTarjeta] = useState(0);
  const [cheque, setCheque] = useState(0);
  const [vale, setVale] = useState(0);
  const [posterior, setPosterior] = useState(0);
  const [transfer, setTransfer] = useState(0);
  const [deposito, setDeposito] = useState(0);
  const [swift, setSwift] = useState(0);
  const [voucher, setVoucher] = useState(0);
  const [qr, setQr] = useState(0);
  const [qhantuy, setQhantuy] = useState(0);
  const [cln, setCln] = useState(0);
  const [intercambio, setIntercambio] = useState(0);
  const [firstInv, setFirstInv] = useState("");
  const [lastInv, setLastInv] = useState("");
  const [numberInv, setNumberInv] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [userName, setUserName] = useState("");
  const [userRol, setUserRol] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [parsedDate, setParsedDate] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const componentRef = useRef();
  useEffect(() => {
    setFecha(dateString().split(" ").shift());
    setHora(dateString().split(" ").pop());
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      var data;
      const rol = JSON.parse(UsuarioAct).rol;
      setUserName(JSON.parse(UsuarioAct).usuario);
      setUserRol(JSON.parse(UsuarioAct).rol);
      const pdv = Cookies.get("pdv");
      const PuntoDeVenta = pdv != undefined ? pdv : 0;
      console.log("Punto de venta", PuntoDeVenta);

      const mobilepdvdata = getMobileSalePoints(
        JSON.parse(UsuarioAct).idAlmacen
      );
      mobilepdvdata.then((res) => {
        const datos = res.data[0];
        data = datos;
        console.log("Datos del punto de venta", datos);
        if (datos != undefined) {
          setPuntoDeVenta(datos.nroPuntoDeVenta);
          setIsMobile(true);
          setIdSucursal(0);
          setUserStore(JSON.parse(UsuarioAct).idAlmacen);
          const storeNameList = getSalePointsAndStores("AL001");
          storeNameList.then((sn) => {
            console.log("Store names", sn);
            const list = sn.data;
            const nameSetter = list.find(
              (li) => li.nroPuntoDeVenta == PuntoDeVenta
            );
            console.log("Name setter", nameSetter);
            setStoreData(nameSetter);
          });
        } else {
          const idAlmacen = JSON.parse(UsuarioAct).idAlmacen;
          setUserStore(idAlmacen);
          const sucps = getBranchesPs();
          sucps.then((res) => {
            const sucur =
              rol == 4
                ? res.data.find((sc) => sc.idAgencia == "AL001")
                : res.data.find((sc) => sc.idAgencia == idAlmacen);
            console.log("SUCUR", sucur);
            setIdSucursal(sucur.idImpuestos);
            setPuntoDeVenta(PuntoDeVenta);
            const storeNameList = getSalePointsAndStores(
              rol == 4 ? "AL001" : JSON.parse(UsuarioAct).idAlmacen
            );
            storeNameList.then((sn) => {
              console.log("Store names", sn);
              const list = sn.data;
              const nameSetter = list.find(
                (li) => li.nroPuntoDeVenta == PuntoDeVenta
              );
              console.log("Name setter", nameSetter);
              setStoreData(nameSetter);
            });
          });
        }
      });
    }
  }, []);
  function generateReport() {
    setAlertSec("Generando reporte");
    setIsAlertSec(true);

    const date = new Date();
    const current = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    setSelectedDate(current);
    console.log("Current", current);
    if (selectedDate == "") {
      setSelectedDate(current);
    }

    const report = getEndOfDayReport({
      idSucursal: idSucursal,
      idPuntoDeVenta: puntoDeVenta,
      idAgencia: userStore,
      ruta: userRol == 4 ? true : false,
      fecha: selectedDate === "" ? current : selectedDate,
    });
    report.then((rp) => {
      const data = rp.data;
      console.log("data", rp.data);
      const sum = data.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.totalVoucher);
      }, 0);
      console.log("Suma vouchers", sum);
      setVoucher(sum);
      const efectivo = data.find((dt) => dt.tipoPago == 1);
      const tarjeta = data.find((dt) => dt.tipoPago == 2);
      const cheque = data.find((dt) => dt.tipoPago == 3);
      const pagadoVale = data.find((dt) => dt.tipoPago == 4);
      const posterior = data.find((dt) => dt.tipoPago == 6);
      const transfer = data.find((dt) => dt.tipoPago == 7);
      const deposito = data.find((dt) => dt.tipoPago == 8);
      const swift = data.find((dt) => dt.tipoPago == 9);
      const mixto = data.find((dt) => dt.tipoPago == 10);
      const otros = data.filter((dt) => dt.tipoPago == 5);
      console.log("Otros", otros);
      const gf = pagadoVale ? pagadoVale.totalVale : 0;
      setVale(gf);
      if (otros.length > 0) {
        const qrTot = otros.find((ot) => ot.idOtroPago == 1);
        const qhantuyTot = otros.find((ot) => ot.idOtroPago == 2);
        const clnTot = otros.find((ot) => ot.idOtroPago == 3);
        const intTot = otros.find((ot) => ot.idOtroPago == 4);
        qrTot
          ? setQr(
              parseFloat(
                qrTot.totalPagado -
                  qrTot.totalCambio -
                  parseFloat(qrTot.totalVoucher)
              )
            )
          : setQr(0);
        qhantuyTot
          ? setQhantuy(
              parseFloat(qhantuyTot.totalPagado) -
                parseFloat(qhantuyTot.totalCambio) -
                parseFloat(qhantuyTot.totalVoucher)
            )
          : setQhantuy(0);
        clnTot
          ? setCln(
              parseFloat(clnTot.totalPagado) -
                parseFloat(clnTot.totalCambio) -
                parseFloat(clnTot.totalVoucher)
            )
          : setCln(0);
        intTot
          ? setIntercambio(
              parseFloat(intTot.totalPagado) -
                parseFloat(intTot.totalCambio) -
                parseFloat(intTot.totalVoucher)
            )
          : setIntercambio(0);
      }
      const totalTarjeta =
        (tarjeta
          ? tarjeta.totalPagado -
            tarjeta.totalCambio -
            parseFloat(tarjeta.totalVoucher)
          : 0) + (mixto ? Math.abs(mixto.totalCambio) : 0);
      setTarjeta(totalTarjeta);
      const totalEfectivo =
        (efectivo ? efectivo.totalPagado : 0) -
        (efectivo ? efectivo.totalVoucher : 0) -
        (efectivo ? efectivo.totalCambio : 0) +
        (mixto ? mixto.totalPagado : 0) +
        ((pagadoVale ? pagadoVale.totalPagado : 0) -
          (pagadoVale ? pagadoVale.totalCambio : 0) -
          (pagadoVale ? pagadoVale.totalVoucher : 0));
      setEfectivo(totalEfectivo);
      cheque
        ? setCheque(cheque.totalPagado - parseFloat(cheque.totalVoucher))
        : setCheque(0);
      posterior
        ? setPosterior(
            posterior.totalPagado - parseFloat(posterior.totalVoucher)
          )
        : setPosterior(0);
      transfer
        ? setTransfer(transfer.totalPagado - parseFloat(transfer.totalVoucher))
        : setTransfer(0);
      deposito
        ? setDeposito(deposito.totalPagado - parseFloat(deposito.totalVoucher))
        : setDeposito(0);
      swift
        ? setSwift(swift.totalPagado - parseFloat(swift.totalVoucher))
        : setSwift(0);

      const details = firstAndLastReport({
        idSucursal: idSucursal,
        idPuntoDeVenta: puntoDeVenta,
        idAgencia: userStore,
        ruta: userRol == 4 ? true : false,
        fecha: selectedDate === "" ? current : selectedDate,
      });
      details.then((dt) => {
        const det = dt.data[0];
        setSelectedDate("");
        setNumberInv(det.CantidadFacturas);
        setFirstInv(det.PrimeraFactura);
        setLastInv(det.UltimaFactura);
        setIsReporte(true);
        setIsNota(true);
        setIsAlertSec(false);
      });
    });
  }

  function handleDate(value) {
    const parsed = value.split("-");

    setParsedDate(parsed[2] + "/" + parsed[1] + "/" + parsed[0]);
    setNumberInv("");
    setFirstInv("");
    setLastInv("");
    setIsReporte(false);
    setIsNota(false);
    setEfectivo(0);
    setTarjeta(0);
    setCheque(0);
    setDeposito(0);
    setCln(0);
    setQhantuy(0);
    setVale(0);
    setPosterior(0);
    setTransfer(0);
    setSwift(0);
    setQr(0);
    setSelectedDate(value);
    console.log("Selected date", value);
  }

  return (
    <div>
      <div>
        <div className="formLabel">REPORTE CIERRE DIARIO DE VENTAS</div>
      </div>
      <LoadingModal isAlertSec={isAlertSec} alertSec={alertSec} />
      <div>
        {storeData?.nombre ? (
          <Table>
            <thead>
              <tr className="tableHeader">
                <th>Agencia</th>
                <th>Caja</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tableRow">
                <td>{storeData?.nombre}</td>
                <td>{storeData?.nroPuntoDeVenta + 1}</td>
                <td>
                  {
                    <Form>
                      <Form.Control
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDate(e.target.value)}
                      />
                    </Form>
                  }
                </td>
              </tr>
            </tbody>
            <tfoot className="tableHeader">
              <tr>
                <th colSpan={3}></th>
              </tr>
            </tfoot>
          </Table>
        ) : (
          "Cargando"
        )}
      </div>
      {isReporte ? (
        <div className="thinTableContainer">
          <Table className="thinTable">
            <thead>
              <tr className="tableHeaderCenter">
                <th colSpan={3}>{`Detalles del ${parsedDate}`}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tableHeaderCenter">
                <th>{`Primera Factura: ${firstInv}`}</th>
                <th>{`Ultima factura: ${lastInv}`}</th>
                <th>{`Cant Facturas: ${numberInv}`}</th>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Efectivo
                </th>
                <td>{efectivo.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Tarjeta
                </th>
                <td>{tarjeta.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Qr
                </th>
                <td>{qr.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Transferencia
                </th>
                <td>{transfer.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Qhantuy
                </th>
                <td>{qhantuy.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Consume lo Nuestro
                </th>
                <td>{cln.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Intercambio de servicios
                </th>
                <td>{intercambio.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Vales
                </th>
                <td>{vale.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Pago Posterior
                </th>
                <td>{posterior.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Cheque
                </th>
                <td>{cheque.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Deposito
                </th>
                <td>{deposito.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Transf. Swift
                </th>
                <td>{swift.toFixed(2)} Bs</td>
              </tr>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Voucher
                </th>
                <td>{voucher.toFixed(2)} Bs</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="tableRow">
                <th className="headerCol" colSpan={2}>
                  Total
                </th>
                <td>
                  {(
                    parseFloat(efectivo.toFixed(2)) +
                    parseFloat(tarjeta.toFixed(2)) +
                    parseFloat(qr.toFixed(2)) +
                    parseFloat(transfer.toFixed(2)) +
                    parseFloat(qhantuy.toFixed(2)) +
                    parseFloat(cln.toFixed(2)) +
                    parseFloat(vale.toFixed(2)) +
                    parseFloat(posterior.toFixed(2)) +
                    parseFloat(cheque.toFixed(2)) +
                    parseFloat(deposito.toFixed(2)) +
                    parseFloat(swift.toFixed(2)) +
                    parseFloat(intercambio.toFixed(2)) +
                    parseFloat(voucher.toFixed(2))
                  ).toFixed(2)}
                  {` Bs`}
                </td>
              </tr>
            </tfoot>
          </Table>

          {isNota ? (
            <div className="wrappedButton">
              <ReactToPrint
                trigger={() => <Button variant="success">Imprimir Nota</Button>}
                content={() => componentRef.current}
              />
              <Button hidden>
                <EndOfDayComponent
                  ref={componentRef}
                  branchInfo={{
                    nombre: storeData.nombre,
                    puntoDeVenta: storeData.nroPuntoDeVenta + 1,
                  }}
                  data={{
                    primeraFactura: firstInv,
                    ultimaFactura: lastInv,
                    cantFacturas: numberInv,
                    fecha: parsedDate,
                    hora: hora,
                  }}
                  totales={{
                    efectivo: efectivo.toFixed(2),
                    tarjeta: tarjeta.toFixed(2),
                    qr: qr.toFixed(2),
                    transferencia: transfer.toFixed(2),
                    qhantuy: qhantuy.toFixed(2),
                    cln: cln.toFixed(2),
                    vales: vale.toFixed(2),
                    posterior: posterior.toFixed(2),
                    deposito: deposito.toFixed(2),
                    swift: swift.toFixed(2),
                    cheque: cheque.toFixed(2),
                    intercambio: intercambio.toFixed(2),
                    voucher: voucher.toFixed(2),
                    total: (
                      parseFloat(efectivo.toFixed(2)) +
                      parseFloat(tarjeta.toFixed(2)) +
                      parseFloat(qr.toFixed(2)) +
                      parseFloat(transfer.toFixed(2)) +
                      parseFloat(qhantuy.toFixed(2)) +
                      parseFloat(cln.toFixed(2)) +
                      parseFloat(vale.toFixed(2)) +
                      parseFloat(posterior.toFixed(2)) +
                      parseFloat(cheque.toFixed(2)) +
                      parseFloat(deposito.toFixed(2)) +
                      parseFloat(swift.toFixed(2)) +
                      parseFloat(intercambio.toFixed(2)) +
                      parseFloat(voucher.toFixed(2))
                    ).toFixed(2),
                  }}
                  usuario={userName}
                />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      {storeData.nombre ? (
        <div className="formLabel">
          <Button
            variant="warning"
            className="yellowLarge"
            onClick={() => generateReport()}
          >
            Generar reporte
          </Button>
        </div>
      ) : null}
    </div>
  );
}
