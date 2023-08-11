import React, { useState, useEffect } from "react";
import { Button, Table, Badge, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/buttonsStyles.css";
import "../styles/modalStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import { transferList } from "../services/transferServices";
import { useRef } from "react";
export default function FormViewTransferAgency() {
  const [list, setList] = useState([]);
  const originalList = useRef([]);
  const user = JSON.parse(Cookies.get("userAuth"));
  useEffect(() => {
    // get user cookies
    const tList = transferList("todo");
    tList.then((tl) => {
      tl.data = tl.data.filter((t) => t.idOrigen == user.idAlmacen);
      setList(tl.data);
      originalList.current = tl.data;
    });
  }, []);

  return (
    <div>
      <div className="formLabel">VER TRASPASOS: Agencia {user?.idAlmacen} </div>
      <div className="formLabel">Filtrar por Origen o Destino:</div>
      <div className=" formLabel">
        <Form.Select
          className="formInput"
          onChange={(e) => {
            if (e.target.value == "1") {
              const data = originalList.current.filter(
                (t) => t.idOrigen == user.idAlmacen
              );
              setList(data);
            } else {
              const data = originalList.current.filter(
                (t) => t.idDestino == user.idAlmacen
              );
              setList(data);
            }
          }}
        >
          <option value="1">SALIENTES - ORIGEN</option>
          <option value="2">ENTRANTES - DESTINO</option>
        </Form.Select>
      </div>

      <div className="secondHalf">
        <Table striped>
          <thead>
            <tr className="tableHeader">
              <th className="tableColumnSmall">Codigo</th>
              <th className="tableColumn">Origen</th>
              <th className="tableColumn">Destino</th>
              <th className="tableColumn">Fecha Solicitud</th>
              <th className="tableColumnMedium">Estado</th>
              <th className="tableColumnMedium">Listo</th>
              <th className="tableColumnMedium">Recibido</th>
            </tr>
          </thead>
          <tbody>
            {list.map((tl, index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td className="tableColumnSmall">{tl.nroOrden}</td>
                  <td className="tableColumn">{tl.nombreOrigen}</td>
                  <td className="tableColumn">{tl.nombreDestino}</td>
                  <td className="tableColumn">{tl.fechaCrea}</td>
                  <th className="tableColumnMedium">
                    <Badge
                      bg={
                        tl.estado == 0 && tl.listo == 0
                          ? "warning"
                          : tl.estado === 1 || tl.listo == 1
                          ? "success"
                          : "danger"
                      }
                    >
                      {tl.estado == 0 && tl.listo == 0
                        ? "Pendiente"
                        : tl.estado == 1 || tl.listo == 1
                        ? "Aprobado"
                        : "Cancelado"}
                    </Badge>
                  </th>
                  <th className="tableColumnMedium">
                    <Badge bg={tl.listo == 0 ? "warning" : "success"}>
                      {tl.listo == 0 ? "No" : "Si"}
                    </Badge>
                  </th>
                  <th className="tableColumnMedium">
                    <Badge bg={tl.transito == 0 ? "warning" : "success"}>
                      {tl.transito == 0 ? "No" : "Si"}
                    </Badge>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
