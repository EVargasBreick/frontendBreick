import React, { useEffect, useState } from "react";
import { HonestWeekPicker } from "../services/HonestWeekPicker";
import { Button, Form, Table } from "react-bootstrap";
import { userService } from "../services/userServices";
import { formatDate, monthInfo } from "../services/dateServices";
import {
  generateExcel,
  generateExcelDoubleSheets,
  handleExcelUpdate,
} from "../services/utils";

export default function FormGoalSetter() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState({});
  const [fullData, setFullData] = useState({});
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userListAux, setUserListAux] = useState([]);
  const [readedExcelData, setReadedExcelData] = useState([]);
  const [readedExcelObs, setReadedExcelObs] = useState([]);
  const onChange = (week) => {
    setReadedExcelData([]);
    setReadedExcelObs([]);
    setFullData({});
    const startDate = formatDate(week.firstDay);
    const endDate = formatDate(week.lastDay);
    setSelectedWeek({ startDate, endDate });
  };
  const weekDays = {
    Lunes: 1,
    Martes: 2,
    Miercoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sabado: 6,
    Domingo: 7,
  };

  useEffect(() => {
    if (userList.length > 0 && selectedWeek) {
      const startInfo = monthInfo(
        selectedWeek.startDate.month,
        selectedWeek.startDate.year
      );
      var varDay = selectedWeek.startDate.day;
      let dayList = [];
      let goalObject = {};
      for (let i = 0; i < 7; i++) {
        if (varDay <= startInfo.days) {
          dayList.push({
            day: varDay,
            fullDate:
              varDay +
              "/" +
              selectedWeek.startDate.month +
              "/" +
              selectedWeek.startDate.year,
          });
          const date =
            varDay +
            "/" +
            selectedWeek.startDate.month +
            "/" +
            selectedWeek.startDate.year;
          goalObject[date] = {};
          userList.forEach((ul) => {
            goalObject[date][ul.idUsuario] = 0;
          });
        } else {
          const day =
            varDay - startInfo.days > 9
              ? varDay - startInfo.days
              : "0" + (varDay - startInfo.days);

          dayList.push({
            day: day,
            fullDate:
              day +
              "/" +
              selectedWeek.endDate.month +
              "/" +
              selectedWeek.endDate.year,
          });
          const date =
            day +
            "/" +
            selectedWeek.endDate.month +
            "/" +
            selectedWeek.endDate.year;
          goalObject[date] = {};
          userList.forEach((ul) => {
            goalObject[date][ul.idUsuario] = 0;
          });
        }
        varDay++;
      }
      console.log("Data", goalObject);
      setSelectedDays(dayList);
      setFullData(goalObject);
    }
  }, [userList, selectedWeek]);

  const days = Object.keys(weekDays);
  const dayNumber = Object.values(weekDays);
  const notUsers = [4, 2];

  useEffect(() => {
    const userData = userService.getAll();
    userData
      .then((res) => {
        const filtered = res.filter((entry) => notUsers.includes(entry.rol));
        //onsole.log("Filtered", filtered);
        setUserList(filtered);
        setUserListAux(filtered);
      })
      .catch((err) => {
        console.log("Error al cargar los usuarios", err);
      });
  }, []);

  function setUpForExport() {
    const dates = Object.keys(fullData);
    const ids = Object.keys(fullData[dates[0]]);
    console.log("dates", ids);
    const dataList = [];
    const dataObsList = [];
    for (const id of ids) {
      var dataStructure = {};
      var dataObs = {};
      const found = userList.find((ul) => ul.idUsuario == id);
      dataStructure["Id Usuario"] = id;
      dataStructure["Usuario"] =
        found.nombre + " " + found.apPaterno + " " + found.apMaterno;
      dataObs["Id Usuario"] = id;
      dataObs["Usuario"] =
        found.nombre + " " + found.apPaterno + " " + found.apMaterno;
      for (const date of dates) {
        dataStructure[date] = 0;
        dataObs[date] = "";
      }
      dataList.push(dataStructure);
      dataObsList.push(dataObs);
    }
    generateExcelDoubleSheets(
      dataList,
      dataObsList,
      "Plantilla excel",
      "Metas",
      "Observaciones"
    );
    //console.log("Data structure", dataList);
  }

  async function handleUploadedExcel(e) {
    setIsLoading(true);
    const excelData = await handleExcelUpdate(e);
    const metas = excelData[0].Metas;
    const obs = excelData[1].Observaciones;
    setReadedExcelData(metas);
    setReadedExcelObs(obs);
    const retrievedFull = await formatExcelReaded(metas, obs);
    const goals = retrievedFull.retrievedFull;
    const obsFull = retrievedFull.obsFull;
    console.log("Promesa fullfileada", retrievedFull);
    setFullData(goals);
    setReadedExcelData(goals);
    setReadedExcelObs(obsFull);
    setIsLoading(false);
  }

  function formatExcelReaded(metas, observaciones) {
    return new Promise((resolve) => {
      const retrievedFull = {};
      const obsFull = {};
      for (const day of selectedDays) {
        //console.log("Day", day);
        retrievedFull[day.fullDate] = {};
        obsFull[day.fullDate] = {};
        for (const meta of metas) {
          const idUsuario = meta["Id Usuario"];
          //console.log("meta", meta);
          retrievedFull[day.fullDate][idUsuario] = meta[day.fullDate];
        }
        for (const observ of observaciones) {
          const idUsuario = observ["Id Usuario"];
          //console.log("meta", meta);
          obsFull[day.fullDate][idUsuario] = observ[day.fullDate];
        }
      }

      resolve({ retrievedFull, obsFull });
    });
  }

  function updateGoals() {
    //console.log("metas", readedExcelData);
    //console.log("observaciones", readedExcelObs);
    const dataArray = [];
    for (const day of selectedDays) {
      const date = day.fullDate;
      const users = fullData[date];
      const ids = Object.keys(users);
      for (const id of ids) {
        const obj = {
          idUsuario: id,
          fechaHora: date,
          meta: fullData[date][id],
          obs: readedExcelObs[date][id],
        };
        dataArray.push(obj);
      }
    }
    console.log("Test", dataArray);
  }

  return (
    <div>
      <div className="formLabel">ESTABLECER METAS DIARIAS POR SEMANA</div>
      <div>Seleccione semana</div>
      <div className="centered-picker">
        <HonestWeekPicker onChange={onChange} />
      </div>
      <div className="formLabel">{`Semana del ${selectedWeek?.startDate?.fullDate} al ${selectedWeek?.endDate?.fullDate}`}</div>
      {!isLoading && Object.keys(fullData).length > 0 ? (
        <div
          style={{
            marginTop: "25px",
            maxHeight: "65vh",
            overflow: "auto",
            marginBottom: "25px",
          }}
        >
          <Table>
            <thead>
              <tr className="tableHeader">
                <td>Vendedor</td>
                {days.map((wd, index) => (
                  <th key={index}>{`${wd} ${selectedDays[index]?.day}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userList.map((ul, index) => {
                return (
                  <tr key={index} className="tableRow">
                    <td>
                      {ul.nombre + " " + ul.apPaterno + " " + ul.apMaterno}
                    </td>
                    {selectedDays.map((ud, index) => {
                      return (
                        <td key={index}>
                          <div>
                            <div>
                              {fullData[ud.fullDate][ul.idUsuario]
                                ? fullData[ud.fullDate][ul.idUsuario]
                                : "0"}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}

      <div style={{ margin: "25px", width: "30%" }}>
        <Form>
          <Form.Control
            type="file"
            className="inputButton"
            accept="xslx, xls"
            onChange={(e) => {
              handleUploadedExcel(e);
            }}
          />
        </Form>
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button onClick={() => setUpForExport()} variant="warning">
          Descargar plantilla excel
        </Button>

        <Button variant="success" onClick={() => updateGoals()}>
          Cargar metas
        </Button>
      </div>
    </div>
  );
}
