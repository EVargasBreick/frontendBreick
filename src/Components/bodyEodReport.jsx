import React, { useEffect, useState, useRef } from "react";
import { Button, Table } from "react-bootstrap";
import {
  getBranches,
  getSalePointsAndStores,
  getBranchesPs,
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
  const [qr, setQr] = useState(0);
  const [qhantuy, setQhantuy] = useState(0);
  const [cln, setCln] = useState(0);
  const [firstInv, setFirstInv] = useState("");
  const [lastInv, setLastInv] = useState("");
  const [numberInv, setNumberInv] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [userName, setUserName] = useState("");
  const [userRol, setUserRol] = useState("");
  const componentRef = useRef();
  useEffect(() => {
    setFecha(dateString().split(" ").shift());
    setHora(dateString().split(" ").pop());
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      const rol = JSON.parse(UsuarioAct).rol;
      setUserName(JSON.parse(UsuarioAct).usuario);
      setUserRol(JSON.parse(UsuarioAct).rol);
      const pdv = Cookies.get("pdv");
      const PuntoDeVenta = pdv != undefined ? pdv : 0;
      console.log("Punto de venta", PuntoDeVenta);
      const sucps = getBranchesPs();
      const idAlmacen = JSON.parse(UsuarioAct).idAlmacen;

      setUserStore(idAlmacen);
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
  }, []);
  function generateReport() {
    const report = getEndOfDayReport({
      idSucursal: idSucursal,
      idPuntoDeVenta: puntoDeVenta,
      idAgencia: userStore,
      ruta: userRol == 4 ? true : false,
    });
    report.then((rp) => {
      const data = rp.data;

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
      const gf = pagadoVale ? pagadoVale.totalVale : 0;
      setVale(gf);
      if (otros.length > 0) {
        const qrTot = otros.find((ot) => (ot.idOtroPago = 1));
        const qhantuyTot = otros.find((ot) => (ot.idOtroPago = 2));
        const clnTot = otros.find((ot) => (ot.idOtroPago = 3));
        qrTot ? setQr(qrTot.totalPagado) : setQr(0);
        qhantuyTot ? setQhantuy(qhantuyTot.totalPagado) : setQhantuy(0);
        clnTot ? setCln(clnTot.totalPagado) : setCln(0);
      }
      const totalTarjeta =
        (tarjeta ? tarjeta.totalPagado : 0) + (mixto ? mixto.totalCambio : 0);
      setTarjeta(totalTarjeta);
      const totalEfectivo =
        (efectivo ? efectivo.totalPagado : 0) -
        (efectivo ? efectivo.totalCambio : 0) +
        (mixto ? mixto.totalCambio : 0) +
        ((pagadoVale ? pagadoVale.totalPagado : 0) -
          (pagadoVale ? pagadoVale.totalCambio : 0));
      setEfectivo(totalEfectivo);
      cheque ? setCheque(cheque.totalPagado) : setCheque(0);
      posterior ? setPosterior(posterior.totalPagado) : setPosterior(0);
      transfer ? setTransfer(transfer.totalPagado) : setTransfer(0);
      deposito ? setDeposito(deposito.totalPagado) : setDeposito(0);
      swift ? setSwift(swift.totalPagado) : setSwift(0);

      const details = firstAndLastReport({
        idSucursal: idSucursal,
        idPuntoDeVenta: puntoDeVenta,
        idAgencia: userStore,
        ruta: userRol == 4 ? true : false,
      });
      details.then((dt) => {
        const det = dt.data[0];

        setNumberInv(det.CantidadFacturas);
        setFirstInv(det.PrimeraFactura);
        setLastInv(det.UltimaFactura);
        setIsReporte(true);
        setIsNota(true);
      });
    });
  }
  return (
    <div>
      <div>
        <div className="formLabel">REPORTE CIERRE DIARIO DE VENTAS</div>
      </div>
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
                <td>{fecha}</td>
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
                <th colSpan={3}>Detalles</th>
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
            </tbody>
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
                    fecha: fecha,
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
