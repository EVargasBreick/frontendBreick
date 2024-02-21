import React from "react";
import "../styles/invoiceStyles.css";
export const EndOfDayComponent = React.forwardRef(
  ({ branchInfo, data, totales, usuario, anuladas, totalAnuladas }, ref) => {
    console.log("Anuladas", anuladas);
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
                <td className="totals">Intercambio de servicios</td>
                <td className="totalsData">{`${totales.intercambio} Bs`}</td>
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
              <tr>
                <td className="totals">-----------</td>
                <td className="totalsData">----------</td>
              </tr>
              <tr>
                <td className="totals">Voucher</td>
                <td className="totalsData">{`${totales.voucher} Bs`}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="totals">-----------</td>
                <td className="totalsData">----------</td>
              </tr>
              <tr>
                <td className="totals">Total</td>
                <td className="totalsData">{`${totales.total} Bs`}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          {anuladas.anuladas.length > 0 && (
            <table className="tablaTotales">
              <thead>
                <tr>
                  <td colSpan={2}>Facturas anuladas</td>
                </tr>
                <tr>
                  <td className="totals">Nro Factura</td>
                  <td className="totalsData">Importe</td>
                </tr>
              </thead>
              <tbody>
                {anuladas.anuladas.map((an, index) => {
                  return (
                    <tr key={index}>
                      <td className="totals">{an.nroFactura}</td>
                      <td
                        className="totalsData"
                        style={{ textAlign: "right" }}
                      >{`${an.importeBase?.toFixed(2)} Bs.`}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="totals">{`Total Anulaciones:  `}</td>
                  <td className="totalsData">{`${anuladas.totalAnuladas} Bs.`}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
        <div className="simpleSeparator"></div>
        <div className="simpleSeparator"></div>
        <div style={{ marginBottom: "20px" }}>{`Usuario: ${usuario}`}</div>
        <div className="textWithLine"></div>
        <div className="simpleSeparator"></div>
        <div className="textWithLine"></div>
      </div>
    );
  }
);
