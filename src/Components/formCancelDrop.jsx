import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import AlertModal from "./Modals/alertModal";
import { cancelDrop, searchDrop } from "../services/dropServices";
import { getAllStores } from "../services/storeServices";
import Cookies from "js-cookie";
import LoadingModal from "./Modals/loadingModal";

export default function FormCancelDrop() {
  const [bajaId, setBajaId] = useState("");
  const [alert, setAlert] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [dropInfo, setDropInfo] = useState([]);
  const [stores, setStores] = useState([]);
  const handleChange = (value) => {
    setBajaId(value);
  };

  const formStyle = { display: "flex", justifyContent: "space-evenly" };

  const labelStyle = { width: "15%" };
  const buttonStyle = { width: "20%" };
  const inputStyle = { width: "50%" };

  useEffect(() => {
    const stores = getAllStores();
    stores.then((st) => {
      setStores(st.data);
    });
  }, []);

  const searchBaja = async (e) => {
    e.preventDefault();
    if (bajaId === "") {
      setAlert("Ingrese un id de baja por favor");
      setIsAlertSec(true);
    } else {
      console.log("Baja a buscar", bajaId);
      try {
        const dropInfo = await searchDrop(bajaId);
        if (dropInfo.data.length > 0) {
          console.log("Info de la baja", dropInfo.data);
          setDropInfo(dropInfo.data);
        } else {
          setAlert("No se encontró una baja con ese id");
        }
      } catch (err) {
        console.log("Error", err);
      }
    }
  };

  const anularBaja = async () => {
    setAlert("Anulando Baja");
    setIsAlert(true);
    console.log("Anulando baja");
    const idUsuario = JSON.parse(Cookies.get("userAuth")).idUsuario;
    const objStock = {
      accion: "add",
      idAlmacen: dropInfo[0].idAlmacen,
      productos: dropInfo,
      detalle: `ANUBJ-${bajaId}`,
    };
    const objCancel = {
      idBaja: bajaId,
      idUsuario: idUsuario,
      productos: objStock,
    };
    try {
      const cancelado = await cancelDrop(objCancel);
      setAlert("Baja anulada correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      console.log("Baja anulada correctamente", cancelado);
    } catch (err) {
      console.log("Error al anular", err);
      setAlert("Error al anular", err);
      setIsAlertSec(true);
    }
  };

  return (
    <div>
      <div>
        <div className="formLabel">ANULAR BAJAS</div>
        <AlertModal
          isAlertSec={isAlertSec}
          alertSec={alert}
          setIsAlertSec={setIsAlertSec}
        />
        <LoadingModal alertSec={alert} isAlertSec={isAlert} />
        <div>
          <Form style={formStyle} onSubmit={(e) => searchBaja(e)}>
            <Form.Label style={labelStyle}>Ingrese nro de Baja:</Form.Label>
            <Form.Control
              style={inputStyle}
              type="number"
              value={bajaId}
              onChange={(e) => handleChange(e.target.value)}
            />
            <Button
              style={buttonStyle}
              variant="success"
              onClick={(e) => searchBaja(e)}
            >
              Buscar Baja
            </Button>
          </Form>
        </div>
      </div>
      <div>
        {dropInfo.length > 0 ? (
          <div>
            <h6 style={{ margin: "50px 0 10px 0" }}>
              Datos de la baja seleccionada
            </h6>
            <Table style={{ margin: "15px 0 15px 0" }}>
              <thead>
                <tr className="tableHeader">
                  <th>Razón Social</th>
                  <th>Nit/Ci</th>
                  <th>Fecha Baja</th>
                </tr>
                <tr className="tableRow">
                  <td>{dropInfo[0].razonSocial}</td>
                  <td>{dropInfo[0].ci}</td>
                  <td>{dropInfo[0].fechaBaja}</td>
                </tr>
                <tr className="tableHeader">
                  <th colSpan={3}>Motivo Baja</th>
                </tr>
                <tr className="tableRow">
                  <td colSpan={3}>{dropInfo[0].motivo}</td>
                </tr>
                <tr className="tableHeader">
                  <th colSpan={3}>Agencia</th>
                </tr>
                <tr className="tableRow">
                  <td colSpan={3}>
                    {
                      stores.find((st) => st.idagencia == dropInfo[0].idAlmacen)
                        ?.nombre
                    }
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="tableHeader">
                  <th>Nombre Producto</th>
                  <th>Cantidad</th>
                  <th>Sub Total</th>
                </tr>
                {dropInfo.map((df, index) => {
                  return (
                    <tr className="tableRow" key={index}>
                      <td>{df.nombreProducto}</td>
                      <td style={{ textAlign: "end" }}>{df.cantProducto}</td>
                      <td
                        style={{ textAlign: "end" }}
                      >{`${df.subtotal} Bs`}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="tableHeader">
                  <th colSpan={2} style={{ textAlign: "end" }}>
                    Total
                  </th>
                  <td
                    style={{ textAlign: "end" }}
                  >{`${dropInfo[0].totalbaja} Bs`}</td>
                </tr>
              </tfoot>
            </Table>
            {dropInfo[0].estado == 0 ? (
              <div style={{ marginBottom: "10px" }}>
                La baja seleccionada ya fue anulada
              </div>
            ) : null}
            <Button
              variant="danger"
              onClick={() => anularBaja()}
              disabled={dropInfo[0].estado == 0}
            >
              Anular Baja
            </Button>
          </div>
        ) : (
          <h6 style={{ margin: "50px 0 10px 0" }}>
            Ingrese el id de la baja en el campo disponible
          </h6>
        )}
      </div>
    </div>
  );
}
