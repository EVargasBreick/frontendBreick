import React, { useEffect, useState } from "react";
import "../styles/formLayouts.css";
import { Button, Form, Table } from "react-bootstrap";
import { getStores } from "../services/storeServices";
import { reportService } from "../services/reportServices";
import { Loader } from "./loader/Loader";
import { generateExcel, generateExcelMultiple } from "../services/utils";
import { userBasic, userService } from "../services/userServices";
import { calculateMonthDifference } from "../services/dateServices";

export default function BodyGroupedProductReport() {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));
  const [idAgencia, setIdAgencia] = useState("");
  const [almacen, setAlmacen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportsMoney, setReportsMoney] = useState([]);
  const [auxReportsMoney, setAuxReportsMoney] = useState([]);
  const [axuReports, setAuxReports] = useState([]);
  const [filtered, setFiltered] = useState("");
  const [checkedList, setCheckedList] = useState([]);
  const [evChecked, setEvChecked] = useState(true);
  const [checkedListMoney, setCheckedListMoney] = useState([]);
  const [evCheckedMoney, setEvCheckedMoney] = useState(true);
  const [reportType, setReportType] = useState("cantidad");
  const [checkedStores, setCheckedStores] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [salesmanList, setSalesmanList] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [monthByAmount, setMonthByAmount] = useState([]);
  const [monthByMoney, setMonthByMoney] = useState([]);
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  useEffect(() => {
    const vendedoresList = userService.getAll(2, 4);
    vendedoresList.then((list) => {
      console.log("Usuarios", list);
      setSalesmanList(list);
    });
    const stores = getStores();
    stores.then((store) => {
      setAlmacen(store.data);
    });
    function handleResize() {
      if (window.innerWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
      setCheckedListMoney(checked);
      //console.log("Checked", checked);
    }
  }, [reports]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = await reportService.getGroupedProductReport(
      checkedStores,
      dateStart,
      dateEnd,
      selectedClient,
      selectedSalesman,
      criteria
    );

    console.log("Data del reporte", data);

    setReports(data.cantidades);
    setAuxReports(data.cantidades);
    setReportsMoney(data.facturado);
    setAuxReportsMoney(data.facturado);
    setMonthByAmount(data.cantidadesMes);
    setMonthByMoney(data.facturadoMes);
    setLoading(false);
  }

  function verifyDates(e) {
    e.preventDefault();
    if (!(dateStart == "" || dateEnd == "")) {
      handleSubmit(e);
    }
  }

  const rows = reports.map((report, index) => (
    <tr
      key={index}
      className="tableRow"
      style={index < 10 ? { backgroundColor: `#b9f0cc` } : null}
    >
      <td className="tableColumnSmall">{index + 1}</td>
      {!isMobile && <td className="tableColumnSmall">{report.codInterno}</td>}
      <td className="tableColumnSmall">{report.nombreProducto}</td>
      <td className="tableColumnSmall">{`${report.sumaTotal} ${
        report.unidadDeMedida == "Unidad" ? "Unidades" : "Kgs"
      }`}</td>
      <td className="tableColumnSmall">
        {
          <Form.Check
            checked={
              checkedList.find((cl) => cl.idProducto == report.idProducto)
                ?.checked
            }
            onChange={() => checkProduct(report.idProducto, "quantity")}
          />
        }
      </td>
    </tr>
  ));

  const rowsMoney = reportsMoney.map((report, index) => (
    <tr
      key={index}
      className="tableRow"
      style={index < 10 ? { backgroundColor: `#b9f0cc` } : null}
    >
      <td className="tableColumnSmall">{index + 1}</td>
      {!isMobile && <td className="tableColumnSmall">{report.codInterno}</td>}
      <td className="tableColumnSmall">{report.nombreProducto}</td>
      <td className="tableColumnSmall">{`${report.sumaTotal?.toFixed(
        2
      )} Bs.`}</td>
      <td className="tableColumnSmall">
        {
          <Form.Check
            checked={
              checkedListMoney.find((cl) => cl.idProducto == report.idProducto)
                ?.checked
            }
            onChange={() => checkProduct(report.idProducto, "money")}
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
    const filteredMoney = auxReportsMoney.filter((ar) =>
      ar.nombreProducto.toLowerCase().includes(value.toLowerCase())
    );
    if (filtered.length > 0) {
      setReports(filtered);
      setReportsMoney(filteredMoney);
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
    setCheckedListMoney(list);
    setEvChecked(!evChecked);
    setEvCheckedMoney(!evCheckedMoney);
  }

  function resetChecked() {
    const list = [];
    for (const entry of checkedList) {
      const obj = {
        idProducto: entry.idProducto,
        checked: true,
      };
      list.push(obj);
    }
    setCheckedList(list);
    setCheckedListMoney(list);
    setEvChecked(!evChecked);
    setEvCheckedMoney(!evCheckedMoney);
  }

  function checkProduct(id, type) {
    if (type == "money") {
      const updatedArrayMoney = checkedListMoney.map((obj) => {
        if (obj.idProducto == id) {
          return {
            ...obj,
            checked: !obj.checked,
          };
        }
        return obj;
      });
      setCheckedListMoney(updatedArrayMoney);
    } else {
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
    const toExportMoney = [];
    for (const product of reportsMoney) {
      if (
        checkedListMoney.find((cl) => cl.idProducto == product.idProducto)
          .checked
      ) {
        toExportMoney.push(product);
      }
    }
    if (reportType == "cantidad") {
      generateExcel(
        toExport,
        `Reporte Agrupado de Productos por cantidad vendida${idAgencia} ${dateStart} - ${dateEnd}`
      );
    } else {
      generateExcel(
        toExport,
        `Reporte Agrupado de Productos por ingresos monetarios ${idAgencia} ${dateStart} - ${dateEnd}`
      );
    }
  }

  async function exportByMonthMoney() {
    const uniqueProdIds = [];
    const uniqueMonths = [];
    const uniqueYears = [];
    for (const prod of monthByMoney) {
      const foundProd = uniqueProdIds.find(
        (up) => up.idProducto == prod.idProducto
      );
      if (!foundProd) {
        uniqueProdIds.push(prod);
      }
      const foundMonth = uniqueMonths.find((um) => um == prod.month);
      if (!foundMonth) {
        uniqueMonths.push(prod.month);
      }
      const foundYear = uniqueYears.find((uy) => uy == prod.year);
      if (!foundYear) {
        uniqueYears.push(prod.year);
      }
    }
    console.log("Unique years", uniqueYears);
    const dataToExport = [];
    console.log("Largo prods", uniqueProdIds.length);
    for (const product of uniqueProdIds) {
      const fullMonthData = {};
      fullMonthData["idProducto"] = product.idProducto;
      fullMonthData["CODIGO"] = product.codInterno;
      fullMonthData["NOMBRE_PRODUCTO"] = product.nombreProducto;
      for (const year of uniqueYears.reverse()) {
        for (const month of uniqueMonths) {
          const found = monthByMoney.find(
            (mb) =>
              mb.month == month &&
              mb.idProducto == product.idProducto &&
              year == mb.year
          );

          const foundMonthAndYear = monthByMoney.find(
            (my) => my.month == month && my.year == year
          );
          if (foundMonthAndYear) {
            fullMonthData[`${months[month - 1]} ${year}`] = found
              ? Number(found.sumaTotal)
              : Number(0);
          }
        }
      }

      dataToExport.push(fullMonthData);
    }
    return dataToExport;
  }

  async function exportByMonthQuantity() {
    const uniqueProdIds = [];
    const uniqueMonths = [];
    const uniqueYears = [];
    for (const prod of monthByAmount) {
      const foundProd = uniqueProdIds.find(
        (up) => up.idProducto == prod.idProducto
      );
      if (!foundProd) {
        uniqueProdIds.push(prod);
      }
      const foundMonth = uniqueMonths.find((um) => um == prod.month);
      if (!foundMonth) {
        uniqueMonths.push(prod.month);
      }
      const foundYear = uniqueYears.find((uy) => uy == prod.year);
      if (!foundYear) {
        uniqueYears.push(prod.year);
      }
    }
    console.log("Unique years", uniqueYears);
    console.log("Unique months", uniqueMonths);
    const dataToExport = [];
    console.log("Largo prods", uniqueProdIds.length);
    for (const product of uniqueProdIds) {
      const fullMonthData = {};
      fullMonthData["idProducto"] = product.idProducto;
      fullMonthData["CODIGO"] = product.codInterno;
      fullMonthData["NOMBRE_PRODUCTO"] = product.nombreProducto;
      for (const year of uniqueYears.reverse()) {
        for (const month of uniqueMonths) {
          const found = monthByAmount.find(
            (mb) =>
              mb.month == month &&
              mb.idProducto == product.idProducto &&
              year == mb.year
          );
          const foundMonthAndYear = monthByMoney.find(
            (my) => my.month == month && my.year == year
          );
          //console.log("FOUNDDD", foundMonthAndYear);
          if (foundMonthAndYear) {
            fullMonthData[`${months[month - 1]} ${year}`] = found
              ? Number(found.sumaTotal)
              : Number(0);
          }
        }
      }
      dataToExport.push(fullMonthData);
    }
    return dataToExport;
  }

  async function handleMonthlyExport() {
    setLoading(true);
    const amountSheet = await exportByMonthQuantity();
    const moneySheet = await exportByMonthMoney();
    const arrayAmount = [];
    const arrayMoney = [];
    if (reportType == "cantidad") {
      for (const product of amountSheet) {
        if (
          checkedList.find((cl) => cl.idProducto == product.idProducto).checked
        ) {
          arrayAmount.push(product);
        }
      }
      for (const product of moneySheet) {
        if (
          checkedList.find((cl) => cl.idProducto == product.idProducto).checked
        ) {
          arrayMoney.push(product);
        }
      }
    } else {
      for (const product of amountSheet) {
        if (
          checkedListMoney.find((cl) => cl.idProducto == product.idProducto)
            .checked
        ) {
          arrayAmount.push(product);
        }
      }
      for (const product of moneySheet) {
        if (
          checkedListMoney.find((cl) => cl.idProducto == product.idProducto)
            .checked
        ) {
          arrayMoney.push(product);
        }
      }
    }

    const excelFIle = [
      {
        item: arrayAmount,
        name: "cantidad_vendida",
      },
      {
        item: arrayMoney,
        name: "monto_facturado",
      },
    ];

    const colStyleArray = [{ wch: 10 }, { wch: 10 }, { wch: 45 }];

    for (let i = 0; i < calculateMonthDifference(dateStart, dateEnd); i++) {
      colStyleArray.push({ wch: 13 });
    }

    generateExcelMultiple(
      excelFIle,
      `Reporte agrupado de ventas por mes por ${criteria} ${dateStart} - ${dateEnd}`,
      colStyleArray
    );
    setLoading(false);
  }

  function selectStore(idAgencia) {
    console.log("Array de agencias", checkedList);
    if (idAgencia == "todo") {
      if (allSelected) {
        setCheckedStores([]);
        setAllSelected(!allSelected);
      } else {
        const array = [];
        almacen.map((al) => {
          array.push(al.idAgencia);
        });
        setCheckedStores(array);
        console.log("Checked list", array);
        setAllSelected(!allSelected);
      }
    } else {
      const checked = [...checkedStores];
      console.log("Checked", checked);
      const filtered = checked.filter((cs) => cs != idAgencia);
      console.log("Filtered", filtered);
      if (!filtered || filtered?.length == checked.length) {
        console.log("Se agrega");
        checked.push(idAgencia);
        setCheckedStores(checked);
        console.log("Array de ids", checked);
      } else {
        console.log("Se quita");
        setCheckedStores(filtered);
        console.log("Array de ids", filtered);
      }
    }
  }

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridGap: "10px", // Add some gap between cells
    margin: "10px 0 10px 0",
  };

  // Conditionally update styles if isMobile is true
  if (isMobile) {
    gridStyles.gridTemplateColumns = "repeat(1, 1fr)";
  }

  const handleReportType = (value) => {
    setReportType(value);
    resetChecked();
    setEvChecked(true);
  };

  return (
    <section>
      <p className="formLabel">REPORTE AGRUPADO DE PRODUCTOS VENDIDOS</p>
      <Form
        className="d-flex justify-content-center p-3 flex-column gap-3"
        onSubmit={verifyDates}
      >
        <Form.Select onChange={(e) => setCriteria(e.target.value)}>
          <option value="">Seleccione criterio de reporte</option>
          <option value={"agencia"}>Por Agencia</option>
          <option value={"vendedor"}>Por Vendedor</option>
          <option value={"cliente"}>Por Cliente</option>
        </Form.Select>
        <div hidden={criteria == ""}>
          <Form.Label>{`Seleccione ${
            criteria == "agencia"
              ? "Agencias"
              : criteria == "vendedor"
              ? "Vendedor"
              : "Cliente"
          }`}</Form.Label>
          {criteria == "agencia" ? (
            <div>
              <Form.Group
                style={{
                  maxHeight: "30vh",
                  overflow: "auto",
                  backgroundColor: "#5cb8b2",
                  borderRadius: "10px",
                }}
              >
                <style>
                  {`
      ::-webkit-scrollbar {
        width: 12px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: #4b3169;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-track {
        background-color: #f1f1f1;
        border-radius: 10px;
      }
    `}
                </style>
                <div style={gridStyles}>
                  <div style={{ minWidth: 120, minHeight: 50 }}>
                    <Form.Check
                      value={"todo"}
                      onChange={(e) => selectStore(e.target.value)}
                      checked={allSelected}
                    />
                    <Form.Label>{`${
                      !allSelected ? "Seleccionar" : "Quitar"
                    } Todos`}</Form.Label>
                  </div>
                  {almacen.map((agencia, index) => {
                    const nombre =
                      agencia?.Nombre?.split(" ")?.slice(1)?.join(" ") != ""
                        ? agencia?.Nombre?.split(" ")?.slice(1)?.join(" ")
                        : agencia.Nombre;
                    const isChecked = checkedStores.find(
                      (cl) => cl == agencia.idAgencia
                    );

                    return (
                      <div key={index} style={{ minWidth: 120, minHeight: 50 }}>
                        <Form.Check
                          checked={isChecked}
                          value={agencia.idAgencia}
                          onChange={() => selectStore(agencia.idAgencia)}
                        />
                        <Form.Label>{nombre}</Form.Label>
                      </div>
                    );
                  })}
                </div>
              </Form.Group>
            </div>
          ) : criteria == "vendedor" ? (
            <Form.Select
              onChange={(e) => setSelectedSalesman(e.target.value)}
              value={selectedSalesman}
            >
              <option>{`Seleccione vendedor`}</option>
              {salesmanList.map((sm, index) => {
                return (
                  <option
                    key={index}
                    value={sm.idUsuario}
                  >{`${sm.nombre} ${sm.apPaterno}`}</option>
                );
              })}
            </Form.Select>
          ) : (
            <Form.Control
              type="number"
              value={selectedClient}
              min={0}
              onChange={(e) => setSelectedClient(e.target.value)}
            />
          )}

          <Form.Label style={{ marginTop: "20px" }}>
            Seleccione rango de fechas
          </Form.Label>
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
        </div>
        {dateStart != "" && dateEnd != "" ? (
          <Button className="reportButton " variant="success" type="submit">
            Generar Reporte
          </Button>
        ) : null}
      </Form>
      <div style={{ margin: "20px" }}>
        {reports.length > 0 && (
          <Form
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Form.Label>Criterio de Reporte</Form.Label>
            <Form.Select
              style={{ width: "50%", margin: "20px" }}
              onChange={(e) => handleReportType(e.target.value)}
            >
              <option value="cantidad">Por cantidad vendida</option>
              <option value="monto">Por Monto Vendido</option>
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="Filtrar por producto"
              style={{ width: "50%", margin: "20px" }}
              onChange={(e) => filterProducts(e.target.value)}
              value={filtered}
            />
          </Form>
        )}
      </div>
      {reportType == "cantidad"
        ? reports.length > 0 && (
            <div
              style={{
                maxHeight: "75vh",
                overflowY: "auto",
                marginBottom: "30px",
              }}
            >
              <h5>Reporte de productos más vendidos por unidad/kg</h5>
              <Table striped bordered>
                <thead>
                  <tr className="tableHeader">
                    <th className="tableColumnSmall">
                      {!isMobile ? "Posición" : "Pos"}
                    </th>
                    {!isMobile ? (
                      <th className="tableColumn">Codigo Interno</th>
                    ) : null}
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
          )
        : reportsMoney.length > 0 && (
            <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
              <h5>Reporte de productos más vendidos por monto ingresado</h5>
              <Table striped bordered>
                <thead>
                  <tr className="tableHeader">
                    <th className="tableColumnSmall">Posición</th>
                    {!isMobile ? (
                      <th className="tableColumn">Codigo Interno</th>
                    ) : null}
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
                <tbody>{rowsMoney}</tbody>
              </Table>
            </div>
          )}
      <div style={{ margin: "20px" }}>
        {reports.length > 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="success"
              onClick={() => {
                filterToExport();
              }}
            >
              Exportar a excel
            </Button>
            <Button
              variant="warning"
              onClick={() => {
                handleMonthlyExport();
              }}
            >
              {"Exportar a excel agrupado por mes "}
            </Button>
          </div>
        )}
      </div>
      {loading && <Loader />}
    </section>
  );
}
