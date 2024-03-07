import React from "react";
import "../styles/invoiceStyles.css";
import { dateString } from "../services/dateServices";
export const KardexReportThermal = React.forwardRef(
  ({ agencia, productList }, ref) => {
    return (
      <div ref={ref} className="invoicePage">
        <div style={{ pageBreakAfter: "always" }}>
          <div className="invoiceTittle">Incadex S.R.L</div>
          <div>{`${agencia}`}</div>
          <div className="simpleSeparator"></div>
          <div>{`${dateString()}`}</div>
          <div className="textWithLine"></div>
          <div>
            <table>
              <thead>
                <tr>
                  <td className="xsmallProductLeft">Cod</td>
                  <td className="largeProduct">Producto</td>
                  <td className="smallProductLeft">Cantidad</td>
                </tr>
              </thead>
              <tbody>
                {productList.map((producto, index) => {
                  return (
                    <tr key={index}>
                      <td className="smallProductLeft">
                        {`${producto?.codInterno}`}
                      </td>
                      <td className="smallProductLeft">
                        {`${producto?.nombreProducto}`}
                      </td>
                      <td className="smallProductLeft">
                        {`${producto?.cantidad?.toFixed(0)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div>{`Compartir es delicioso`}</div>
          <div className="simpleSeparator"></div>
        </div>
      </div>
    );
  }
);
