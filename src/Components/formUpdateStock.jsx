import Cookies from "js-cookie";
import React from "react";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table, Image } from "react-bootstrap";
import { getProducts } from "../services/productServices";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import * as XLSX from "xlsx";
import { ExportTemplate } from "../services/exportServices";
import { useRef } from "react";
import { updateFullStock } from "../services/stockServices";
import loading2 from "../assets/loading2.gif";
import { dateString } from "../services/dateServices";

export default function FormUpdateStock() {
  const [prodList, setprodList] = useState([]);
  const [userStore, setUserStore] = useState("");
  const acceptable = ["xlsx", "xls"];
  const [upFile, setUpFile] = useState(null);
  const [jsonExcel, setJsonExcel] = useState([]);
  const fileRef = useRef();
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isToConfirm, setIsToConfirm] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [auxProd, setAuxProd] = useState([]);
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
    }
    const allProducts = getProducts("all");
    allProducts.then((fetchedProducts) => {
      setprodList(fetchedProducts.data.data);
      setAuxProd(fetchedProducts.data.data);
    });
  }, []);
  const checkFileExtension = (name) => {
    return acceptable.includes(name.split(".").pop().toLowerCase());
  };
  const handleClose = () => {
    setIsAlert(false);
    setIsToConfirm(false);
  };
  function changeQuantities(index, cantidad, prod) {
    let auxObj = {
      codInterno: prod.codInterno,
      cantProducto: cantidad,
      nombreProducto: prod.nombreProducto,
      idProducto: prod.idProducto,
    };
    let auxSelected = [...prodList];
    auxSelected[index] = auxObj;
    setprodList(auxSelected);
  }
  function validateQuantities() {
    setIsToConfirm(true);
    var newProdList = [];
    const auxList = prodList;
    auxList.map((prod) => {
      if (prod.cantProducto != undefined) {
        console.log("Cantidad", prod.cantProducto);
        newProdList.push(prod);
      }
    });
    setprodList(newProdList);
    setAlert(
      "Está seguro que quiere actualizar? esta acción SOBRESCRIBE el stock actual en esta agencia"
    );
    setIsAlert(true);
  }
  async function handleExcel(fileInput) {
    const fileObj = fileInput.target.files[0];
    setUpFile(fileObj);
    if (!checkFileExtension(fileObj.name)) {
      setAlert("Tipo de archivo inválido");
      setIsAlert(true);
      fileRef.current.value = "";
      setUpFile(null);
    }
    const data = await fileObj.arrayBuffer();
    handleData(data);
  }
  function handleData(data) {
    const wb = XLSX.read(data);
    wb.SheetNames.map((sheet) => {
      const workSheet = wb.Sheets[sheet];
      const jsonData = XLSX.utils.sheet_to_json(workSheet);

      setJsonExcel(jsonData);
      setJsonTable(jsonData);
    });
  }

  function setJsonTable(jsonExcel) {
    var newList = [];
    jsonExcel.map((je) => {
      if (je.CODINTERNO === undefined || je.CANTIDAD === undefined) {
        setAlert("El formato de la tabla es inválido");
        setIsAlert(true);
        fileRef.current.value = "";
        setUpFile(null);
        setJsonExcel([]);
      } else {
        const obj = {
          codInterno: je.CODINTERNO,
          nombreProducto: prodList.find((ap) => ap.codInterno === je.CODINTERNO)
            .nombreProducto,
          cantProducto: je.CANTIDAD,
          idProducto: prodList.find((ap) => ap.codInterno === je.CODINTERNO)
            .idProducto,
        };
        newList.push(obj);
      }
    });
    setprodList(newList);
  }

  function EraseData() {
    fileRef.current.value = "";
    setUpFile(null);
  }

  function updateStock() {
    console.log("Lista de productos a actualizar", prodList);
    setIsAlert(false);
    setAlertSec("Actualizando Stock");
    setAlertSec(true);
    setIsToConfirm(false);
    const updated = updateFullStock({
      idAgencia: userStore,
      products: prodList,
      fechaHora: dateString(),
    });
    updated
      .then((res) => {
        setAlertSec(false);
        setAlert("Stock actualizado");
        setIsAlert(true);
        setprodList(auxProd);
        EraseData();
      })
      .catch((err) => console.log("Error al updatear", err));
  }

  return (
    <div>
      <div className="formLabel">ACTUALIZAR STOCK EN AGENCIA</div>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer className="buttonContainerAlt">
          {!isToConfirm ? (
            <Button variant="danger" onClick={handleClose}>
              Confirmo, cerrar Mensaje del Sistema
            </Button>
          ) : (
            <div className="modalButtons">
              <Button variant="success" onClick={() => updateStock()}>
                Actualizar
              </Button>
              <Button variant="warning" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
      <div className="fullProductTable">
        <Table>
          <thead className="tableHeader">
            <tr>
              <th>Cod Interno</th>
              <th>Nombre Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {prodList.map((pd, index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td>{pd.codInterno}</td>
                  <td>{pd.nombreProducto}</td>
                  <td>
                    <Form>
                      <Form.Control
                        type="number"
                        onChange={(e) =>
                          changeQuantities(index, e.target.value, pd)
                        }
                        value={
                          pd.cantProducto != undefined ? pd.cantProducto : ""
                        }
                      />
                    </Form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div className="fileInputContainer">
        <Form.Group controlId="formFile" className="fileInputAlt">
          <Form.Label>Subir archivo</Form.Label>
          <Form.Control
            type="file"
            className="inputButton"
            accept="xslx, xls"
            onChange={(e) => {
              handleExcel(e);
            }}
            multiple
            ref={fileRef}
          />
        </Form.Group>
      </div>

      <div className="buttons">
        <Button
          variant="success"
          className="purple"
          onClick={() => EraseData()}
        >
          Borrar todo
        </Button>
        <Button
          variant="light"
          className="normal"
          onClick={() => ExportTemplate()}
        >
          Descargar plantilla
        </Button>
        <Button
          variant="light"
          className="cyan"
          onClick={() => validateQuantities()}
        >
          Actualizar productos
        </Button>
      </div>
    </div>
  );
}
