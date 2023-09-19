import React, { useEffect, useState } from "react";
import "../styles/formLayouts.css";
import { Button, Form, Table } from "react-bootstrap";
import { getStores } from "../services/storeServices";
import { reportService } from "../services/reportServices";
import { Loader } from "./loader/Loader";
import { generateExcel } from "../services/utils";
import { userBasic } from "../services/userServices";

export default function BodyGroupedProductReport() {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));
  const [idAgencia, setIdAgencia] = useState("");
  const [almacen, setAlmacen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [axuReports, setAuxReports] = useState([]);
  const [filtered, setFiltered] = useState("");
  const [checkedList, setCheckedList] = useState([]);
  const [evChecked, setEvChecked] = useState(true);
  useEffect(() => {
    const stores = getStores();
    stores.then((store) => {
      setAlmacen(store.data);
    });
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      const checked = [];
      for (const prod of reports) {
        const obj = {
          idProducto: prod.idProducto,
          checked: true,
        };
        checked.push(obj);
      }
      setCheckedList(checked);
      console.log("Checked", checked);
    }
  }, [reports]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = await reportService.getGroupedProductReport(
      idAgencia,
      dateStart,
      dateEnd
    );
    setReports(data);
    setAuxReports(data);

    setLoading(false);
  }

  function verifyDates(e) {
    e.preventDefault();
    if (!(dateStart == "" || dateEnd == "")) {
      handleSubmit(e);
    }
  }

  const rows = reports.map((report, index) => (
    <tr key={index} className="tableRow">
      <td className="tableColumnSmall">{report.codInterno}</td>
      <td className="tableColumnSmall">{report.nombreProducto}</td>
      <td className="tableColumnSmall">{report.sumaTotal}</td>
      <td className="tableColumnSmall">
        {
          <Form.Check
            checked={
              checkedList.find((cl) => cl.idProducto == report.idProducto)
                ?.checked
            }
            onChange={() => checkProduct(report.idProducto)}
          />
        }
      </td>
    </tr>
  ));

  function filterProducts(value) {
    setFiltered(value);
    const filtered = axuReports.filter((ar) =>
      ar.nombreProducto.toLowerCase().includes(value.toLowerCase())
    );
    if (filtered.length > 0) {
      setReports(filtered);
    }
  }

  function allChecked() {
    const list = [];
    for (const entry of checkedList) {
      const obj = {
        idProducto: entry.idProducto,
        checked: evChecked ? false : true,
      };
      list.push(obj);
    }
    setCheckedList(list);
    setEvChecked(!evChecked);
  }

  function checkProduct(id) {
    const updatedArray = checkedList.map((obj) => {
      if (obj.idProducto == id) {
        return {
          ...obj,
          checked: !obj.checked,
        };
      }
      return obj;
    });
    setCheckedList(updatedArray);
  }

  function filterToExport() {
    const toExport = [];
    for (const product of reports) {
      if (
        checkedList.find((cl) => cl.idProducto == product.idProducto).checked
      ) {
        toExport.push(product);
      }
    }
    generateExcel(
      toExport,
      `Reporte Agrupado de Productos ${idAgencia} ${dateStart} - ${dateEnd}`
    );
  }

  return (
    <section>
      <p className="formLabel">REPORTE AGRUPADO DE PRODUCTOS EN PEDIDOS</p>
      <Form
        className="d-flex justify-content-center p-3 flex-column gap-3"
        onSubmit={verifyDates}
      >
        <Form.Group controlId="formSelectAgencias">
          <Form.Label>Agencia:</Form.Label>
          <Form.Control
            className="reportOptionDrop"
            as="select"
            defaultValue="Seleccione una agencia"
            onChange={(e) => setIdAgencia(e.target.value)}
          >
            <option>Seleccione una agencia</option>
            {almacen.map((agencia) => {
              return (
                <option value={agencia.idAgencia} key={agencia.idAgencia}>
                  {agencia.Nombre}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>

        <Form.Label>Seleccione rango de fechas</Form.Label>
        <div className="d-xl-flex justify-content-center gap-3">
          <Form.Group className="flex-grow-1" controlId="dateField1">
            <Form.Label>Fecha Inicio:</Form.Label>
            <Form.Control
              type="date"
              placeholder="1818915"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="flex-grow-1" controlId="dateField2">
            <Form.Label>Fecha Fin:</Form.Label>
            <Form.Control
              type="date"
              placeholder="1818915"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </Form.Group>
        </div>
        {dateStart != "" && dateEnd != "" ? (
          <Button className="reportButton " variant="success" type="submit">
            Generar Reporte
          </Button>
        ) : (
          <p className="formLabel">Seleccione rango de fechas</p>
        )}
      </Form>
      <div style={{ margin: "20px" }}>
        {reports.length > 0 && (
          <Form style={{ display: "flex", justifyContent: "center" }}>
            <Form.Control
              type="text"
              placeholder="Filtrar por producto"
              style={{ width: "50%" }}
              onChange={(e) => filterProducts(e.target.value)}
              value={filtered}
            />
          </Form>
        )}
      </div>
      {reports.length > 0 && (
        <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
          <Table striped bordered>
            <thead>
              <tr className="tableHeader">
                <th className="tableColumn">Codigo Interno</th>
                <th className="tableColumn">Nombre del Producto</th>
                <th className="tableColumn">Total Salidas</th>
                <th className="tableColumnSmall">
                  Selecionar
                  <div style={{ display: "flex" }}>
                    {`Todo `}
                    {
                      <Form.Check
                        style={{ marginLeft: "10px" }}
                        checked={evChecked}
                        onChange={() => allChecked()}
                      />
                    }
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      )}
      <div style={{ margin: "20px" }}>
        {reports.length > 0 && (
          <Button
            variant="success"
            onClick={() => {
              filterToExport();
            }}
          >
            Exportar a excel
          </Button>
        )}
      </div>
      {loading && <Loader />}
    </section>
  );
}
