import React, { useRef, useState } from "react";
import { Form, Button, Table, Modal, Image } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import { getClient } from "../services/clientServices";
import { useEffect } from "react";
import { getProductsWithStock } from "../services/productServices";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import FormRegisterClient from "./formRegisterClient";
import { convertToText } from "../services/numberServices";
import config from "../config.json";
import QrComponent from "./qrComponent";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./invoicePDF";
import SaleModal from "./saleModal";
import { dateString } from "../services/dateServices";
import { createSale } from "../services/saleServices";
import { getBranches } from "../services/storeServices";
import { createInvoice, deleteInvoice } from "../services/invoiceServices";

import {
  saleDiscount,
  verifyAutomaticDiscount,
} from "../services/discountServices";
import { updateStock } from "../services/orderServices";

export default function FormNewSale() {
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isLoading, setisLoading] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [totalPrevio, setTotalPrevio] = useState(0);
  const [totalDesc, setTotalDesc] = useState(0);
  const [totalFacturar, setTotalFacturar] = useState(0);
  const [tipo, setTipo] = useState("normal");
  const [isDesc, setIsDesc] = useState(false);
  const [pedidoFinal, setPedidoFinal] = useState({});
  const [usuarioAct, setUsuarioAct] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [productObj, setProductObj] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [filtered, setFiltered] = useState("");
  const [willCreate, setWillCreate] = useState(false);
  const [available, setAvailable] = useState([
    { nombreProducto: "Cargando..." },
  ]);
  const [isSaleModal, setIsSaleModal] = useState(true);
  const [tipoPago, setTipoPago] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [cancelado, setCancelado] = useState(0);
  const [cardNumbersA, setCardNumbersA] = useState("");
  const [cardNumbersB, setCardNumbersB] = useState("");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userStore, setUserStore] = useState("");
  const [isCreate, setIsCreate] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [datos, setDatos] = useState("");
  const [auxProducts, setAuxProducts] = useState([]);
  const [especiales, setEspeciales] = useState([]);
  const [sucursal, setSucursal] = useState("");
  const [branchInfo, setBranchInfo] = useState({});
  const [invoice, setInvoice] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [auxSelectedProducts, setAuxSelectedProducts] = useState("");
  useEffect(() => {
    const spplited = dateString().split(" ");
    console.log("Fecha y hora", spplited[1].substring(0, 5));
    console.log("Convertidooo", convertToText(2898.5).texto);
    const preNit = Cookies.get("nit");
    if (preNit) {
      setSearch(preNit);
      Cookies.remove("nit");
    }
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      console.log("Usuario actual", UsuarioAct);
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      const disponibles = getProductsWithStock(
        JSON.parse(Cookies.get("userAuth")).idAlmacen,
        "all"
      );
      disponibles.then((fetchedAvailable) => {
        setAvailable(fetchedAvailable.data[0]);
        setAuxProducts(fetchedAvailable.data[0]);
      });
      const suc = getBranches();
      suc.then((resp) => {
        console.log("Sucursales", resp.data[0]);
        const sucursales = resp.data[0];
        const alm = JSON.parse(Cookies.get("userAuth")).idAlmacen;
        console.log("Almacen", alm);
        const sucur = sucursales.find((sc) => alm == sc.idAgencia);
        setSucursal(sucur);
        const branchData = {
          nombre: sucur.nombre,
          dir: sucur.direccion,
          tel: sucur.telefono,
          ciudad: sucur.ciudad,
          nro: sucur.idImpuestos,
        };
        setBranchInfo(branchData);
      });
      /*const interval = setInterval(() => {
        const disponibles = getProductsWithStock(
          JSON.parse(Cookies.get("userAuth")).idAlmacen,
          "all"
        );
        disponibles.then((fetchedAvailable) => {
          setAvailable(fetchedAvailable.data[0]);
        });
      }, 60000);*/
    }
  }, []);

  function searchClient() {
    setIsSelected(false);
    setClientes([]);
    setisLoading(true);
    const found = getClient(search);
    found.then((res) => {
      setIsClient(true);
      if (res.data.data[0][0]) {
        console.log("Cliente(s) encontrados:", res.data.data);
        setClientes(res.data.data[0]);
        console.log("Clientes encontrados:", res.data.data[0]);
        setisLoading(false);
      } else {
        setIsClient(false);
        setWillCreate(true);
        setIsAlert(true);
        setAlert("Usuario no encontrado");
      }
    });
  }

  function filterProducts(value) {
    setFiltered(value);
    const newList = auxProducts.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    setAvailable([...newList]);
  }

  function filterSelectedClient(id) {
    setSelectedClient(id);
    const searchObject = clientes.find((cli) => cli.idCliente === id);
    const array = [];
    array.push(searchObject);
    setClientes(array);
    setIsSelected(true);

    console.log("Cliente seleccionado: ", searchObject);
  }

  function addProductToList(action, product) {
    if (action == "manual") {
      const produc = JSON.parse(product);
      var aux = false;
      console.log("Producto seleccionado:", produc);
      selectedProducts.map((sp) => {
        if (sp.codInterno === produc.codInterno) {
          console.log("Producto repetido");
          setAlert("El producto ya se encuentra seleccionado");
          setIsAlert(true);
          aux = true;
        }
      });
      if (!aux) {
        const productObj = {
          codInterno: produc.codInterno,
          cantProducto: 1,
          nombreProducto: produc.nombreProducto,
          idProducto: produc.idProducto,
          cant_Actual: produc.cant_Actual,
          cantidadRestante: produc.cant_Actual,
          precioDescuentoFijo: produc.precioDescuentoFijo,
          precioDeFabrica: produc.precioDeFabrica,
          descuentoProd: 0,
          total: produc.precioDeFabrica,
          tipoProducto: produc.tipoProducto,
        };

        setSelectedProducts([...selectedProducts, productObj]);
        setAuxSelectedProducts([...auxSelectedProducts, productObj]);
      }
    } else {
      const selected = available.find((pr) => pr.codigoBarras === filtered);
      if (selected) {
        var aux = false;
        selectedProducts.map((sp) => {
          if (sp.codInterno === selected.codInterno) {
            const indexSelected = selectedProducts.indexOf(sp);
            changeQuantities(indexSelected, sp.cantProducto + 1, sp);
            aux = true;
          }
        });
        if (!aux) {
          const productObj = {
            codInterno: selected.codInterno,
            cantProducto: 1,
            nombreProducto: selected.nombreProducto,
            idProducto: selected.idProducto,
            cant_Actual: selected.cant_Actual,
            cantidadRestante: selected.cant_Actual,
            precioDeFabrica: selected.precioDeFabrica,
            precioDescuentoFijo: selected.precioDescuentoFijo,
            descuentoProd: 0,
            total: selected.precioDeFabrica,
            tipoProducto: selected.tipoProducto,
          };
          setSelectedProducts([...selectedProducts, productObj]);
          setAuxSelectedProducts([...auxSelectedProducts, productObj]);
        }

        console.log("Selected:", selected);
      }
      setFiltered("");
    }
  }

  const handleClose = () => {
    setIsAlert(false);
    setWillCreate(false);
    setisLoading(false);
    setIsCreate(false);
  };
  function deleteProduct(index) {
    const auxArray = [...selectedProducts];
    const auxAux = [...auxSelectedProducts];
    auxArray.splice(index, 1);
    auxAux.splice(index, 1);
    setSelectedProducts(auxArray);
    setAuxSelectedProducts(auxAux);
  }
  function addWithScanner(e) {
    e.preventDefault();
    console.log("Leido por scanner", e.target.value);
    addProductToList("scanner");
  }
  function changeQuantities(index, cantidad, prod) {
    const arrCant = cantidad.split(".");
    const isThree =
      cantidad === ""
        ? ""
        : arrCant[1]?.length > config.decimales
        ? prod.cantProducto
        : cantidad;
    const total = parseFloat(prod.precioDeFabrica) * parseFloat(isThree);
    let auxObj = {
      codInterno: prod.codInterno,
      cantProducto: isThree,
      nombreProducto: prod.nombreProducto,
      idProducto: prod.idProducto,
      cant_Actual: prod.cant_Actual,
      cantidadRestante: prod.cant_Actual - cantidad,
      descuentoProd: total - total * (1 - descuento / 100),
      precioDeFabrica: prod.precioDeFabrica,
      precioDescuentoFijo: prod.precioDescuentoFijo,
      total: total,
      descuentoProd: 0,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    console.log("descuento aplicado", total - total * (1 - descuento / 100));
    setSelectedProducts(auxSelected);
    setAuxSelectedProducts(auxSelected);
  }
  function handleModal() {
    if (isSelected) {
      const invoiceBody = {
        nroFactura: 1,
        idSucursal: sucursal.idImpuestos,
        nitEmpresa: config.nitEmpresa,
        fechaHora: fechaHora,
        nitCliente: clientes[0].nit,
        razonSocial: clientes[0].razonSocial,
        tipoPago: tipoPago,
        pagado: cancelado,
        cambio: cambio,
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: `123456789ABCDEFGHIJKLMNIOPQRSTUVWXYZ`,
        importeBase: parseFloat(cancelado - cambio).toFixed(2),
        debitoFiscal: parseFloat((cancelado - cambio) * 0.13).toFixed(2),
        desembolsada: 0,
      };
      setInvoice(invoiceBody);
      const totPrev = parseFloat(
        auxSelectedProducts.reduce((accumulator, object) => {
          return accumulator + object.total;
        }, 0)
      ).toFixed(2);
      const totDesc = selectedProducts.reduce((accumulator, object) => {
        return accumulator + object.total;
      }, 0);
      setTotalPrevio(totPrev);
      setTotalDesc(totPrev - totDesc);
      setTotalFacturar(totDesc);
      setIsInvoice(false);
      setTimeout(() => {
        setIsInvoice(true);
      }, 100);
    } else {
      setAlert("Por favor, seleccione un cliente");
      setIsAlert(true);
    }
  }
  function saveSale(createdId) {
    const totPrev = parseFloat(
      auxSelectedProducts.reduce((accumulator, object) => {
        return accumulator + object.total;
      }, 0)
    ).toFixed(2);
    const totDesc = selectedProducts.reduce((accumulator, object) => {
      return accumulator + object.total;
    }, 0);
    return new Promise((resolve, reject) => {
      setFechaHora(dateString());
      const objVenta = {
        pedido: {
          idUsuarioCrea: usuarioAct,
          idCliente: selectedClient,
          fechaCrea: dateString(),
          fechaActualizacion: dateString(),
          montoTotal: parseFloat(totPrev).toFixed(2),
          descCalculado: parseFloat(totPrev - totDesc).toFixed(2),
          descuento: descuento,
          montoFacturar: parseFloat(totDesc).toFixed(2),
          idPedido: "",
          idFactura: createdId,
        },
        productos: selectedProducts,
      };
      const ventaCreada = createSale(objVenta);
      ventaCreada
        .then((res) => {
          const updatedStock = updateStock({
            accion: "take",
            idAlmacen: userStore,
            productos: selectedProducts,
          });
          updatedStock.then((us) => {
            console.log("Stock actualizado", us);
            console.log("Venta creada", res);
            setAlertSec("Gracias por su compra!");
            resolve(true);
            setIsAlertSec(true);
            setTimeout(() => {
              setIsAlertSec(false);
            }, 1000);
          });
        })
        .catch((err) => {
          console.log("Error al crear la venta", err);
          const deletedInvoice = deleteInvoice(createdId);
          reject(false);
          console.log("Venta y factura borradas", deletedInvoice);
        });
    });
  }
  function saveInvoice(cuf, nro) {
    return new Promise((resolve, reject) => {
      setAlertSec("Guardando Venta");
      const invoiceBody = {
        nroFactura: nro,
        idSucursal: sucursal.idImpuestos,
        nitEmpresa: config.nitEmpresa,
        fechaHora: dateString(),
        nitCliente: clientes[0].nit,
        razonSocial: clientes[0].razonSocial,
        tipoPago: tipoPago,
        pagado: cancelado,
        cambio: cambio,
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: cuf,
        importeBase: parseFloat(cancelado - cambio).toFixed(2),
        debitoFiscal: parseFloat((cancelado - cambio) * 0.13).toFixed(2),
        desembolsada: 0,
      };
      setInvoice(invoiceBody);
      const newInvoice = createInvoice(invoiceBody);
      newInvoice
        .then((res) => {
          console.log("Respuesta de creacion de la factura", res);
          const newId = res.data.idCreado;
          const created = saveSale(newId);
          created
            .then((res) => {
              resolve(true);
            })
            .catch((error) => {
              reject(false);
            });
        })
        .catch((error) => {
          console.log("Error en la creacion de la factura", error);
        });
      console.log("Cancelado:", cancelado);
      console.log("Cambio", cambio);
      setIsSaleModal(!isSaleModal);
    });
  }
  function handleDiscount() {
    const newDiscount = verifyAutomaticDiscount(selectedProducts, descuento);
    newDiscount.then((nd) => {
      setDescuento(nd);
      const discountedProds = saleDiscount(selectedProducts, nd);
      discountedProds.then((res) => {
        setSelectedProducts(res);
        handleModal();
      });
    });
  }
  return (
    <div>
      <div className="formLabel">VENTAS AGENCIA</div>
      {isInvoice ? (
        <div>
          <SaleModal
            datos={{
              total: totalPrevio,
              descuento,
              totalDescontado: selectedProducts.reduce(
                (accumulator, object) => {
                  return accumulator + object.total;
                },
                0
              ),
              nit: clientes[0].nit,
              razonSocial: clientes[0].razonSocial,
            }}
            show={true}
            isSaleModal={isSaleModal}
            setIsSaleModal={setIsSaleModal}
            tipoPago={tipoPago}
            setTipoPago={setTipoPago}
            setCambio={setCambio}
            cambio={cambio}
            cancelado={cancelado}
            setCancelado={setCancelado}
            cardNumbersA={cardNumbersA}
            setCardNumbersA={setCardNumbersA}
            cardNumbersB={cardNumbersB}
            setCardNumbersB={setCardNumbersB}
            saveInvoice={saveInvoice}
            setAlert={setAlert}
            setIsAlert={setIsAlert}
            branchInfo={branchInfo}
            selectedProducts={selectedProducts}
            invoice={invoice}
            total={totalPrevio}
            descuentoCalculado={
              auxSelectedProducts.reduce((accumulator, object) => {
                return accumulator + object.total;
              }, 0) -
              selectedProducts.reduce((accumulator, object) => {
                return accumulator + object.total;
              }, 0)
            }
            totalDescontado={selectedProducts.reduce((accumulator, object) => {
              return accumulator + object.total;
            }, 0)}
            fechaHora={fechaHora}
          />
        </div>
      ) : null}
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
          {willCreate ? (
            <Button variant="success" onClick={() => setIsCreate(true)}>
              Crear Cliente
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isCreate} size="xl">
        <Modal.Header>
          <Modal.Title>Clientes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegisterClient isModal={true} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Ingrese Nit"
          className="me-2"
          aria-label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="warning"
          className="search"
          onClick={() => searchClient()}
        >
          {isLoading ? (
            <Image src={loading2} style={{ width: "5%" }} />
          ) : search.length < 1 ? (
            "Buscar"
          ) : (
            "Buscar"
          )}
        </Button>
      </Form>
      {isClient ? (
        <div className="tableOne">
          <Table>
            <thead>
              <tr className="tableHeader">
                <th className="tableColumnSmall"></th>
                <th className="tableColumn">Nit</th>
                <th className="tableColumn">Razon Social</th>
                <th className="tableColumn">Zona</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((client, index) => {
                return (
                  <tr key={index} className="tableRow">
                    <td className="tableColumnSmall">
                      <div>
                        <Button
                          variant="warning"
                          className="tableButtonAlt"
                          disabled={isSelected}
                          onClick={() => {
                            filterSelectedClient(client.idCliente);
                          }}
                        >
                          {isSelected ? "Seleccionado" : "Seleccionar"}
                        </Button>
                      </div>
                    </td>
                    <td className="tableColumn">{client.nit}</td>
                    <td className="tableColumn">{client.razonSocial}</td>
                    <td className="tableColumn">{client.zona}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      <div className="formLabelPurple"></div>
      <div className="formLabel">AGREGAR PRODUCTOS</div>
      <div className="rowFormInputs">
        <Form className="mb-3 halfSelect">
          <Form.Group controlId="order">
            <Form.Select
              className="selectorColor"
              onChange={(e) => {
                addProductToList("manual", e.target.value);
              }}
            >
              {available.map((producto, index) => {
                return (
                  <option value={JSON.stringify(producto)} key={index}>
                    {producto.nombreProducto}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Form>
        <Form onSubmit={(e) => addWithScanner(e)} className="mb-3 searchHalf">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar"
              value={filtered}
              onChange={(e) => filterProducts(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>
      </div>
      <div>
        <Form>
          {selectedProducts.length > 0 ? (
            <div className="tableOne">
              <Table>
                <thead>
                  <tr className="tableHeader">
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumnSmall">Codigo</th>
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Precio Unidad/Kg</th>
                    <th className="tableColumnSmall">{`Cantidad/Peso(Gr)`}</th>
                    <th className="tableColumnSmall">Total</th>
                    <th className="tableColumnSmall">Cantidad Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {[...selectedProducts].map((sp, index) => {
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumnSmall">
                          <div>
                            <Button
                              onSubmit={(e) => e.preventDefault()}
                              variant="warning"
                              className="tableButtonAlt"
                              onClick={() => deleteProduct(index)}
                            >
                              Quitar
                            </Button>
                          </div>
                        </td>
                        <td className="tableColumnSmall">{sp.codInterno}</td>
                        <td className="tableColumn">{sp.nombreProducto}</td>
                        <td className="tableColumnSmall">
                          {`${sp.precioDeFabrica} Bs.`}
                        </td>
                        <td className="tableColumnSmall">
                          <Form.Control
                            type="number"
                            min="0"
                            placeholder="0"
                            value={sp.cantProducto}
                            onChange={(e) => {
                              changeQuantities(index, e.target.value, sp);
                            }}
                          />
                        </td>
                        <td className="tableColumnSmall">
                          {sp.total.toFixed(2)}
                        </td>
                        <td className="tableColumnSmall">{sp.cant_Actual}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="tableHeader">
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumn"></th>
                    <th className="tableColumnSmall">{"Total: "}</th>
                    <th className="tableColumnSmall">
                      {`${selectedProducts
                        .reduce((accumulator, object) => {
                          return accumulator + object.total;
                        }, 0)
                        .toFixed(2)} Bs.`}
                    </th>
                    <th className="tableColumnSmall">{"Total descontado: "}</th>
                    <th className="tableColumnSmall">{`${(
                      (selectedProducts.reduce((accumulator, object) => {
                        return accumulator + object.total;
                      }, 0) *
                        (100 - descuento)) /
                      100
                    ).toFixed(2)}
                     Bs.`}</th>
                  </tr>
                </tfoot>
              </Table>
              <Form.Group>
                <Form.Group>
                  <div className="formLabel">DESCUENTO (%)</div>
                  <div className="percent">
                    <Form.Control
                      min="0"
                      max="100"
                      value={descuento}
                      disabled={isDesc}
                      type="number"
                      placeholder="Ingrese porcentaje"
                      onChange={(e) => setDescuento(e.target.value)}
                    ></Form.Control>
                  </div>
                </Form.Group>
                <div className="formLabel">CONFIRMAR PRODUCTOS</div>
                <div className="percent">
                  <Button
                    variant="warning"
                    className="yellowLarge"
                    onClick={() => handleDiscount()}
                  >
                    Ir A Facturar
                  </Button>
                </div>
              </Form.Group>
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  );
}
