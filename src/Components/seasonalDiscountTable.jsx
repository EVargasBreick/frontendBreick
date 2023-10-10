import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";

export default function SeasonalDiscountTable({ seasonal, sinDesc, totales }) {
  const [isMobile, setIsMobile] = useState(false);
  //console.log("Totales", totales);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize(); // set the initial state on mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Table className="modalBodyAlt">
      <thead className="tableModalHeader">
        <tr>
          <th></th>
          <th>Total</th>
          <th>{isMobile ? `Des cuento %` : `Descuento %`}</th>
          <th>{isMobile ? `Desc Calculado` : `Descuento Calculado`}</th>
          <th>{isMobile ? `Facturar` : `Total Facturar`}</th>
        </tr>
      </thead>
      <tbody className="modalTable">
        <tr>
          {seasonal?.length > 0 || sinDesc?.length > 0 ? (
            <td>Productos de temporada</td>
          ) : null}
          {seasonal?.length > 0 || sinDesc?.length > 0 ? (
            <td>{parseFloat(totales?.totalPedido).toFixed(2) + " Bs."}</td>
          ) : null}
          {seasonal?.length > 0 || sinDesc?.length > 0 ? (
            <td>{`${
              seasonal.length > 0 ? parseFloat(totales.descuento).toFixed(0) : 0
            } %`}</td>
          ) : null}
          {seasonal?.length > 0 || sinDesc?.length > 0 ? (
            <td>{parseFloat(totales.descCalculado).toFixed(2) + " Bs."}</td>
          ) : null}
          {seasonal?.length > 0 || sinDesc?.length > 0 ? (
            <td>{parseFloat(totales.totalFacturar).toFixed(2) + " Bs."}</td>
          ) : null}
        </tr>
      </tbody>
      <tfoot className="tableModalHeader">
        <tr>
          <th>Totales</th>
          <td>
            {`${totales.totalPedido.toFixed(2)}
               Bs.`}
          </td>
          <td>{`-`}</td>
          <td>{totales.descCalculado.toFixed(2) + " Bs."}</td>
          <td>{`${totales.totalFacturar.toFixed(2)} Bs.`}</td>
        </tr>
      </tfoot>
    </Table>
  );
}
