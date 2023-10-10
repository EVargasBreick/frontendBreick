import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";

export default function ComplexDiscountTable({
  tradicionales,
  pascua,
  navidad,
  halloween,
  sinDesc,
  tradObject,
  pasObject,
  navObject,
  hallObject,
}) {
  const [isMobile, setIsMobile] = useState(false);
  console.log("ENTRO ACA");
  useEffect(() => {
    console.log("Tradicionales", tradicionales);
    console.log("Sin descuento", sinDesc);
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
          {tradicionales?.length > 0 || sinDesc?.length > 0 ? (
            <td>Tradicionales</td>
          ) : null}
          {tradicionales?.length > 0 || sinDesc?.length > 0 ? (
            <td>{parseFloat(tradObject?.total).toFixed(2) + " Bs."}</td>
          ) : null}
          {tradicionales?.length > 0 || sinDesc?.length > 0 ? (
            <td>{`${
              tradicionales.length > 0
                ? parseFloat(tradObject.descuento).toFixed(0)
                : 0
            } %`}</td>
          ) : null}
          {tradicionales?.length > 0 || sinDesc?.length > 0 ? (
            <td>{parseFloat(tradObject.descCalculado).toFixed(2) + " Bs."}</td>
          ) : null}
          {tradicionales?.length > 0 || sinDesc?.length > 0 ? (
            <td>{parseFloat(tradObject.facturar).toFixed(2) + " Bs."}</td>
          ) : null}
        </tr>
        <tr>
          {pascua.length > 0 ? <td>Pascua</td> : null}
          {pascua.length > 0 ? (
            <td>{parseFloat(pasObject.total).toFixed(2) + " Bs."}</td>
          ) : null}
          {pascua.length > 0 ? (
            <td>{`${parseFloat(pasObject.descuento).toFixed(0)} %`}</td>
          ) : null}
          {pascua.length > 0 ? (
            <td>{parseFloat(pasObject.descCalculado).toFixed(2) + " Bs."}</td>
          ) : null}
          {pascua.length > 0 ? (
            <td>{parseFloat(pasObject.facturar).toFixed(2) + " Bs."}</td>
          ) : null}
        </tr>
        <tr>
          {navidad.length > 0 ? <td>Navidad</td> : null}
          {navidad.length > 0 ? (
            <td>{parseFloat(navObject.total).toFixed(2) + " Bs."}</td>
          ) : null}
          {navidad.length > 0 ? <td>{`${navObject.descuento} %`}</td> : null}
          {navidad.length > 0 ? (
            <td>{parseFloat(navObject.descCalculado).toFixed(2) + " Bs."}</td>
          ) : null}

          {navidad.length > 0 ? (
            <td>{parseFloat(navObject.facturar).toFixed(2) + " Bs."}</td>
          ) : null}
        </tr>
        <tr>
          {halloween.length > 0 ? <td>Halloween</td> : null}
          {halloween.length > 0 ? (
            <td>{parseFloat(hallObject.total).toFixed(2) + " Bs."}</td>
          ) : null}
          {halloween.length > 0 ? <td>{`${hallObject.descuento} %`}</td> : null}
          {halloween.length > 0 ? (
            <td>{parseFloat(hallObject.descCalculado).toFixed(2) + " Bs."}</td>
          ) : null}
          {halloween.length > 0 ? (
            <td>{parseFloat(hallObject.facturar).toFixed(2) + " Bs."}</td>
          ) : null}
        </tr>
      </tbody>
      <tfoot className="tableModalHeader">
        <tr>
          <th>Totales</th>
          <td>
            {`${(
              parseFloat(tradObject.total) +
              parseFloat(pasObject.total) +
              parseFloat(navObject.total) +
              parseFloat(hallObject.total)
            ).toFixed(2)}
               Bs.`}
          </td>
          <td>{`-`}</td>
          <td>
            {(
              parseFloat(pasObject.descCalculado) +
              parseFloat(tradObject.descCalculado) +
              parseFloat(navObject.descCalculado) +
              parseFloat(hallObject.descCalculado)
            ).toFixed(2) + " Bs."}
          </td>
          <td>
            {`${(
              parseFloat(tradObject.facturar) +
              parseFloat(pasObject.facturar) +
              parseFloat(navObject.facturar) +
              parseFloat(hallObject.facturar)
            ).toFixed(2)} Bs.`}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}
