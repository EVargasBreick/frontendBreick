import React from "react";
import { Table } from "react-bootstrap";
export default function SeasonalDiscountTable({ tableData, categorias }) {
  const singleData = categorias[0];

  return (
    <div>
      <div style={tableStyles.tableLayout}>
        <Table>
          <thead>
            <tr style={tableStyles.tableHeader}>
              <th
                colSpan={5}
              >{`Descuento estacional de productos de ${singleData.tipoProducto}`}</th>
            </tr>
            <tr style={tableStyles.tableHeader}>
              <th
                colSpan={2}
                style={tableStyles.halfColumn}
              >{`Fecha Inicio`}</th>
              <th colSpan={2} style={tableStyles.halfColumn}>{`Fecha Fin`}</th>
            </tr>
            <tr style={tableStyles.tableInfo}>
              <td colSpan={2}>{singleData.fechaInicio}</td>
              <td colSpan={2}>{singleData.fechaFin}</td>
            </tr>
            <tr style={tableStyles.tableHeader}>
              <th colSpan={1} style={tableStyles.smallColumn}>
                Categoria
              </th>
              <th colSpan={1}>Rango de precios</th>
              <th colSpan={1} style={tableStyles.smallColumn}>
                Mayoristas
              </th>
              <th colSpan={1} style={tableStyles.smallColumn}>
                Ruta
              </th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((ct, index) => {
              const rut = tableData.find(
                (td) => td.categoria == ct.categoria && td.tipoUsuario == 2
              ).descuento;
              const may = tableData.find(
                (td) => td.categoria == ct.categoria && td.tipoUsuario == 4
              ).descuento;

              return (
                <tr style={tableStyles.tableInfo} key={index}>
                  <td>{ct.categoria}</td>
                  <td>{`Desde ${ct.montoMinimo} Bs hasta ${ct.montoMaximo} Bs`}</td>
                  <td>{`${rut}%`}</td>
                  <td>{`${may}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

const tableStyles = {
  tableLayout: {
    margin: "20px",
  },
  tableHeader: {
    backgroundColor: "#5cb8b2",
    color: "white",
  },
  tableInfo: {
    backgroundColor: "white",
    color: "black",
  },
  smallColumn: {
    maxWidth: "25%",
    width: "25%",
  },
  halfColumn: {
    maxWidth: "50%",
    width: "50%",
  },
};
