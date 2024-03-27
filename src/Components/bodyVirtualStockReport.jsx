import React, { useState, useEffect } from "react";
import { getClientConsigancion } from "../services/clientServices";
import { virtualStockReport } from "../services/reportServices";
import { Form, Table, Button, Image } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import { generateExcel } from "../services/utils";
export default function BodyVirtualStockReport() {
  const [nitCliente, setNitCliente] = useState("");
  const [idZona, setIdZona] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [search, setSearch] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");

  const [reportData, setReportData] = useState([]);
  useEffect(() => {
    if (nitCliente != "" && idZona != "") {
      fetchStock();
    }
  }, [nitCliente, idZona]);

  async function fetchStock() {
    const data = await virtualStockReport(nitCliente, idZona);
    console.log("Datos generales", data);
    setReportData(data.data);
  }

  function searchClient() {
    setClientes([]);
    setisLoading(true);
    const found = getClientConsigancion(search);
    found.then(async (res) => {
      console.log("Data", res.data);
      setIsClient(true);
      if (res.data.length > 0) {
        if (res.data.length == 1) {
          setClientes(res.data);
          const { data } = await virtualStockReport(
            res.data[0].nit,
            res.data[0].idZona
          );
          console.log("Data de stock", data);
        } else {
          setClientes(res.data);
        }
        setisLoading(false);
      } else {
        setIsClient(false);
        //setWillCreate(true);
        setIsAlert(true);
        setAlert("Cliente no encontrado");
      }
    });
  }
  async function filterSelectedClient(id) {
    setIsSelected(true);
    const searchObject = clientes.find((cli) => cli.idCliente === id);
    console.log("TCL: filterSelectedClient -> searchObject", searchObject);
    const array = [];
    array.push(searchObject);
    console.log("Array", array);
    setClientes(array);
    setNitCliente(array[0].nit);
    setIdZona(array[0].idZona);
  }

  return (
    <div>
      <div className="formLabel">REPORTE DE STOCKS EN CONSIGNACIÓN</div>
      <div>
        <Form
          className="d-flex"
          onSubmit={(e) => {
            e.preventDefault();
            searchClient();
          }}
        >
          <Form.Control
            type="search"
            placeholder="Ingrese Nit"
            className="me-2"
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="warning"
            className="search"
            onClick={(e) => searchClient(e)}
          >
            {isLoading ? (
              <Image src={loading2} style={{ width: "5%" }} />
            ) : search.length < 1 ? (
              "Buscar"
            ) : (
              "Buscar"
            )}
          </Button>
        </Form>
      </div>
      {isClient ? (
        <div className="tableOne">
          <Table>
            <thead>
              <tr className="tableHeader">
                <th className="tableColumnSmall"></th>
                <th className="tableColumn">Nit</th>
                <th className="tableColumn">Razon Social</th>
                <th className="tableColumn">Zona</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((client, index) => {
                return (
                  <tr key={index} className="tableRow">
                    <td className="tableColumnSmall">
                      <div>
                        <Button
                          variant="warning"
                          className="tableButtonAlt"
                          disabled={isSelected}
                          onClick={() => {
                            filterSelectedClient(client.idCliente);
                          }}
                        >
                          {isSelected ? "Seleccionado" : "Seleccionar"}
                        </Button>
                      </div>
                    </td>
                    <td className="tableColumn">{client.nit}</td>
                    <td className="tableColumn">{client.razonSocial}</td>
                    <td className="tableColumn">{client.zona}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      {reportData.length > 0 ? (
        <Table>
          <thead>
            <tr className="tableHeader">
              <th className="tableColumn" colSpan={3}>
                Regional Depto
              </th>
            </tr>
            <tr className="tableRow">
              <th colSpan={3}>{reportData[0].departamento}</th>
            </tr>
            <tr className="tableHeader">
              <th className="tableColumn">Cod Interno</th>
              <th className="tableColumn">Producto</th>
              <th className="tableColumn">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((rd, index) => {
              return (
                <tr key={index} className="tableRow">
                  <td className="tableColumn">{rd.codInterno}</td>
                  <td className="tableColumn">{rd.nombreProducto}</td>
                  <td className="tableColumn">{rd.cant_Actual}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : null}
      {reportData.length > 0 && (
        <Button
          variant="success"
          onClick={() => {
            generateExcel(
              reportData,
              `Reporte de Stock en consignacion ${nitCliente} - ${reportData[0].departamento}`
            );
          }}
        >
          Exportar a excel
        </Button>
      )}
    </div>
  );
}
