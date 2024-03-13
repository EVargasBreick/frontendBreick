import React, { useState, useEffect } from "react";
import { Button, Modal, Image, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import {
  getProducts,
  newProduct,
  productTypes,
} from "../services/productServices";
import { addPackid, registerPack } from "../services/packServices";
import { initializeStock } from "../services/stockServices";
import { dateString } from "../services/dateServices";
export default function FormNewPack() {
  // Listas cargadas en render
  const [prodList, setProdList] = useState([]);
  const [auxProdList, setAuxProdList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  // Listas y valores cargados manualmente
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPack, setTotalPack] = useState(0);
  const [nombrePack, setNombrePack] = useState("");
  const [tipo, setTipo] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    nombre: "",
    tipo: "",
  });
  // Validadores de estado
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const allProducts = getProducts("all");
    allProducts.then((fetchedProducts) => {
      console.log("Test", fetchedProducts);
      setProdList(fetchedProducts.data.data);
      setAuxProdList(fetchedProducts.data.data);
    });
    const tipos = productTypes();
    tipos
      .then((tipos) => {
        setTypeList(tipos.data);
        console.log("Tipos", tipos);
      })
      .catch((err) => {
        console.log("Error al cargar los tipos", err);
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

  function selectBySummit(e) {
    e.preventDefault();
    const filtered = auxProdList.filter(
      (ap) =>
        ap.nombreProducto.toLowerCase().includes(search) ||
        ap.codInterno == search
    );
    selectProduct(e, JSON.stringify(filtered[0]));
  }

  function selectProduct(e, prod) {
    e.preventDefault();
    const product = JSON.parse(prod);
    const prodObj = {
      idProducto: product.idProducto,
      nombreProducto: product.nombreProducto,
      codInterno: product.codInterno,
      cantidadProducto: 1,
      precioDeFabrica: product.precioDeFabrica,
    };
    setSelectedProducts([...selectedProducts, prodObj]);
    setProdList(auxProdList);
    setSearch("");
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
    if (nombrePack == "" || tipo == "") {
      let errorName = "";
      let errorType = "";
      if (nombrePack == "") {
        errorName = "El nombre es obligatorio";
      }
      if (tipo == "") {
        errorType = "El tipo es obligatorio";
      }
      setErrorMessages({ nombre: errorName, tipo: errorType });
    } else {
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
        precioPDV: totalPack,
        cantDisplay: 0,
        aplicaDescuento: "No",
        tipoProducto: tipo,
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
  }
  function searchProduct(value) {
    setSearch(value);
    const filtered = auxProdList.filter(
      (ap) =>
        ap.nombreProducto.toLowerCase().includes(value) ||
        ap.codInterno == value
    );
    setProdList(filtered);
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

      <Form
        style={{ display: "flex", justifyContent: "space-evenly" }}
        onSubmit={(e) => selectBySummit(e)}
      >
        <Form.Select
          onChange={(e) => selectProduct(e, e.target.value)}
          style={{ width: "45%" }}
        >
          <option>{"Seleccione producto"}</option>
          {prodList.map((pr, index) => {
            return (
              <option value={JSON.stringify(pr)} key={index}>
                {pr.nombreProducto}
              </option>
            );
          })}
        </Form.Select>
        <Form.Control
          value={search}
          style={{ width: "45%" }}
          type="text"
          placeholder="buscar"
          onChange={(e) => searchProduct(e.target.value)}
        />
      </Form>
      {selectedProducts.length > 0 ? (
        <div>
          <div style={{ margin: "20px" }}>Productos Seleccionados</div>
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
              required
              type="text"
              onChange={(e) => setNombrePack(e.target.value)}
              value={nombrePack}
              placeholder="Ingrese nombre del nuevo pack"
            />
            {errorMessages.nombre != "" && (
              <div style={{ color: "red", textAlign: "left" }}>
                {errorMessages.nombre}
              </div>
            )}
          </Form>
          <div
            style={{
              textAlign: "left",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            Tipo de pack
          </div>
          <Form>
            <Form.Select onChange={(e) => setTipo(e.target.value)} required>
              <option>Seleccione tipo pack</option>
              {typeList.map((tl, index) => {
                if (tl.idTiposProducto < 6) {
                  return (
                    <option value={tl.idTiposProducto} key={index}>
                      {tl.tipoProducto}
                    </option>
                  );
                }
              })}
            </Form.Select>
            {errorMessages.tipo != "" && (
              <div style={{ color: "red", textAlign: "left" }}>
                {errorMessages.tipo}
              </div>
            )}
          </Form>
          <div>
            <Button
              variant="success"
              onClick={() => savePack()}
              style={{ marginTop: "15px" }}
            >
              Guardar Pack
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
