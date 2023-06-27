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
  const [estado, setEstado] = useState("");
  const [userList, setUserList] = useState([]);
  const [almacen, setAlmacen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [tipo, setTipo] = useState("");
  const [facturado, setFacturado] = useState("");
  const [notas, setNotas] = useState("");
  useEffect(() => {
    const stores = getStores();
    stores.then((store) => {
      setAlmacen(store.data);
    });
    const users = userBasic();
    users.then((user) => {
      console.log("Ususarios", user);
      setUserList(user.data);
    });
  }, []);

  useEffect(() => {
    if (
      ((dateStart && dateEnd) ||
        estado ||
        selectedUser ||
        tipo ||
        facturado ||
        notas) &&
      idAgencia
    ) {
      setLoading(true);
      const data = reportService.getProductOrderReport(
        idAgencia,
        dateStart,
        dateEnd,
        estado,
        selectedUser,
        tipo,
        facturado
      );
      data.then((data) => {
        setReports(data);
        setLoading(false);
      });
    }
  }, [dateStart, dateEnd, estado, selectedUser, tipo, facturado]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = await reportService.getProductOrderReport(
      idAgencia,
      dateStart,
      dateEnd,
      estado,
      selectedUser,
      tipo,
      facturado,
      notas
    );
    setReports(data);
    setLoading(false);
  }

  const rows = reports.map((report, index) => (
    <tr key={index} className="tableRow">
      <td className="tableColumnSmall">{report.idProducto}</td>
      <td className="tableColumnSmall">{report.codInterno}</td>
      <td className="tableColumnSmall">{report.nombreProducto}</td>
      <td className="tableColumnSmall">{report.sumaTotal}</td>
    </tr>
  ));

  return (
    <section>
      <p className="formLabel">REPORTE AGRUPADO DE PRODUCTOS EN PEDIDOS</p>
      <Form
        className="d-flex justify-content-center p-3 flex-column gap-3"
        onSubmit={handleSubmit}
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
        <p className="formLabel">FILTROS- NO OBLIGATORIOS</p>

        <Form.Group>
          <Form.Label>Filtrar por estado</Form.Label>
          <Form.Select
            placeholder="Estado del pedido"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value={""}>Todos</option>
            <option value={0}>Pendientes</option>
            <option value={1}>Aprobados</option>
            <option value={2}>Cancelados</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Filtrar usuario</Form.Label>
          <Form.Select
            placeholder="Estado del pedido"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value={""}>Todos</option>
            {userList.map((user, index) => {
              return (
                <option value={user.usuario} key={index}>
                  {user.nombre}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Filtrar por tipo</Form.Label>
          <Form.Select
            placeholder="Estado del pedido"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value={""}>Todos</option>
            <option value={"normal"}>Normales</option>
            <option value={"muestra"}>Muestras</option>
            <option value={"consignacion"}>consignaciones</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Filtrar por estado de facturación</Form.Label>
          <Form.Select
            placeholder="Estado del pedido"
            value={facturado}
            onChange={(e) => setFacturado(e.target.value)}
          >
            <option value={""}>Todos</option>
            <option value={0}>Facturados</option>
            <option value={1}>No Facturados</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Filtrar por palabras clave en notas</Form.Label>
          <Form.Control
            placeholder="Notas del pedido"
            value={notas}
            type="text"
            onChange={(e) => setNotas(e.target.value)}
          />
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

        <Button className="reportButton " variant="success" type="submit">
          Generar Reporte
        </Button>
      </Form>

      {reports.length > 0 && (
        <Button
          variant="success"
          onClick={() => {
            generateExcel(
              reports,
              `Reporte de Bajas ${dateStart} - ${dateEnd}`
            );
          }}
        >
          Exportar a excel
        </Button>
      )}

      <div className="d-flex justify-content-center">
        <div className="tableOne">
          <Table striped bordered responsive>
            <thead>
              <tr className="tableHeader">
                <th className="tableColumn">Id Producto</th>
                <th className="tableColumn">Codigo Interno</th>
                <th className="tableColumn">Nombre del Producto</th>
                <th className="tableColumn">Total Salidas</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </div>
      {loading && <Loader />}
    </section>
  );
}
