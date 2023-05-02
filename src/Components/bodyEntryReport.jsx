import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { entryReport } from "../services/reportServices";

export default function BodyEntryReport() {
  const [entryList, setEntryList] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState({});
  useEffect(() => {
    const data = entryReport();
    data.then((response) => {
      console.log("Data", response);
      const unique = response.data.reduce((acc, curr) => {
        if (!acc.find((obj) => obj.idIngreso === curr.idIngreso)) {
          acc.push(curr);
        }
        return acc;
      }, []);
      setEntryList(unique);
    });
  }, []);
  return (
    <div>
      <div>
        <div className="formLabel">REPORTE DE INGRESOS</div>
        <Table className="tableScroll">
          <thead>
            <tr className="tableHeaderReport">
              <th>Id Ingreso</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {entryList.map((li, index) => {
              return (
                <tr key={index} className="tableBodyReport">
                  <td>{li.idIngreso}</td>
                  <td>{li.usuario}</td>
                  <td>{li.fechaCrea}</td>
                  <td>
                    <Button variant="warning">Ver</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {selectedEntry.length > 2 ? (
          <Table>
            <thead>
              <tr>
                <th>Usuario</th>
                <td></td>
              </tr>
              <th>Fecha y Hora</th>
              <td></td>
            </thead>
          </Table>
        ) : null}
      </div>
    </div>
  );
}
