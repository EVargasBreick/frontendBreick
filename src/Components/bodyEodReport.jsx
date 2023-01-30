import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { getBranches, getSalePointsAndStores } from "../services/storeServices";
import Cookies from "js-cookie";
import { dateString } from "../services/dateServices";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import { getEndOfDayReport } from "../services/reportServices";
export default function BodyEodReport() {
  const [idSucursal, setIdSucursal] = useState("");
  const [puntoDeVenta, setPuntoDeVenta] = useState();
  const [storeData, setStoreData] = useState({});
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      const PuntoDeVenta = Cookies.get("pdv");
      const suc = getBranches();
      suc.then((resp) => {
        const sucursales = resp.data[0];
        const sucur = sucursales.find(
          (sc) => sc.idAgencia == JSON.parse(UsuarioAct).idAlmacen
        );
        setIdSucursal(sucur.idImpuestos);
        setPuntoDeVenta(PuntoDeVenta);
        const storeNameList = getSalePointsAndStores(
          JSON.parse(UsuarioAct).idAlmacen
        );
        storeNameList.then((sn) => {
          const list = sn.data.data[0];
          console.log("Tercer test", list);
          const nameSetter = list.find(
            (li) => li.nroPuntoDeVenta == PuntoDeVenta
          );
          console.log("Name seter", nameSetter);
          setStoreData(nameSetter);
        });
      });
    }
  }, []);
  function generateReport() {
    console.log("Punto de venta", idSucursal);
    const report = getEndOfDayReport({
      idSucursal: idSucursal,
      idPuntoDeVenta: puntoDeVenta,
    });
    report.then((rp) => {
      const data = rp.data.data[0];
      console.log("Data", data);
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
      const totalTarjeta =
        (tarjeta ? tarjeta.totalPagado : 0) + (mixto ? mixto.totalCambio : 0);
      const totalEfectivo =
        (efectivo ? efectivo.totalPagado : 0) -
        (efectivo ? efectivo.totalCambio : 0) +
        (mixto ? mixto.totalCambio : 0) +
        ((pagadoVale ? pagadoVale.totalPagado : 0) -
          (pagadoVale ? pagadoVale.totalCambio : 0));
      console.log("Otros", otros);
      console.log("Total efectivo", totalEfectivo);
    });
  }
  return (
    <div>
      <div>
        <div className="formLabel">REPORTE CIERRE DIARIO DE VENTAS</div>
      </div>
      <div>
        {storeData.nombre ? (
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
                <td>{dateString().split(" ").shift()}</td>
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
      <div>
        <Table>
          <thead>
            <tr>
              <th></th>
            </tr>
          </thead>
        </Table>
      </div>
      <div className="formLabel">
        <Button
          variant="warning"
          className="yellowLarge"
          onClick={() => generateReport()}
        >
          Generar reporte
        </Button>
      </div>
    </div>
  );
}
