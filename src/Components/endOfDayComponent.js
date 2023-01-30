import React from "react";
import "../styles/invoiceStyles.css";
export const EndOfDayComponent = React.forwardRef(
  ({ branchInfo, data, totales, usuario }, ref) => {
    return (
      <div ref={ref} className="invoicePage">
        <div className="invoiceTittle">Incadex S.R.L</div>
        <div>{`${branchInfo?.nombre}`}</div>
        <div className="simpleSeparator"></div>
        <div> {`Caja No ${branchInfo?.puntoDeVenta}`}</div>
        <div className="simpleSeparator"></div>
        <div>REPORTE CIERRE DE VENTAS</div>
        <div className="simpleSeparator"></div>
        <div>{`FECHA ${data.fecha}`}</div>
        <div>{`HORA ${data.hora}`}</div>
        <div className="simpleSeparator"></div>
        <div>{`Primera factura ${data.primeraFactura}`}</div>
        <div>{`Última factura ${data.ultimaFactura}`}</div>
        <div>{`Cantidad facturas ${data.cantFacturas}`}</div>
        <div className="simpleSeparator"></div>
        <div>TOTALES</div>
        <div className="textWithLine"></div>
        <div>
          <table className="tablaTotales">
            <tbody>
              <tr>
                <td className="totals">Efectivo</td>
                <td className="totalsData">{`${totales.efectivo} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Tarjeta</td>
                <td className="totalsData">{`${totales.tarjeta} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Qr</td>
                <td className="totalsData">{`${totales.qr} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Transferencia</td>
                <td className="totalsData">{`${totales.transferencia} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Qhantuy</td>
                <td className="totalsData">{`${totales.qhantuy} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Consume lo nuestro</td>
                <td className="totalsData">{`${totales.cln} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Vales</td>
                <td className="totalsData">{`${totales.vales} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Pago Posterior</td>
                <td className="totalsData">{`${totales.posterior} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Cheque</td>
                <td className="totalsData">{`${totales.cheque} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Depósito</td>
                <td className="totalsData">{`${totales.deposito} Bs`}</td>
              </tr>
              <tr>
                <td className="totals">Transf Swift</td>
                <td className="totalsData">{`${totales.swift} Bs`}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="simpleSeparator"></div>
        <div className="simpleSeparator"></div>
        <div>{`Usuario: ${usuario}`}</div>
        <div className="textWithLine"></div>
        <div className="simpleSeparator"></div>
        <div className="textWithLine"></div>
      </div>
    );
  }
);
