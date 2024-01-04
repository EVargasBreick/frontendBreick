import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Table, Modal, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/formLayouts.css";
import loading2 from "../assets/loading2.gif";
import "../styles/generalStyle.css";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productServices";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { ExportTemplate } from "../services/exportServices";
import { updateStock } from "../services/orderServices";
import Cookies from "js-cookie";
import { dateString } from "../services/dateServices";
import {
  composedProductEntry,
  logProductEntry,
} from "../services/stockServices";
export default function FormUpdateProducts() {
  const navigate = useNavigate();
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [prodList, setprodList] = useState([]);
  const [auxProdList, setAuxProdList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [userId, setUserId] = useState("");
  const acceptable = ["xlsx", "xls"];
  const fileRef = useRef();
  const [upFile, setUpFile] = useState(null);
  const [jsonExcel, setJsonExcel] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserId(JSON.parse(UsuarioAct).idUsuario);
    }
    const allProducts = getProducts("all");
    allProducts.then((fetchedProducts) => {
      setprodList(fetchedProducts.data.data);
      setAuxProdList(fetchedProducts.data.data);
    });
  }, []);
  const checkFileExtension = (name) => {
    return acceptable.includes(name.split(".").pop().toLowerCase());
  };
  function addProductToList(product) {
    const produc = JSON.parse(product);
    var aux = false;

    selectedProducts.map((sp) => {
      if (sp.codInterno == produc.codInterno) {
        setAlert("El producto ya se encuentra seleccionado");
        setIsAlert(true);
        aux = true;
      }
    });
    if (!aux) {
      const productObj = {
        codInterno: produc.codInterno,
        cantProducto: "",
        nombreProducto: produc.nombreProducto,
        idProducto: produc.idProducto,
      };
      setSelectedProducts([...selectedProducts, productObj]);
    }
  }
  const handleClose = () => {
    setIsAlert(false);
  };
  function deleteProduct(index) {
    const auxArray = [...selectedProducts];
    auxArray.splice(index, 1);
    setSelectedProducts(auxArray);
  }
  function changeQuantities(index, cantidad, prod) {
    let auxObj = {
      codInterno: prod.codInterno,
      cantProducto: cantidad,
      nombreProducto: prod.nombreProducto,
      idProducto: prod.idProducto,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
  }

  async function handleExcel(fileInput) {
    setSelectedProducts([]);
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
    jsonExcel.map((je) => {
      if (je.CODINTERNO === undefined || je.CANTIDAD === undefined) {
        setAlert("El formato de la tabla es inválido");
        setIsAlert(true);
        fileRef.current.value = "";
        setUpFile(null);
        setJsonExcel([]);
      } else {
        if (
          prodList.find(
            (ap) => String(ap.codInterno) == String(je.CODINTERNO)
          ) != undefined
        ) {
          const finded = prodList.find(
            (ap) => String(ap.codInterno) == String(je.CODINTERNO)
          );
          console.log("Finded", finded);
          const obj = {
            codInterno: je.CODINTERNO,
            nombreProducto: finded.nombreProducto,
            cantProducto: je.CANTIDAD,
            idProducto: finded.idProducto,
          };
          setSelectedProducts((selectedProducts) => [...selectedProducts, obj]);
        }
      }
    });
  }
  /*function updateWarehouseStock() {
    if (selectedProducts.length > 0) {
      setAlertSec("Actualizando productos");
      setIsAlertSec(true);
      const logObj = {
        idUsuarioCrea: userId,
        fechaCrea: dateString(),
        products: selectedProducts,
      };
      const logEntry = logProductEntry(logObj);
      logEntry
        .then((res) => {
          const idCreado = res.data.id;
          const addedProducts = updateStock({
            accion: "add",
            idAlmacen: "AL001",
            productos: selectedProducts,
            detalle: `NIDPR-${idCreado}`,
          });
          addedProducts.then((ap) => {
            setIsAlertSec(false);
            setAlert("Productos agregados correctamente a almacén central");
            setIsAlert(true);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          });
        })
        .catch((err) => {
          console.log("Error al guardar el ingreso");
        });
    } else {
      setAlert("Seleccione al menos un producto por favor");
      setIsAlert(true);
    }
  }*/

  async function updateWarehouseStockAlt() {
    if (selectedProducts.length > 0) {
      setAlertSec("Actualizando productos");
      setIsAlertSec(true);
      const logObj = {
        idUsuarioCrea: userId,
        fechaCrea: dateString(),
        products: selectedProducts,
      };

      const objStock = {
        accion: "add",
        idAlmacen: "AL001",
        productos: selectedProducts,
      };

      try {
        const entered = await composedProductEntry({
          stock: objStock,
          log: logObj,
        });
        setAlertSec("Productos ingresados correctamente");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        setIsAlertSec(false);
        setAlert("Error al ingresar", error);
        setIsAlert(true);
      }
    } else {
      setAlert("Seleccione al menos un producto por favor");
      setIsAlert(true);
    }
  }

  function EraseData() {
    setSelectedProducts([]);
    fileRef.current.value = "";
    setUpFile(null);
  }

  function filterProducts(value) {
    setSearch(value);
    const newList = auxProdList.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    console.log("FILTERED", newList);
    setprodList([...newList]);
  }

  return (
    <div>
      <div className="formLabel">CARGA DE PRODUCTOS A ALMACÉN CENTRAL</div>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Confirmo, cerrar Mensaje del Sistema
          </Button>
        </Modal.Footer>
      </Modal>
      <Form>
        <Form.Group className="mb-3" controlId="prod-list">
          <Form.Label>Buscar Producto</Form.Label>
          <Form.Control
            type="text"
            placeholder="buscar"
            value={search}
            style={{ width: "50%", marginBottom: "20px" }}
            onChange={(e) => filterProducts(e.target.value)}
          />

          <Form.Select
            onChange={(e) => {
              addProductToList(e.target.value);
            }}
          >
            <option>Seleccione producto</option>
            {prodList.map((producto) => {
              return (
                <option
                  value={JSON.stringify(producto)}
                  key={producto.idProducto}
                >
                  {producto.nombreProducto}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        {selectedProducts.length > 0 ? (
          <div>
            <div className="formLabel">Detalle productos</div>
            <Table bordered striped hover className="table">
              <thead>
                <tr className="tableHeader">
                  <th className="tableColumnSmall">Nro</th>
                  <th className="tableColumnSmall">Codigo Producto</th>
                  <th className="tableColumn">Producto</th>
                  <th className="tableColumnSmall">Cantidad</th>
                  <td className="tableColumnSmall"></td>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => {
                  return (
                    <tr className="tableRow" key={index}>
                      <td className="tableColumnSmall">{index + 1}</td>
                      <td className="tableColumnSmall">{product.codInterno}</td>
                      <td className="tableColumn">{product.nombreProducto}</td>
                      <td className="tableColumnSmall">
                        <Form.Group>
                          <Form.Control
                            type="number"
                            placeholder=""
                            className="tableCant"
                            onChange={(e) =>
                              changeQuantities(index, e.target.value, product)
                            }
                            value={product.cantProducto}
                          />
                        </Form.Group>
                      </td>
                      <td className="tableColumnSmall">
                        <Button
                          className="yellow"
                          variant="warning"
                          onClick={() => {
                            deleteProduct(index);
                          }}
                        >
                          Quitar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        ) : null}
      </Form>
      <div className="secondHalf">
        <div className="formLabel">CARGA MASIVA</div>
        <Form>
          <Form.Group className="fullRadio" controlId="productDisccount">
            <Form.Group controlId="formFile" className="mb-3 fileInput">
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
                onClick={() => updateWarehouseStockAlt()}
              >
                Actualizar productos
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
