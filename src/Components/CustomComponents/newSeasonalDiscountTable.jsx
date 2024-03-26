import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { getAlphabet } from "../../services/langServices";
import { formatPickedDate } from "../../services/dateServices";
import { registerSeasonalDiscount } from "../../services/discountEndpoints";
import LoadingModal from "../Modals/loadingModal";
import AlertModal from "../Modals/alertModal";
export default function NewSeasonalDiscountTable({ startDate, endDate }) {
  const alphabet = getAlphabet();
  const [season, setSeason] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isLoadingAlert, setIsLoadingAlert] = useState(false);
  const [categorias, setCategorias] = useState([
    {
      categoria: "0",
      montoMinimo: 0,
      montoMaximo: 1000,
      descuento: "",
    },
    {
      categoria: "A",
      montoMinimo: 1001,
      montoMaximo: 3000,
      descuento: "",
    },
    {
      categoria: "B",
      montoMinimo: 3001,
      montoMaximo: 5000,
      descuento: "",
    },
    {
      categoria: "C",
      montoMinimo: 5001,
      montoMaximo: 10000,
      descuento: "",
    },
    {
      categoria: "D",
      montoMinimo: 10001,
      montoMaximo: 20000,
      descuento: "",
    },
    {
      categoria: "E",
      montoMinimo: 20001,
      montoMaximo: 9999999,
      descuento: "",
    },
  ]);

  useEffect(() => {
    if (
      categorias.length > 0 &&
      categorias[categorias.length - 1].montoMaximo != 9999999
    ) {
      const auxCat = [...categorias];
      auxCat[categorias.length - 1].montoMaximo = 9999999;
      setCategorias(auxCat);
    }
  }, [categorias]);

  const [listas, setListas] = useState([
    { categoria: "0", descuentoMayo: 0, descuentoRuta: 0 },
    {
      categoria: "A",
      descuentoMayo: 0,
      descuentoRuta: 0,
    },
    {
      categoria: "B",
      descuentoMayo: 0,
      descuentoRuta: 0,
    },
    {
      categoria: "C",
      descuentoMayo: 0,
      descuentoRuta: 0,
    },
    {
      categoria: "D",
      descuentoMayo: 0,
      descuentoRuta: 0,
    },
    {
      categoria: "E",
      descuentoMayo: 0,
      descuentoRuta: 0,
    },
  ]);

  function addCategory() {
    if (categorias.length == 27) {
      setAlert("No se pueden agregar más categorías");
      setIsAlert(true);
      return;
    }

    const updatedCat = [...categorias];
    const updatedLista = [...listas];

    const newCat = {
      categoria: alphabet[categorias.length - 1],
      montoMinimo: 0,
      montoMaximo: 0,
      descuento: "",
    };
    updatedCat.push(newCat);
    setCategorias(updatedCat);
    const newPercent = {
      categoria: alphabet[categorias.length - 1],
      descuentoMayo: 0,
      descuentoRuta: 0,
    };
    updatedLista.push(newPercent);
    setListas(updatedLista);
    console.log("Categoria agregada", newCat);
  }

  function changeLimits(value, index, limite) {
    const auxCat = [...categorias];
    const limit = limite == "inf" ? "montoMinimo" : "montoMaximo";
    auxCat[index][limit] = parseInt(value);
    setCategorias(auxCat);
  }

  function removeLastCategory() {
    if (categorias.length > 2) {
      const auxCat = [...categorias];
      auxCat.pop();
      setCategorias(auxCat);
      const auxListas = [...listas];
      auxListas.pop();
      setListas(auxListas);
    } else {
      setAlert("Deben haber al menos 2 categorías de descuento");
      setIsAlert(true);
    }
  }

  function changePercents(value, index, type) {
    console.log("TEST", type);
    const auxListas = [...listas];
    if (type == 2) {
      console.log("Cambiando a mayorista");
      auxListas[index].descuentoMayo = value;
      setListas(auxListas);
    } else {
      auxListas[index].descuentoRuta = value;
      setListas(auxListas);
    }
  }

  function validateData() {
    if (new Date(startDate) >= new Date(endDate)) {
      return "La fecha de finalización debe ser posterior al inicio";
    }
    if (season == "") {
      return "Por favor seleccione tipo estacional de productos";
    }
    const found = categorias.find((ct) => ct.montoMaximo <= ct.montoMinimo);
    if (found) {
      return `Un límite mínimo es mayor o igual que el límite máximo en la categoria ${found.categoria}`;
    }
    let index = 1;
    while (index < categorias.length) {
      if (
        categorias[index]?.montoMinimo <= categorias[index - 1]?.montoMaximo
      ) {
        return `El límite minimo de la categoria ${categorias[index].categoria
          } es menor o igual que el límite máximo de la categoria ${categorias[index - 1].categoria
          }`;
      }
      index++;
    }
    const foundZeros = listas.find(
      (ls) =>
        (ls.descuentoMayo == 0 || ls.descuentoRuta == 0) && ls.categoria != "0"
    );

    if (foundZeros) {
      return `Uno de los descuentos de la categoría ${foundZeros.categoria} se encuentra en 0`;
    }
    return "success";
  }

  async function formatData() {
    const validated = validateData();
    if (validated == "success") {
      setAlert("Registrando descuentos");
      setIsLoadingAlert(true);
      const formatedStart = formatPickedDate(startDate);
      const formatedEnd = formatPickedDate(endDate);
      const dataArray = [];
      const descEst = {
        fechaInicio: formatedStart,
        fechaFin: formatedEnd,
        tipoProducto: season,
        activo: 1,
      };
      categorias.map((ct) => {
        const descMay = listas.find((lm) => lm.categoria == ct.categoria);
        const obj = {
          tipoUsuario: 2,
          descuento: descMay.descuentoMayo,
          montoMinimo: ct.montoMinimo,
          montoMaximo: ct.montoMaximo,
          categoria: descMay.categoria,
        };
        dataArray.push(obj);
      });
      categorias.map((ct) => {
        const descRut = listas.find((lm) => lm.categoria == ct.categoria);
        const obj = {
          tipoUsuario: 4,
          descuento: descRut.descuentoRuta,
          montoMinimo: ct.montoMinimo,
          montoMaximo: ct.montoMaximo,
          categoria: descRut.categoria,
        };
        dataArray.push(obj);
      });
      console.log("Array de datos", dataArray);
      const discounInfo = {
        seasonDiscount: descEst,
        discountList: dataArray,
      };
      try {
        const registered = await registerSeasonalDiscount(discounInfo);
        if (registered) {
          setAlert("Descuentos registrados correctamente");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (err) { }
    } else {
      setAlert(validated);
      setIsAlert(true);
    }
  }

  return (
    <div>
      <AlertModal
        isAlertSec={isAlert}
        alertSec={alert}
        setIsAlertSec={setIsAlert}
      />
      <LoadingModal isAlertSec={isLoadingAlert} alertSec={alert} />
      <div style={tableStyles.tableLayout}>
        <Form>
          <Table>
            <thead>
              <tr style={tableStyles.tableHeader}>
                <th colSpan={5}>
                  <div>
                    <div
                      style={{ margin: "10px" }}
                    >{`Descuento estacional de productos de `}</div>
                    <Form.Select onChange={(e) => setSeason(e.target.value)}>
                      <option value={""}>- Seleccione una opción -</option>
                      <option value={2}>Pascua</option>
                      <option value={4}>Halloween</option>
                      <option value={3}>Navidad</option>
                    </Form.Select>
                  </div>
                </th>
              </tr>
              <tr style={tableStyles.tableHeader}>
                <th
                  colSpan={2}
                  style={tableStyles.halfColumn}
                >{`Fecha Inicio`}</th>
                <th
                  colSpan={2}
                  style={tableStyles.halfColumn}
                >{`Fecha Fin`}</th>
              </tr>
              <tr style={tableStyles.tableInfo}>
                <td colSpan={2}>{formatPickedDate(startDate)}</td>
                <td colSpan={2}>{formatPickedDate(endDate)}</td>
              </tr>
            </thead>
          </Table>
          <Table>
            <thead>
              <tr style={tableStyles.tableHeader}>
                <th colSpan={1} style={tableStyles.smallColumn}>
                  Categoria
                </th>
                <th colSpan={1}>Rango de precios</th>
                <th colSpan={1} style={tableStyles.smallColumn}>
                  Mayoristas
                </th>
                <th colSpan={1} style={tableStyles.smallColumn}>
                  Ruta
                </th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((ct, index) => {
                //console.log("Categoria", ct);
                return (
                  <tr style={tableStyles.tableInfo} key={index}>
                    <td>{ct.categoria}</td>
                    <td>
                      {
                        <div style={tableStyles.inputFields}>
                          <div style={{ marginRight: "10px" }}>Desde:</div>
                          <Form.Control
                            value={ct.montoMinimo}
                            type="number"
                            onChange={(e) =>
                              changeLimits(e.target.value, index, "inf")
                            }
                          />
                          <div
                            style={{ marginLeft: "10px", marginRight: "10px" }}
                          >
                            Hasta:
                          </div>
                          <Form.Control
                            value={ct.montoMaximo}
                            type="number"
                            onChange={(e) =>
                              changeLimits(e.target.value, index, "sup")
                            }
                          />
                        </div>
                      }
                    </td>
                    <td>
                      <div className="input-group ">
                        <div style={tableStyles.inputFields}>
                          {
                            <Form.Control
                              disabled={ct.categoria == "0"}
                              value={
                                listas.find((lm) => lm.categoria == ct.categoria)
                                  ?.descuentoMayo
                              }
                              onChange={(e) =>
                                changePercents(e.target.value, index, 2)
                              }
                            />
                          }
                          <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2">%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="input-group ">
                        <div style={tableStyles.inputFields}>
                          {
                            <Form.Control
                              disabled={ct.categoria == "0"}
                              value={
                                listas.find((lm) => lm.categoria == ct.categoria)
                                  ?.descuentoRuta
                              }
                              onChange={(e) =>
                                changePercents(e.target.value, index, 4)
                              }
                            />
                          }
                          <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2">%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Form>
        <div style={tableStyles.buttonLayout}>
          <Button onClick={() => addCategory()} variant="warning">
            Agregar categoria
          </Button>
          <Button onClick={() => removeLastCategory()} variant="danger">
            Quitar ultima categoria
          </Button>
          <Button onClick={() => formatData()} variant="success">
            Registrar descuento de temporada
          </Button>
        </div>
      </div>
    </div>
  );
}

const tableStyles = {
  tableLayout: {
    margin: "20px",
  },
  tableHeader: {
    backgroundColor: "#5cb8b2",
    color: "white",
  },
  tableInfo: {
    backgroundColor: "white",
    color: "black",
  },
  smallColumn: {
    maxWidth: "15%",
    width: "25%",
  },
  halfColumn: {
    maxWidth: "50%",
    width: "50%",
  },
  inputFields: {
    display: "flex",
    flexDirection: "row",
  },
  buttonLayout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
};
