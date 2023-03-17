import React, { useState, useEffect } from "react";
import { Button, Modal, Image, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { getProducts, newProduct } from "../services/productServices";
import { addPackid, registerPack } from "../services/packServices";
import { initializeStock } from "../services/stockServices";
import { dateString } from "../services/dateServices";
export default function FormNewPack() {
  // Listas cargadas en render
  const [prodList, setProdList] = useState([]);
  // Listas y valores cargados manualmente
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPack, setTotalPack] = useState(0);
  const [nombrePack, setNombrePack] = useState("");
  // Validadores de estado
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  useEffect(() => {
    const allProducts = getProducts("all");
    allProducts.then((fetchedProducts) => {
      console.log("Test", fetchedProducts);
      setProdList(fetchedProducts.data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const tot = selectedProducts.reduce((accumulator, object) => {
        return accumulator + object.cantidadProducto * object.precioDeFabrica;
      }, 0);
      setTotalPack(tot);
    }
  }, [selectedProducts]);

  const handleClose = () => {
    setIsAlert(false);
    setIsAlertSec(false);
    window.location.reload();
  };
  function selectProduct(prod) {
    const product = JSON.parse(prod);
    const prodObj = {
      idProducto: product.idProducto,
      nombreProducto: product.nombreProducto,
      codInterno: product.codInterno,
      cantidadProducto: 1,
      precioDeFabrica: product.precioDeFabrica,
    };
    setSelectedProducts([...selectedProducts, prodObj]);
  }
  function changeQuantities(cantidad, index) {
    const updatedArray = [...selectedProducts];
    updatedArray[index] = {
      ...updatedArray[index],
      cantidadProducto: cantidad,
    };
    setSelectedProducts(updatedArray);
  }
  function deleteProduct(index) {
    const auxArray = [...selectedProducts];
    auxArray.splice(index, 1);
    setSelectedProducts(auxArray);
  }
  function savePack() {
    setAlertSec("Guardando pack");
    setIsAlertSec(true);
    const objSave = {
      nombrePack: nombrePack,
      precioPack: totalPack,
      descPack: nombrePack,
      productos: selectedProducts,
    };
    const packSaved = registerPack(objSave);
    packSaved
      .then((ps) => {
        saveProduct(ps);
      })
      .catch((err) => {
        console.log("Error al guardar", err);
      });
  }
  function saveProduct(data) {
    console.log("Pack registrado", data);
    const packId = data.data.id;
    const objProd = {
      codInterno: parseInt(500000 + packId),
      nombreProducto: nombrePack,
      descProducto: nombrePack,
      gramajeProducto: 0,
      precioDeFabrica: totalPack,
      codigoBarras: "-",
      cantCajon: 0,
      unidadDeMedida: "Unidad",
      tiempoDeVida: 1,
      activo: 1,
      precioPDV: 0,
      cantDisplay: 0,
      aplicaDescuento: "No",
      tipoProducto: 5,
      precioDescuentoFijo: totalPack,
      actividadEconomica: 107900,
      codigoSin: 99100,
      codigoUnidad: 57,
      origenProducto: 1,
    };
    const added = newProduct(objProd);
    added
      .then((res) => {
        const addedId = addPackid({
          idProducto: res.data.id,
          idPack: packId,
        });
        addedId.then((ai) => {
          const inicializado = initializeStock({
            idProducto: res.data.id,
            fechaHora: dateString(),
          });
          inicializado.then((response) => {
            setAlertSec("Pack Guardado Correctamente");
            setIsAlertSec(true);
            setTimeout(() => {
              window.location.reload(false);
            }, 2000);
          });
        });
      })
      .catch((err) => console.log("Error al crear producto", err));
  }
  return (
    <div>
      <div className="formLabel">CREAR PACKS BREICK</div>
      <div className="formLabelAlt">Agregar Productos</div>
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
        <Form.Select onChange={(e) => selectProduct(e.target.value)}>
          <option>{"Seleccione producto"}</option>
          {prodList.map((pr, index) => {
            return (
              <option value={JSON.stringify(pr)} key={index}>
                {pr.nombreProducto}
              </option>
            );
          })}
        </Form.Select>
      </Form>
      {selectedProducts.length > 0 ? (
        <div>
          <div className="formLabelAlt">Productos Seleccionados</div>
          <Table className="tableOneAlt">
            <thead className="tableHeader">
              <tr>
                <th className="smallTableCol"></th>
                <th className="largeTableCol">Producto</th>
                <th className="smallTableCol">Precio</th>
                <th className="smallTableCol">Cantidad</th>
                <th className="mediumTableCol">Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((sp, index) => {
                return (
                  <tr className="tableRow" key={index}>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => deleteProduct(index)}
                      >
                        Quitar
                      </Button>
                    </td>
                    <td>{sp.nombreProducto}</td>
                    <td>{sp.precioDeFabrica.toFixed(2)}</td>
                    <td>
                      {
                        <Form>
                          <Form.Control
                            type="number"
                            onChange={(e) =>
                              changeQuantities(e.target.value, index)
                            }
                            value={sp.cantidadProducto}
                          />
                        </Form>
                      }
                    </td>
                    <td>
                      {(sp.precioDeFabrica * sp.cantidadProducto).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="tableFoot">
              <tr>
                <td colSpan={4}>Total</td>
                <td>
                  {
                    <Form>
                      <Form.Control
                        type="number"
                        value={totalPack}
                        onChange={(e) => setTotalPack(e.target.value)}
                      />
                    </Form>
                  }
                </td>
              </tr>
            </tfoot>
          </Table>
          <div className="formLabelAlt">Nombre del Pack</div>
          <Form>
            <Form.Control
              type="text"
              onChange={(e) => setNombrePack(e.target.value)}
              value={nombrePack}
              placeholder="Ingrese nombre del nuevo pack"
            />
          </Form>
          <div className="formLabelAlt"></div>
          <div>
            <Button variant="success" onClick={() => savePack()}>
              Guardar Pack
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
