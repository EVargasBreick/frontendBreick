import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { userService } from "../services/userServices";

import {
  monthlyGoalsReport,
  salesByDayReport,
  sellerProductReport,
} from "../services/reportServices";
import { generateExcel } from "../services/utils";
import { isLeapYear } from "../services/dateServices";
import LineChartModal from "./Modals/ChartModal";

export default function BodySalesByDay() {
  const [month, setMonth] = useState(
    new Date().getMonth() + 1 > 9
      ? (new Date().getMonth() + 1).toString()
      : "0" + (new Date().getMonth() + 1)
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [currentYear] = useState(new Date().getFullYear());
  const [userList, setUserList] = useState("");
  const [reportData, setReportData] = useState("");
  const [fullTable, setFullTable] = useState();
  const [headers, setHeaders] = useState([]);
  const [userCol, setUserCol] = useState([]);
  const [uniqueUs, setUniqueUs] = useState([]);
  const notUsers = [4, 2];
  const [yearList, setYearList] = useState([]);
  const startingYear = 2023;
  const [userChart, setUserChart] = useState("");
  const [goalChart, setGoalChart] = useState({});
  const [goalsData, setGoalsData] = useState([]);
  const dayList = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [chartData, setChartData] = useState({});

  const monthList = [
    {
      month: "Enero",
      value: "01",
      days: 31,
    },
    {
      month: "Febrero",
      value: "02",
      days: isLeapYear(year) ? 29 : 28,
    },
    {
      month: "Marzo",
      value: "03",
      days: 31,
    },
    {
      month: "Abril",
      value: "04",
      days: 30,
    },
    {
      month: "Mayo",
      value: "05",
      days: 31,
    },
    {
      month: "Junio",
      value: "06",
      days: 30,
    },
    {
      month: "Julio",
      value: "07",
      days: 31,
    },
    {
      month: "Agosto",
      value: "08",
      days: 31,
    },
    {
      month: "Septiembre",
      value: "09",
      days: 30,
    },
    {
      month: "Octubre",
      value: "10",
      days: 31,
    },
    {
      month: "Noviembre",
      value: "11",
      days: 30,
    },
    {
      month: "Diciembre",
      value: "12",
      days: 31,
    },
  ];

  useEffect(() => {
    console.log("Month", month);
    var start = startingYear;
    const yearArray = [];
    while (start <= currentYear) {
      yearArray.push(start);
      start++;
    }
    setYearList(yearArray);
    const userData = userService.getAll();
    userData
      .then((res) => {
        const filtered = res.filter((entry) => notUsers.includes(entry.rol));
        //console.log("Filtered", filtered);
        setUserList(filtered);
      })
      .catch((err) => {
        console.log("Error al cargar los usuarios", err);
      });
  }, []);

  useEffect(() => {
    if (reportData.length > 0) {
      structureData();
    }
  }, [reportData]);

  useEffect(() => {
    if (fullTable) {
      const userNames = Object.keys(fullTable);
      const dates = Object.keys(fullTable[userNames[0]]);
      setHeaders(dates);
      setUserCol(userNames);
    }
  }, [fullTable]);

  async function structureData() {
    const goalsFetched = await monthlyGoalsReport(month, year);
    setGoalsData(goalsFetched.data);
    const goalsInfo = goalsFetched.data;
    console.log("Entrando aca");
    const uniqueArray = uniqueUsers(reportData);
    setUniqueUs(uniqueArray);
    const dynamic = {};
    const goals = {};
    for (const user of userList) {
      dynamic[user.nombre + " " + user.apPaterno] = {};
      goals[user.nombre + " " + user.apPaterno] = {};
      const filtered = reportData.filter(
        (rd) => rd.idUsuario === user.idUsuario
      );
      const foundIdGoal = goalsInfo.filter(
        (gd) => gd.idUsuario == user.idUsuario
      );
      console.log("found id goal", foundIdGoal);
      for (const day of dayList) {
        const dayValue = day > 9 ? day : "0" + day;
        const foundValue = filtered.find(
          (fn) => fn.split_part == `${dayValue}/${month}/${year}`
        );
        const foundGoal = foundIdGoal
          ? foundIdGoal.find(
              (fig) => fig.fecha == `${dayValue}/${month}/${year}`
            )
          : 0;
        const goalCell = foundIdGoal ? (foundGoal ? foundGoal?.meta : 0) : 0;

        dynamic[user.nombre + " " + user.apPaterno][
          `${dayValue}/${month}/${year}`
        ] = foundValue ? parseFloat(foundValue?.round) : 0;

        goals[user.nombre + " " + user.apPaterno][
          `${dayValue}/${month}/${year}`
        ] = goalCell;
      }
    }
    console.log("Tabla dinamica goals", goals);
    setFullTable(dynamic);
    setGoalsData(goals);
  }

  function uniqueUsers() {
    const unique = [];
    reportData.forEach((rd) => {
      const existe = unique.some((un) => un.idUsuario === rd.idUsuario);
      if (!existe) {
        unique.push(rd);
      }
    });
    return unique;
  }

  async function getReport() {
    const report = await salesByDayReport(month, year);
    setReportData(report.data);

    //console.log("Datos del reporte de metas", goals.data);
  }

  const roundToTwoDecimals = (num) => {
    if (Number.isInteger(num)) {
      return num;
    }
    return parseFloat(num);
  };

  function setUpChartData(data, nombre, index, goals) {
    console.log("TESTEANDO", goals);
    setChartData(data);
    setGoalChart(goals);
    setUserChart(nombre);
    openModal();
  }

  function formatToExport() {
    const dataObject = [];
    for (const pl of userCol) {
      var obj = {};
      obj["Vendedor"] = pl;
      for (const hd of headers) {
        //console.log("Pusheando de hd");
        const spplited = hd.split("/");
        if (spplited[0] <= monthList.find((ml) => ml.value == month).days) {
          obj[hd] = roundToTwoDecimals(fullTable[pl][hd]);
        }
      }

      obj["Total vendedor"] = sumObjectValues(fullTable[pl]);
      dataObject.push(obj);
    }
    //console.log("Resultado", dataObject);
    generateExcel(dataObject, `Rep_ventas_mes_${month}_${year}`);
  }

  function sumObjectValues(obj) {
    let total = 0;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === "number") {
          total += value;
        }
      }
    }

    return total;
  }

  return (
    <div>
      <div className="formLabel">REPORTE MENSUAL DE VENTAS POR DIA</div>

      <div className="d-xl-flex justify-content-center gap-3">
        <Form.Group className="flex-grow-1" controlId="dateField1">
          <Form.Label>Mes</Form.Label>
          <Form.Select onChange={(e) => setMonth(e.target.value)}>
            <option value={monthList.find((ml) => ml.value == month).value}>
              {monthList.find((ml) => ml.value == month).month}
            </option>
            {monthList.map((mls, index) => {
              if (
                mls.value != monthList.find((ml) => ml.value == month).value
              ) {
                return (
                  <option key={index} value={mls.value}>
                    {mls.month}
                  </option>
                );
              }
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group className="flex-grow-1" controlId="dateField2">
          <Form.Label>Año</Form.Label>
          <Form.Select onChange={(e) => setYear(e.target.value)}>
            <option value={yearList.find((ml) => ml == currentYear)}>
              {yearList.find((ml) => ml == currentYear)}
            </option>
            {yearList.map((yl, index) => {
              if (yl != currentYear) {
                return (
                  <option value={yl} key={index}>
                    {yl}
                  </option>
                );
              }
            })}
          </Form.Select>
        </Form.Group>
      </div>
      {month != "" && year != "" ? (
        <div style={{ margin: "50px" }}>
          <Button
            variant="warning"
            className="yellowLarge"
            onClick={() => getReport()}
          >
            Generar Reporte
          </Button>
        </div>
      ) : (
        <div style={{ margin: "30px" }}>
          <div>Seleccione mes y año</div>
        </div>
      )}
      {reportData.length > 0 ? (
        <div style={{ maxWidth: "90vw", overflow: "auto", maxHeight: "75vh" }}>
          <Table bordered striped>
            <thead
              style={{
                position: "sticky",
                top: "0",
                right: "0",
                zIndex: "999",
                backgroundColor: "#5cb8b2",
              }}
            >
              <tr className="tableHeader">
                <th>Vendedor</th>
                {headers.map((dl, index) => {
                  const headerSplitted = dl.split("/");
                  const headerValue =
                    headerSplitted[0] + "/" + headerSplitted[1];
                  if (
                    headerSplitted[0] <=
                    monthList.find((ml) => ml.value == month).days
                  ) {
                    return <th key={index}>{headerValue}</th>;
                  }
                })}
                <th
                  style={{
                    position: "sticky",
                    top: "0",
                    right: "0",
                    zIndex: "999",
                    backgroundColor: "#5cb8b2",
                  }}
                >
                  Ver Gráfico
                </th>
              </tr>
            </thead>
            <tbody>
              {userCol.map((user, index) => {
                return (
                  <tr key={user} className="tableRow">
                    <td>{user}</td>
                    {headers.map((name) => {
                      const spplited = name.split("/");
                      if (
                        spplited[0] <=
                        monthList.find((ml) => ml.value == month).days
                      ) {
                        return (
                          <td key={name}>
                            {roundToTwoDecimals(fullTable[user][name]).toFixed(
                              2
                            )}
                          </td>
                        );
                      }
                    })}
                    <td
                      style={{
                        position: "sticky",
                        right: "0",
                        zIndex: "0",
                        backgroundColor: "white",
                      }}
                    >
                      <Button
                        variant="warning"
                        onClick={() =>
                          setUpChartData(
                            fullTable[user],
                            user,
                            index,
                            goalsData[user]
                          )
                        }
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      {reportData.length > 0 ? (
        <div style={{ margin: "20px" }}>
          {" "}
          <Button variant="success" onClick={() => formatToExport()}>
            Exportar a excel
          </Button>
        </div>
      ) : null}
      {showModal ? (
        <LineChartModal
          data={chartData}
          goalData={goalChart}
          showModal={showModal}
          closeModal={closeModal}
          nombre={userChart}
          year={year}
          month={monthList.find((ml) => ml.value == month).month}
        />
      ) : null}
    </div>
  );
}
