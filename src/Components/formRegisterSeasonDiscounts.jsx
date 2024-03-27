import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import { dateString } from "../services/dateServices";
import {
  getSeasonalDiscount,
  getCurrentSeason,
  disableSeasonalDiscount,
} from "../services/discountEndpoints";
import SeasonalDiscountTable from "./CustomComponents/seasonalDiscountTable";
import NewSeasonalDiscountTable from "./CustomComponents/newSeasonalDiscountTable";
import LoadingModal from "./Modals/loadingModal";

export default function FormRegisterSeasonDiscounts() {
  const hollidays = [
    {
      id: 2,
      nombre: "Pascua",
    },
    {
      id: 3,
      nombre: "Navidad",
    },
    {
      id: 4,
      nombre: "Halloween",
    },
  ];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isFoundTable, setIsFoundTable] = useState(false);
  const [isRenderedTable, setIsRenderedTable] = useState(false);
  const [multIds, setMultIds] = useState([]);
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  /*useEffect(() => {
    const currentUser = JSON.parse(Cookies.get("userAuth"));
    const currentDate = dateString();
    const list = listDiscounts(currentDate, 2);
    list.then((l) => {
      console.log(l.data);
    });
    //console.log("Current user", list);
  }, []);*/

  useEffect(() => {
    if (tableData.length > 0) {
      setIsRenderedTable(true);
      setIsFoundTable(true);
    } else {
      setIsRenderedTable(false);
      setIsFoundTable(false);
    }
  }, [tableData]);

  async function listDiscounts(currentDate, tipo) {
    const discountList = await getSeasonalDiscount(currentDate, tipo);
    return discountList;
  }

  async function verifySeason(e) {
    setMultIds([]);
    setCategorias([]);
    setTableData([]);
    e.preventDefault();
    console.log("CORRIENDO");
    try {
      const verified = await getCurrentSeason(fromDate, toDate);
      if (verified.data.data.length > 0) {
        const retrievedData = verified.data.data;
        console.log("Data", retrievedData);
        const ids = await variousSeasons(retrievedData);
        setMultIds(ids);
        const mayoristas = retrievedData.filter((rd) => rd.tipoUsuario == 2);
        setCategorias(mayoristas);
        setTableData(retrievedData);
      } else {
        setIsRenderedTable(true);
      }
    } catch (error) {}
  }

  function variousSeasons(data) {
    const ids = [];
    for (const entry of data) {
      const found = ids.some((id) => id == entry.idDescEst);
      if (!found) {
        ids.push(entry.idDescEst);
      }
    }
    console.log("Ids encontrados", ids);
    return new Promise((resolve) => resolve(ids));
  }

  function disableSeasonal(id) {
    setAlert("Desactivando campaña");
    setIsAlert(true);
    const disabled = disableSeasonalDiscount(id);
    disabled
      .then((ds) => {
        setAlert("Campaña desactivada correctamente");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setAlert("error al desactivar");
        setTimeout(() => {
          setIsAlert(false);
        }, 2000);
      });
    console.log("Campaña a desactivar", id);
  }

  return (
    <div>
      <div className="formLabel">REGISTRAR DESCUENTOS DE TEMPORADA</div>
      <div>
        <LoadingModal isAlertSec={isAlert} alertSec={alert} />
        <Form onSubmit={(e) => verifySeason(e)}>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div style={{ width: "30%" }}>
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setFromDate(e.target.value)}
                value={fromDate}
              />
            </div>
            <div style={{ width: "30%" }}>
              <Form.Label>Fecha de cierre</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setToDate(e.target.value)}
                value={toDate}
              />
            </div>
          </div>
          {fromDate != "" && toDate != "" ? (
            <div>
              <Button variant="warning" onClick={(e) => verifySeason(e)}>
                Verificar
              </Button>
            </div>
          ) : null}
        </Form>
      </div>
      {isRenderedTable ? (
        <div>
          {isFoundTable ? (
            multIds.map((ml, index) => {
              const filteredTd = tableData.filter((td) => td.idDescEst == ml);
              const filteredCat = categorias.filter((ct) => ct.idDescEst == ml);

              return (
                <div key={index}>
                  <p style={{ margin: "20px 0px 0px 0px" }}>
                    Se encontró una campaña activa en ese rango de fechas
                  </p>
                  <SeasonalDiscountTable
                    tableData={filteredTd}
                    categorias={filteredCat}
                  />
                  <Button variant="success" onClick={() => disableSeasonal(ml)}>
                    {" "}
                    Desactivar campaña
                  </Button>
                </div>
              );
            })
          ) : (
            <div>
              <p style={{ margin: "20px 0px 0px 0px" }}>
                No se encontró una campaña activa en ese rango de fechas
              </p>
              <NewSeasonalDiscountTable startDate={fromDate} endDate={toDate} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

/*
 <div style={{ width: "30%" }}>
            <Form.Label>Seleccione festividad</Form.Label>
            <Form.Select>
              <option>- Seleccione una opción - </option>
              {hollidays.map((hl, index) => {
                return (
                  <option key={index} value={hl.id}>
                    {hl.nombre}
                  </option>
                );
              })}
            </Form.Select>
          </div>

*/
