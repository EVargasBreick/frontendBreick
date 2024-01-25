import React, { useEffect, useState } from "react";
import { HonestWeekPicker } from "../services/HonestWeekPicker";
import { Button, Form, Table, Tooltip, Overlay } from "react-bootstrap";
import {
  getWeeklyGoals,
  insertAndUpdateWeekly,
  userService,
} from "../services/userServices";
import { formatDate, monthInfo } from "../services/dateServices";
import {
  generateExcel,
  generateExcelDoubleSheets,
  handleExcelUpdate,
} from "../services/utils";
import { ConfirmModal } from "./Modals/confirmModal";
import LoadingModal from "./Modals/loadingModal";

export default function FormGoalSetter() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState({});
  const [fullData, setFullData] = useState({});
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userListAux, setUserListAux] = useState([]);
  const [readedExcelData, setReadedExcelData] = useState([]);
  const [readedExcelObs, setReadedExcelObs] = useState([]);
  const [loadedData, setLoadedData] = useState([]);
  const [fullObs, setFullObs] = useState({});
  const [isAlert, setIsAlert] = useState(false);
  const [isLoadAlert, setIsLoadAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [finalArray, setFinalArray] = useState([]);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [target, setTarget] = useState(null);

  const onChange = async (week) => {
    setReadedExcelData([]);
    setReadedExcelObs([]);
    setFullData({});
    const startDate = formatDate(week.firstDay);
    const endDate = formatDate(week.lastDay);
    const dataOfWeek = await getWeeklyGoals(
      startDate.fullDate,
      endDate.fullDate
    );
    setLoadedData(dataOfWeek.data);
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
      console.log("QUE ES ESTO", startInfo);
      var varDay = parseInt(selectedWeek.startDate.day);
      let dayList = [];
      let goalObject = {};
      for (let i = 0; i < 7; i++) {
        const day = varDay > 9 ? varDay : `0${varDay}`;
        if (varDay <= startInfo.days) {
          dayList.push({
            day: day,
            fullDate:
              day +
              "/" +
              selectedWeek.startDate.month +
              "/" +
              selectedWeek.startDate.year,
          });
          const date =
            day +
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
      console.log("Goal object", goalObject);
      if (loadedData.length > 0) {
        const loadObject = formatDataReaded(loadedData, dayList);
        loadObject.then((lo) => {
          setFullData(lo.fullDataObj);
          setFullObs(lo.fullObsObj);
        });
      } else {
        setFullData(goalObject);
        setFullObs({});
      }
      setSelectedDays(dayList);
    }
  }, [userList, selectedWeek, loadedData]);

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

    const ordenado = userList.sort((a, b) => a.nombre.localeCompare(b.nombre));
    console.log("Ordenado por nombre", ordenado);
    const idUsuarioArray = Array.from(
      new Set(ordenado.map((item) => item.idUsuario))
    );
    const dataList = [];
    const dataObsList = [];
    console.log("Full obs", fullObs);
    for (const id of idUsuarioArray) {
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
        dataStructure[date] = fullData != {} ? fullData[date][id] : 0;
        dataObs[date] =
          Object.keys(fullObs).length > 0 ? fullObs[date][id] : "";
      }
      dataList.push(dataStructure);
      dataObsList.push(dataObs);
    }
    generateExcelDoubleSheets(
      dataList,
      dataObsList,
      `Excel metas del ${selectedWeek?.startDate?.fullDate} al ${selectedWeek?.endDate?.fullDate} `,
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

  async function formatDataReaded(loaded, dayList) {
    const structured = await structuredData(loaded, dayList);
    return new Promise((resolve) => resolve(structured));
  }

  function structuredData(data, dayList) {
    console.log("DATA", data);
    return new Promise((resolve, reject) => {
      let fullDataObj = {};
      let fullObsObj = {};
      for (const day of dayList) {
        fullDataObj[day.fullDate] = {};
        fullObsObj[day.fullDate] = {};
        const filteredDays = data.filter((ld) => ld.fecha == day.fullDate);
        for (const user of userList) {
          const foundEntry = filteredDays.filter(
            (fld) => fld.idUsuario == user.idUsuario
          );
          fullDataObj[day.fullDate][user.idUsuario] = foundEntry[0]?.meta;
          fullObsObj[day.fullDate][user.idUsuario] = foundEntry[0]?.notas;
        }
      }
      resolve({ fullDataObj, fullObsObj });
    });
  }

  async function updateGoals() {
    setAlert("Actualizando metas");
    setIsLoadAlert(true);
    //console.log("metas", readedExcelData);
    console.log("observaciones", readedExcelObs);

    const dataArray = [];
    let zeroArray = [];
    for (const day of selectedDays) {
      const date = day.fullDate;
      const users = fullData[date];
      const ids = Object.keys(users);
      const isObs = Object.keys(readedExcelObs).length > 0 ? true : false;

      for (const id of ids) {
        const obj = {
          idUsuario: id,
          fechaHora: date,
          meta: fullData[date][id],
          obs: isObs ? readedExcelObs[date][id] : "",
        };
        if (fullData[date][id] == 0) {
          zeroArray.push({ date, id });
        }
        dataArray.push(obj);
      }
    }
    if (zeroArray.length > 0) {
      setIsLoadAlert(false);
      setFinalArray(dataArray);
      setAlert(
        `Se encontraron ${zeroArray.length} celdas con valores en cero, ¿Está seguro que quiere registrar las metas?`
      );
      setIsAlert(true);
    } else {
      savingProcess(dataArray);
    }
  }

  async function savingProcess(dataArray) {
    try {
      const insertedValues = await insertAndUpdateWeekly(dataArray);
      console.log("INSERTED", insertedValues);
      setAlert("Metas actualizadas correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  const handleSubmit = () => {
    savingProcess(finalArray);
  };

  const handleCancel = () => {
    setIsAlert(false);
  };

  const handleTooltip = (event, content) => {
    setShowTooltip(true);
    setTooltipContent(content);
    setTarget(event.target);
  };

  const hideTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <div>
      <div className="formLabel">ESTABLECER METAS DIARIAS POR SEMANA</div>
      <LoadingModal alertSec={alert} isAlertSec={isLoadAlert} />
      <ConfirmModal
        show={isAlert}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        title={"Mensaje del sistema"}
        text={alert}
        isButtons={true}
      />
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
                    {selectedDays.map((ud, cellIndex) => {
                      //console.log("dATA", ud);
                      const data = fullData[ud.fullDate][ul.idUsuario]
                        ? fullData[ud.fullDate][ul.idUsuario]
                        : "0";

                      const observacion =
                        Object.keys(fullObs).length > 0
                          ? fullObs[ud.fullDate][ul.idUsuario] != ""
                            ? fullObs[ud.fullDate][ul.idUsuario]
                            : "Sin Observaciones"
                          : "Sin observaciones";
                      return (
                        <td
                          key={cellIndex}
                          onMouseEnter={(e) => handleTooltip(e, observacion)}
                          onMouseLeave={hideTooltip}
                        >
                          <div>
                            <div>{data}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Overlay
            target={target}
            show={showTooltip}
            placement="top"
            container={document.body}
            containerPadding={20}
          >
            <Tooltip id="tooltip">{tooltipContent}</Tooltip>
          </Overlay>
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
