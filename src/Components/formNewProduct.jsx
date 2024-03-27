import React, { useState, useEffect } from "react";
import { Button, Modal, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  getCodes,
  newProduct,
  productOrigin,
  productTypes,
} from "../services/productServices";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { initializeStock } from "../services/stockServices";
import { dateString } from "../services/dateServices";
export default function FormNewProduct() {
  //Listas cargadas en render
  const [codeList, setCodeList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [originList, setOriginList] = useState([]);
  // Atributos de producto
  const [desc, setDesc] = useState("");
  const [codInterno, setCodInterno] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [pdv, setPdv] = useState("");
  const [gramaje, setGramaje] = useState("");
  const [tiempoVida, setTiempoVida] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [precioDescuento, setPrecioDescuento] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [origen, setOrigen] = useState("");
  // Validadores de estado
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  useEffect(() => {
    const listaCodigos = getCodes();
    listaCodigos
      .then((lista) => {
        console.log("Lista", lista);
        setCodeList(lista.data);
      })
      .catch((err) => {
        console.log("Error al cargar los codigos", err);
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
    const origenes = productOrigin();
    origenes
      .then((origen) => {
        setOriginList(origen.data);
      })
      .catch((err) => {});
  }, []);
  function saveProduct() {
    if (unidadMedida == "") {
      setIsAlertSec(false);
      setAlert("Por favor seleccione una unidad de medida");
      setIsAlert(true);
    } else {
      setAlertSec("Agregando producto");
      setIsAlertSec(true);
      const validated = validateCodes();
      validated
        .then((res) => {
          const objProd = {
            codInterno: codInterno,
            nombreProducto: nombre,
            descProducto: desc,
            gramajeProducto: gramaje,
            precioDeFabrica: pdv,
            codigoBarras: codigoBarras,
            cantCajon: 0,
            unidadDeMedida: unidadMedida,
            tiempoDeVida: tiempoVida,
            activo: 1,
            precioPDV: pdv,
            cantDisplay: 0,
            aplicaDescuento: tipo == 5 || tipo == 6 ? "No" : "Si",
            tipoProducto: tipo,
            precioDescuentoFijo: precioDescuento == "" ? pdv : precioDescuento,
            actividadEconomica: 107900,
            codigoSin: 99100,
            codigoUnidad: unidadMedida == "Unidad" ? 57 : 22,
            origenProducto: origen,
          };
          const added = newProduct(objProd);
          added
            .then((res) => {
              const inicializado = initializeStock({
                idProducto: res.data.id,
                fechaHora: dateString(),
              });
              inicializado.then((response) => {
                setAlertSec("Producto agregado correctamente");
                setIsAlertSec(true);
                setTimeout(() => {
                  window.location.reload(false);
                }, 2000);
              });
            })
            .catch((err) => {
              console.log("Error al crear producto", err);
              setIsAlertSec(false);
            });
        })
        .catch((err) => {
          const mensajeError =
            err == "ambos"
              ? "El codigo de barras y el codigo interno ya se encuentran registrados"
              : err == "codInterno"
              ? "El codigo interno ya se encuentra registrado"
              : "El codigo de barras ya se encuentra registrado";
          setIsAlertSec(false);
          setAlert(mensajeError);
          setIsAlert(true);
        });
    }
  }
  function validateCodes() {
    return new Promise((resolve, reject) => {
      const foundInt = codeList.filter((cl) => cl.codInterno == codInterno);
      const foundBar = codeList.filter((cl) => cl.codigoBarras == codigoBarras);
      if (foundInt.length == 0 && foundBar.length == 0) {
        resolve(true);
      } else {
        if (foundInt.length > 0 && foundBar.length > 0) {
          if (codigoBarras.length < 2) {
            resolve(true);
          } else {
            reject("ambos");
          }
        } else if (foundInt.length > 0) {
          reject("codInterno");
        } else {
          if (codigoBarras.length < 2) {
            resolve(true);
          } else {
            reject("codigoBarras");
          }
        }
      }
    });
  }

  const handleClose = () => {
    setIsAlert(false);
    setIsAlertSec(false);
  };
  return (
    <div>
      <div className="formLabel">AGREGAR PRODUCTOS</div>
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
      <div className="formTwoCol">
        <Form className="halfForm">
          <Form.Group className="halfAlt" controlId="productCode">
            <Form.Label>Codigo Interno</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese codigo"
              onChange={(e) => setCodInterno(e.target.value)}
              value={codInterno}
            />
          </Form.Group>
          <Form.Group className="halfAlt" controlId="productName">
            <Form.Label>Descripcción (opcional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese descripción"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </Form.Group>

          <Form.Group className="halfAlt" controlId="productQuantity">
            <Form.Label>Precio de Fábrica</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese precio de fábrica"
              onChange={(e) => setPdv(e.target.value)}
              value={pdv}
            />
          </Form.Group>
          <Form.Group className="halfAlt" controlId="productQuantity">
            <Form.Label>Tiempo de vida (meses)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese tiempo de vida"
              onChange={(e) => setTiempoVida(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="halfAlt" controlId="productQuantity">
            <Form.Label>Codigo de Barras</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese c. de barras"
              onChange={(e) => setCodigoBarras(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Form className="halfForm">
          <Form.Group className="halfAlt" controlId="productName">
            <Form.Label>Nombre Producto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre"
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="selectAlt" controlId="productType">
            <Form.Label>Unidad de medida</Form.Label>
            <Form.Select onChange={(e) => setUnidadMedida(e.target.value)}>
              <option>Seleccione unidad de medida</option>
              <option value="Unidad">Unidad</option>
              <option value="Kg">Por Kg (granel)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="halfAlt" controlId="productCode">
            <Form.Label>Gramaje(gr)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese gramaje del prod"
              onChange={(e) => setGramaje(e.target.value)}
              value={gramaje}
            />
          </Form.Group>

          <Form.Group className="selectAlt" controlId="productType">
            <Form.Label>Tipo</Form.Label>
            <Form.Select onChange={(e) => setTipo(e.target.value)}>
              <option>Seleccione tipo de producto</option>
              {typeList.map((tl, index) => {
                return (
                  <option value={tl.idTiposProducto} key={index}>
                    {tl.tipoProducto}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="selectAlt" controlId="productType">
            <Form.Label>Origen</Form.Label>
            <Form.Select onChange={(e) => setOrigen(e.target.value)}>
              <option>Seleccione origen del producto</option>
              {originList.map((tl, index) => {
                return (
                  <option value={tl.idOrigenProducto} key={index}>
                    {tl.origenProducto}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          {tipo == "6" ? (
            <Form.Group className="halfAlt" controlId="productCode">
              <Form.Label>Precio de descuento fijo</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese gramaje del prod"
                onChange={(e) => setPrecioDescuento(e.target.value)}
                value={gramaje}
              />
            </Form.Group>
          ) : null}
        </Form>
      </div>
      <div className="buttonCreate">
        <Button variant="light" className="cyan" onClick={() => saveProduct()}>
          Crear productos
        </Button>
      </div>
    </div>
  );
}
