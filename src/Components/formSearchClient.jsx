import React from "react";
import { useEffect, useState } from "react";
import { Form, Button, Table, Image } from "react-bootstrap";
import { getClient } from "../services/clientServices";
import { getDias, getZonas, getZoneById } from "../services/miscServices";
import loading2 from "../assets/loading2.gif";
import "../styles/formLayouts.css";
import "../styles/generalStyle.css";
import { useNavigate } from "react-router-dom";
export default function FormSearchClient() {
  const [isLoading, setisLoading] = useState(false);
  const [gZonas, setgZonas] = useState([]);
  const [arraryDias, setArrayDias] = useState([]);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [sortedClients, setSortedClients] = useState([]);
  const [isSorted, setIsSorted] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const zon = getZonas();
    zon.then((z) => {
      setgZonas(z.data[0]);
    });
    const dia = getDias();
    dia.then((d) => {
      setArrayDias(d.data[0]);
    });
  }, []);
  function searchClient() {
    setisLoading(true);
    const found = getClient(search);
    found
      .then((res) => {
        console.log("Cliente(s) encontrados:", res.data.data);
        setClientes(res.data.data[0]);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div>
      <div className="formLabel">LISTADO DE CLIENTES</div>
      <div>
        <Form className="d-flex">
          <Form.Control
            value={search}
            type="search"
            placeholder="Buscar por Razon Social o Nit"
            className="me-2"
            aria-label="Search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button
            onClick={() => searchClient()}
            variant="warning"
            className="search"
          >
            {isLoading ? (
              <Image src={loading2} style={{ width: "5%" }} />
            ) : search.length < 1 ? (
              "Buscar todos"
            ) : (
              "Buscar"
            )}
          </Button>
        </Form>
      </div>
      <div className="tableOne">
        <Table>
          <thead>
            <tr className="tableHeader">
              <th className="tableColumn">NIT</th>
              <th className="tableColumn">Razon Social</th>
              <th className="tableColumn">Zona</th>
              <th className="tableColumn">Frecuencia</th>
              <th className="tableColumn">Tipo de Precio</th>
              <th className="tableColumnSmall"></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((client) => {
              return (
                <tr className="tableRow" key={client.idCliente}>
                  <td>{client.nit}</td>
                  <td>{client.razonSocial}</td>
                  <td>{client.zona}</td>
                  <td>{client.dias}</td>
                  <td>{client.tipoPrecio}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="cyan"
                      onClick={() => {
                        navigate("/editarCliente", {
                          state: {
                            id: client.idCliente,
                          },
                        });
                      }}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
