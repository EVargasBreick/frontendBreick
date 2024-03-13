import React, { useRef, useState } from "react";
import { Form, Button, Table, Modal, Image } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import { getClientConsigancion } from "../services/clientServices";
import { useEffect } from "react";
import {
  getProductsConsignacion,
  getProductsWithStock,
} from "../services/productServices";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { dateString } from "../services/dateServices";

import {
  createSale,
  deleteSale,
  verifyQuantities,
} from "../services/saleServices";
import {
  getBranchesPs,
  getMobileSalePoints,
  getSalePoints,
} from "../services/storeServices";
import {
  createInvoice,
  deleteInvoice,
  otherPaymentsList,
} from "../services/invoiceServices";

import { updateStock } from "../services/orderServices";
import FormSimpleRegisterClient from "./formSimpleRegisterClient";
import RecordModal from "./recordModal";

export default function FormRecordSaleNew() {
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
  const [usuarioAct, setUsuarioAct] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [filtered, setFiltered] = useState("");
  const [willCreate, setWillCreate] = useState(false);
  const [available, setAvailable] = useState([
    { nombreProducto: "Cargando..." },
  ]);
  const [isSaleModal, setIsSaleModal] = useState(true);
  const [ofp, setOfp] = useState(0);
  const [aPagar, setAPagar] = useState(0);
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
  const [auxProducts, setAuxProducts] = useState([]);
  const [branchInfo, setBranchInfo] = useState({});
  const [invoice, setInvoice] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [auxSelectedProducts, setAuxSelectedProducts] = useState("");
  const [idSelectedClient, setIdSelectedClient] = useState("");
  const [userName, setUserName] = useState("");
  const [tipoDoc, setTipoDoc] = useState("");
  const [isQuantity, setIsQuantity] = useState(false);
  const [modalQuantity, setModalQuantity] = useState("");
  const [currentProd, setCurrentProd] = useState({});
  const [pointList, setPointList] = useState([]);
  const [pointOfSale, setPointOfsale] = useState("");
  const [isPoint, setIsPoint] = useState(false);
  const [otherPayments, setOtherPayments] = useState([]);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 700 ? false : true
  );
  const [isMore, setIsMore] = useState(false);
  const [giftCard, setGiftCard] = useState(0);
  const [city, setCity] = useState("");
  const [isRoaming, setIsRoaming] = useState(false);
  const searchRef = useRef(null);
  const productRef = useRef(null);
  const quantref = useRef(null);
  const saleModalRef = useRef();
  const [clientEmail, setClientEmail] = useState("");
  useEffect(() => {
    console.log(
      "Es isla?",
      JSON.parse(Cookies.get("userAuth")).idAlmacen === "AG009"
    );
    searchRef.current.focus();
    //const spplited = dateString().split(" ");

    const newly = Cookies.get("nit");
    if (newly) {
      setSearch(newly);
      Cookies.remove("nit");
    }
    const UsuarioAct = Cookies.get("userAuth");

    if (UsuarioAct) {
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      var data;
      const PuntoDeVenta = Cookies.get("pdv");
      console.log("Datos punto de venta", PuntoDeVenta);
      if (PuntoDeVenta == undefined) {
        console.log("True test for undefined");
      }
      if (PuntoDeVenta) {
        setIsPoint(true);
        setPointOfsale(PuntoDeVenta);
      } else {
        const mobilepdvdata = getMobileSalePoints(
          JSON.parse(UsuarioAct).idAlmacen
        );
        mobilepdvdata.then((res) => {
          const datos = res.data[0];
          data = datos;
          console.log("Datos del punto de venta", datos);
          if (datos == undefined) {
            setIsPoint(false);
          } else {
            setIsRoaming(true);
            setIsPoint(true);
            setPointOfsale(datos.nroPuntoDeVenta);
            Cookies.set("pdv", datos.nroPuntoDeVenta, { expires: 0.5 });
          }
        });
      }
      console.log("Almacen", JSON.parse(UsuarioAct).idAlmacen);
      if (JSON.parse(UsuarioAct).idAlmacen === "AG009") {
        setIsMore(true);
      }
      setUserName(JSON.parse(UsuarioAct).usuario);
      setCity(JSON.parse(UsuarioAct).idDepto);
      const pl = getSalePoints(JSON.parse(UsuarioAct).idAlmacen);
      pl.then((res) => {
        setPointList(res.data);
      });
      const suc = getBranchesPs();
      suc.then((resp) => {
        const sucursales = resp.data;
        const alm = JSON.parse(Cookies.get("userAuth")).idAlmacen;
        console.log("Dataaa", data);
        const sucur =
          sucursales.find((sc) => alm == sc.idAgencia) == undefined
            ? sucursales.find((sc) => "AL001" == sc.idAgencia)
            : sucursales.find((sc) => alm == sc.idAgencia);
        console.log("Sucur", sucur);
        const branchData = {
          nombre: sucur.nombre,
          dir: sucur.direccion,
          tel: sucur.telefono,
          ciudad: sucur.ciudad,
          nro: sucur.idImpuestos,
        };
        setBranchInfo(branchData);
      });
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      const otrosPagos = otherPaymentsList();
      otrosPagos
        .then((op) => {
          console.log("Lista de otros pagos", op.data);
          setOtherPayments(op.data);
        })
        .catch((err) => {
          console.log("Otros pagos?", err);
        });
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize(); // set the initial state on mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    setTotalFacturar(totalFacturar * (1 - descuento / 100));
    setTotalDesc(totalFacturar - totalFacturar * (1 - descuento / 100));
  }, [descuento]);
  useEffect(() => {
    if (isQuantity) {
      quantref.current.focus();
    }
  }, [isQuantity]);

  function searchClient() {
    setIsSelected(false);
    setClientes([]);
    setisLoading(true);
    const found = getClientConsigancion(search);
    found.then(async (res) => {
      console.log("Data", res.data);
      setIsClient(true);
      if (res.data.length > 0) {
        if (res.data.length == 1) {
          filterSelectedOnlyClient(res.data);
          setClientEmail(res.data[0].correo);

          const { data } = await getProductsConsignacion(
            res.data[0].nit,
            res.data[0].idZona
          );

          const disponibles = JSON.parse(data);
          const filtered = disponibles.filter((fa) => fa.activo === 1);
          setAvailable(filtered);
          setAuxProducts(filtered);
        } else {
          setClientes(res.data);
        }
        setisLoading(false);
      } else {
        setIsClient(false);
        setWillCreate(true);
        setIsAlert(true);
        setAlert("Cliente no encontrado");
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
    if (newList.length == 1) {
    }
    setAvailable([...newList]);
  }

  async function filterSelectedClient(id) {
    setSelectedClient(id);
    const searchObject = clientes.find((cli) => cli.idCliente === id);
    console.log("TCL: filterSelectedClient -> searchObject", searchObject);
    const array = [];
    array.push(searchObject);
    setClientes(array);
    setIsSelected(true);
    setIdSelectedClient(searchObject.idCliente);
    setTipoDoc(searchObject.tipoDocumento);
    setClientEmail(searchObject.correo);
    const { data } = await getProductsConsignacion(
      searchObject.nit,
      searchObject.idZona
    );

    const disponibles = JSON.parse(data);
    console.log("TCL: filterSelectedClient -> disponibles", disponibles);
    const filtered = disponibles.filter((fa) => fa.activo === 1);
    setAvailable(filtered);
    setAuxProducts(filtered);
    productRef.current.focus();
  }
  function filterSelectedOnlyClient(cliente) {
    const client = cliente[0];
    setSelectedClient(client.idCliente);
    setClientes(cliente);
    setIsSelected(true);
    setIdSelectedClient(client.idCliente);
    setTipoDoc(client.tipoDocumento);

    productRef.current.focus();
  }

  function addProductToList(action, product) {
    if (action == "manual") {
      const produc = JSON.parse(product);
      var aux = false;

      selectedProducts.map((sp) => {
        if (sp.codInterno === produc.codInterno) {
          setIsQuantity(false);
          setAlert("El producto ya se encuentra seleccionado");
          setIsAlert(true);
          aux = true;
        }
      });
      if (!aux) {
        const productObj = {
          codInterno: produc.codInterno,
          cantProducto: 1,
          codigoSin: produc.codigoSin,
          actividadEconomica: produc.actividadEconomica,
          codigoUnidad: produc.codigoUnidad,
          nombreProducto: produc.nombreProducto,
          idProducto: produc.idProducto,
          cant_Actual: produc.cant_Actual,
          cantidadRestante: produc.cant_Actual,
          precioDescuentoFijo: produc.precioDescuentoFijo,
          precioDeFabrica: clientes[0]?.issuper
            ? produc.precioSuper
            : JSON.parse(Cookies.get("userAuth")).idAlmacen === "AG009"
            ? produc.precioPDV
            : produc.precioDeFabrica,
          descuentoProd: 0,
          total: clientes[0]?.issuper
            ? produc.precioSuper
            : JSON.parse(Cookies.get("userAuth")).idAlmacen === "AG009"
            ? produc.precioPDV
            : produc.precioDeFabrica,
          tipoProducto: produc.tipoProducto,
          unidadDeMedida: produc.unidadDeMedida,
        };
        setCurrentProd(productObj);
        setSelectedProducts([...selectedProducts, productObj]);
        setAuxSelectedProducts([...auxSelectedProducts, productObj]);
      }
      setIsQuantity(true);
    } else {
      setModalQuantity("");
      const selected = available.find(
        (pr) =>
          pr.codigoBarras === filtered ||
          pr.codInterno == filtered ||
          pr.nombreProducto.toLowerCase().includes(filtered.toLowerCase())
      );
      console.log("Selected", selected);
      if (selected != undefined) {
        var aux = false;
        selectedProducts.map((sp) => {
          if (sp.codInterno === selected.codInterno) {
            const indexSelected = selectedProducts.indexOf(sp);
            const added = parseInt(sp.cantProducto) + 1;
            changeQuantities(indexSelected, added, sp, true);
            aux = true;
          }
        });
        if (!aux) {
          const productObj = {
            codInterno: selected.codInterno,
            cantProducto: 1,
            codigoSin: selected.codigoSin,
            actividadEconomica: selected.actividadEconomica,
            codigoUnidad: selected.codigoUnidad,
            nombreProducto: selected.nombreProducto,
            idProducto: selected.idProducto,
            cant_Actual: selected.cant_Actual,
            cantidadRestante: selected.cant_Actual,
            precioDeFabrica: clientes[0]?.issuper
              ? selected.precioSuper
              : JSON.parse(Cookies.get("userAuth")).idAlmacen === "AG009"
              ? selected.precioPDV
              : selected.precioDeFabrica,
            precioDescuentoFijo: selected.precioDescuentoFijo,
            descuentoProd: 0,
            total: clientes[0]?.issuper
              ? selected.precioSuper
              : JSON.parse(Cookies.get("userAuth")).idAlmacen === "AG009"
              ? selected.precioPDV
              : selected.precioDeFabrica,
            tipoProducto: selected.tipoProducto,
            unidadDeMedida: selected.unidadDeMedida,
          };
          setCurrentProd(productObj);
          setSelectedProducts([...selectedProducts, productObj]);
          setAuxSelectedProducts([...auxSelectedProducts, productObj]);
        }

        setFiltered("");
        setIsQuantity(true);
      } else {
        setAlert("Producto No Encontrado");
        setIsAlert(true);
      }
    }
  }
  function changeQuantitiesModal(e) {
    // e.preventDefault();
    const index = selectedProducts.length - 1;
    const selectedProd = selectedProducts[index];
    changeQuantities(index, modalQuantity, selectedProd, false);
    setIsQuantity(false);
    setModalQuantity("");
    setAvailable(auxProducts);

    searchRef.current.focus();
  }

  function handleModalQuantity(cantidad) {
    setModalQuantity(cantidad);
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

    addProductToList("scanner");
  }
  function changeQuantities(index, cantidad, prod, isScanner) {
    console.log("Cantidad entrando al cambio", cantidad);
    const arrCant = !isScanner ? cantidad.split(".") : cantidad;
    const isThree =
      cantidad === ""
        ? ""
        : arrCant[1]?.length > process.env.REACT_APP_DECIMALES
        ? parseFloat(cantidad).toFixed(2)
        : cantidad;
    const total = parseFloat(
      parseFloat(prod.precioDeFabrica).toFixed(2) *
        (prod.unidadDeMedida == "Unidad" ? parseInt(isThree) : isThree)
    ).toFixed(2);
    let auxObj = {
      codInterno: prod.codInterno,
      cantProducto:
        prod.unidadDeMedida == "Unidad" ? parseInt(isThree) : isThree,
      codigoSin: prod.codigoSin,
      actividadEconomica: prod.actividadEconomica,
      codigoUnidad: prod.codigoUnidad,
      nombreProducto: prod.nombreProducto,
      idProducto: prod.idProducto,
      cant_Actual: prod.cant_Actual,
      cantidadRestante: prod.cant_Actual - cantidad,
      descuentoProd: total - total * (1 - descuento / 100),
      precioDeFabrica: parseFloat(prod.precioDeFabrica).toFixed(2),
      precioDescuentoFijo: parseFloat(prod.precioDescuentoFijo).toFixed(2),
      total: total,
      unidadDeMedida: prod.unidadDeMedida,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
    setAuxSelectedProducts(auxSelected);
  }
  function handleModal() {
    if (isSelected) {
      const totPrev = parseFloat(
        auxSelectedProducts.reduce((accumulator, object) => {
          return accumulator + Number(object.total);
        }, 0)
      ).toFixed(2);
      const totDesc = totPrev * (1 - descuento / 100);
      setTotalPrevio(Number(totPrev).toFixed(2));
      setTotalDesc((Number(totPrev) - Number(totDesc))?.toFixed(2));
      setTotalFacturar(Number(totDesc).toFixed(2));
      setTimeout(() => {
        setIsInvoice(true);
        setIsSaleModal(true);
      }, 100);
    } else {
      setAlert("Por favor, seleccione un cliente");
      setIsAlert(true);
    }
  }

  function handleDiscount() {
    console.log("Descuento", descuento);
    handleModal();
    /*if (city == 1) {
      const newDiscount = verifyAutomaticDiscount(selectedProducts, descuento);
      newDiscount.then((nd) => {
        console.log("Descuento", descuento);
        setDescuento(nd);
        const discountedProds = saleDiscount(selectedProducts, nd);
        discountedProds.then((res) => {
          setSelectedProducts(res);
          handleModal();
        });
      });
    } else {
      handleModal();
    }*/
  }

  function validateQuantities() {
    const validated = verifyQuantities(selectedProducts);
    validated
      .then(() => {
        handleDiscount();
      })
      .catch((err) => {
        setAlert(err);
        setIsAlert(true);
      });
  }
  function createNewClient(e) {
    e.preventDefault();
    setIsCreate(true);
  }
  function handleSalePoint(id) {
    setPointOfsale(id);
    Cookies.set("pdv", id, { expires: 0.5 });
    setIsPoint(true);
  }
  return (
    <div>
      <div className="formLabel">FACTURAR CONSIGNACION</div>
      <Modal show={!isPoint}>
        <Modal.Header className="modalHeader">Seleccion de Caja</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Select
              onChange={(e) => {
                handleSalePoint(e.target.value);
              }}
            >
              <option>Seleccione una caja</option>
              {pointList.map((pl, index) => {
                return (
                  <option value={pl.nroPuntoDeVenta} key={index}>{`Caja ${
                    pl.nroPuntoDeVenta + 1
                  }`}</option>
                );
              })}
            </Form.Select>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={isQuantity}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            changeQuantitiesModal(e.target[0].value);
          }}
        >
          <Modal.Header className="modalHeader">INGRESE CANTIDAD</Modal.Header>
          <Modal.Body>
            <div className="productModal">{currentProd.nombreProducto}</div>
            <Form.Control
              type="number"
              onChange={(e) => handleModalQuantity(e.target.value)}
              required
              step={"any"}
              ref={quantref}
              value={modalQuantity}
              min={0}
            />
          </Modal.Body>
          <Modal.Footer className="modalFooter">
            <Button variant="success" type="submit">
              Confirmar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {isInvoice ? (
        <div>
          <RecordModal
            aPagar={aPagar}
            branchInfo={branchInfo}
            clientId={idSelectedClient}
            datos={{
              descuento,
              descuentoCalculado: totalDesc,
              idZona: clientes[0].idZona,
              nit: clientes[0].nit,
              razonSocial: clientes[0].razonSocial,
              total: totalPrevio,
              totalDescontado: totalFacturar,
            }}
            emailCliente={clientEmail}
            fechaHora={fechaHora}
            invoiceBody={{
              aPagar: aPagar,
              cuf: "",
              cufd: "",
              desembolsada: 0,
              fechaEmision: "",
              fechaHora: dateString(),
              idAgencia: userStore,
              idCliente: selectedClient,
              nroFactura: 0,
              nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
              nroTransaccion: 0,
              nitCliente: clientes[0].nit,
              nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
              pagado: cancelado,
              puntoDeVenta: pointOfSale,
              razonSocial: clientes[0].razonSocial,
              tipoPago: tipoPago,
            }}
            isRoute={true}
            isSaleModal={isSaleModal}
            otherPayments={otherPayments}
            pointOfSale={pointOfSale}
            ref={saleModalRef}
            saleBody={{
              pedido: {
                descCalculado: totalDesc,
                descuento: descuento,
                fechaActualizacion: dateString(),
                fechaCrea: dateString(),
                idCliente: selectedClient,
                idFactura: 0,
                idPedido: "",
                idUsuarioCrea: usuarioAct,
                montoFacturar: totalFacturar,
                montoTotal: parseFloat(totalPrevio).toFixed(2),
              },
              productos: selectedProducts,
            }}
            selectedProducts={selectedProducts}
            setAPagar={setAPagar}
            setAlert={setAlert}
            setDescuento={setDescuento}
            setIsAlert={setIsAlert}
            setIsInvoice={setIsInvoice}
            setIsSaleModal={setIsSaleModal}
            setTotalDesc={setTotalDesc}
            setTotalFacturar={setTotalFacturar}
            setTotalPrevio={setTotalPrevio}
            tipoDocumento={tipoDoc}
            updateStockBody={{
              idAlmacen: userStore,
              productos: selectedProducts,
            }}
            userId={usuarioAct}
            userName={userName}
            userStore={userStore}
          />
        </div>
      ) : null}
      <Modal
        show={isAlert}
        onHide={handleClose}
        onKeyDown={(e) =>
          e.key === "Enter" && willCreate ? createNewClient(e) : null
        }
      >
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
      <Modal show={isCreate} size="lg">
        <Modal.Header>
          <Modal.Title>Clientes</Modal.Title>
        </Modal.Header>
        <Modal.Body className="formModalAlt">
          <FormSimpleRegisterClient
            isModal={true}
            idUsuario={usuarioAct}
            nit={search}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Form
        className="d-flex"
        onSubmit={(e) => {
          e.preventDefault();
          searchClient();
        }}
      >
        <Form.Control
          ref={searchRef}
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
          onClick={(e) => searchClient(e)}
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
                <th className="tableColumn">Departamento</th>
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
                    <td className="tableColumn">{client.departamento}</td>
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
              <option>Seleccionar Producto</option>
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
              ref={productRef}
              type="text"
              placeholder="Buscar"
              value={filtered}
              onChange={(e) => filterProducts(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>
      </div>
      <div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validateQuantities();
          }}
        >
          {selectedProducts.length > 0 ? (
            <div className="tableOne">
              <Table>
                <thead>
                  <tr className="tableHeader">
                    <th className="smallTableColumnalt"></th>
                    {isMobile ? (
                      <th className="smallTableColumn">Producto</th>
                    ) : (
                      <th className="smallTableColumn">Codigo</th>
                    )}
                    {!isMobile ? (
                      <th className="smallTableColumn">Producto</th>
                    ) : null}

                    <th className="smallTableColumn">Precio Unidad /Kg</th>
                    <th className="smallTableColumn">{`${
                      isMobile ? "Cant" : "Cantidad"
                    } /Peso (Gr)`}</th>
                    <th className="smallTableColumn">Total</th>
                    <th className="smallTableColumn">
                      {isMobile ? "Cant Disp" : "Cantidad Disponible"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...selectedProducts].map((sp, index) => {
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="smallTableColumnalt">
                          <div>
                            <Button
                              onSubmit={(e) => e.preventDefault()}
                              variant="danger"
                              className="tableButtonAlt"
                              onClick={() => deleteProduct(index)}
                            >
                              {isMobile ? "X" : "Quitar"}
                            </Button>
                          </div>
                        </td>
                        {isMobile ? (
                          <td className="smallTableColumn">{`${sp.codInterno} ${sp.nombreProducto}`}</td>
                        ) : (
                          <td className="smallTableColumn">{`${sp.codInterno}`}</td>
                        )}
                        {!isMobile ? (
                          <td className="smallTableColumn">
                            {sp.nombreProducto}
                          </td>
                        ) : null}

                        <td className="smallTableColumn">{`${sp.precioDeFabrica} Bs.`}</td>
                        <td className="smallTableColumn">
                          <Form.Control
                            className="smallInput"
                            type="number"
                            min="0"
                            step={"any"}
                            required
                            placeholder="Ingresar Valor"
                            value={sp.cantProducto}
                            onChange={(e) => {
                              changeQuantities(index, e.target.value, sp);
                            }}
                          />
                        </td>
                        <td className="smallTableColumn">
                          {parseFloat(sp.total).toFixed(2)}
                        </td>
                        <td className="smallTableColumn">
                          {sp.unidadDeMedida == "Unidad"
                            ? parseFloat(sp.cant_Actual).toFixed(0)
                            : parseFloat(sp.cant_Actual).toFixed(3)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="tableHeader">
                    {!isMobile ? (
                      <th className="smallTableColumnalt"></th>
                    ) : null}
                    <th className="smallTableColumnalt"></th>
                    <th></th>
                    <th className="smallTableColumn">{"Total: "}</th>
                    <th className="smallTableColumn">
                      {`${selectedProducts.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.total);
                      }, 0)} Bs.`}
                    </th>
                    <th className="smallTableColumn">
                      {isMobile ? "Total Descon tado" : "Total descontado: "}
                    </th>
                    <th className="smallTableColumn">{`${
                      (selectedProducts.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.total);
                      }, 0) *
                        (100 - descuento)) /
                      100
                    }
                     Bs.`}</th>
                  </tr>
                </tfoot>
              </Table>
              <Form.Group>
                <div className="formLabel">CONFIRMAR PRODUCTOS</div>
                <div className="percent">
                  <Button
                    variant="warning"
                    className="yellowLarge"
                    type="submit"
                    // onClick={() => ()}
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