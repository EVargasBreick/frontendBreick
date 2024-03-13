import React, { useRef, useState } from "react";
import { Form, Button, Table, Modal, Image } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import { getClient } from "../services/clientServices";
import { useEffect } from "react";
import {
  getProductsWithStock,
  productsDiscount,
} from "../services/productServices";
import Cookies from "js-cookie";
import { dateString } from "../services/dateServices";
import { verifyQuantities } from "../services/saleServices";
import {
  getBranchesPs,
  getMobileSalePoints,
  getSalePoints,
} from "../services/storeServices";
import { otherPaymentsList } from "../services/invoiceServices";

import {
  complexDiscountFunction,
  complexNewDiscountFunction,
  processSeasonalDiscount,
  verifySeasonalProduct,
} from "../services/discountServices";
import FormSimpleRegisterClient from "./formSimpleRegisterClient";
import ComplexDiscountTable from "./complexDiscountTable";
import SpecialsTable from "./specialsTable";
import SaleModalAlt from "./saleModalAlt";
import {
  getDiscountType,
  getSeasonalDiscount,
} from "../services/discountEndpoints";
import SeasonalDiscountTable from "./seasonalDiscountTable";
import SinDescTable from "./sinDescTable";
import SaleModalNew from "./saleModalNew";
export default function FormRouteSaleNew() {
  const [discountType, setDiscountType] = useState("");
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
  const [isDesc, setIsDesc] = useState(false);
  const [discModal, setDiscModal] = useState(false);
  const [usuarioAct, setUsuarioAct] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [filtered, setFiltered] = useState("");
  const [willCreate, setWillCreate] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [discModalType, setDiscModalType] = useState(false);
  const [available, setAvailable] = useState([
    { nombreProducto: "Cargando..." },
  ]);
  const [isSaleModal, setIsSaleModal] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [auxProducts, setAuxProducts] = useState([]);
  const [sucursal, setSucursal] = useState("");
  const [branchInfo, setBranchInfo] = useState({});
  const [auxSelectedProducts, setAuxSelectedProducts] = useState("");
  const [idSelectedClient, setIdSelectedClient] = useState("");
  const [tipoDoc, setTipoDoc] = useState("");
  const [isQuantity, setIsQuantity] = useState(false);
  const [modalQuantity, setModalQuantity] = useState("");
  const [currentProd, setCurrentProd] = useState({});
  const [pointList, setPointList] = useState([]);
  const [pointOfSale, setPointOfsale] = useState("");
  const [isPoint, setIsPoint] = useState(false);
  const [otherPayments, setOtherPayments] = useState([]);
  const [tradicionales, setTradicionales] = useState([]);
  const [navidad, setNavidad] = useState([]);
  const [pascua, setPascua] = useState([]);
  const [halloween, setHalloween] = useState([]);
  const [especiales, setEspeciales] = useState([]);
  const [sinDesc, setSinDesc] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 700 ? false : true
  );
  const [ofp, setOfp] = useState(0);
  const [aPagar, setAPagar] = useState(0);
  const searchRef = useRef(null);
  const productRef = useRef(null);
  const [tradObject, setTradObject] = useState({});
  const [pasObject, setPasObject] = useState({});
  const [navObject, setNavObject] = useState({});
  const [hallObject, setHallObject] = useState({});
  const [descSimple, setDescSimple] = useState({});

  const quantref = useRef(null);
  const saleModalRef = useRef();
  const [clientEmail, setClientEmail] = useState("");

  const [seasonDiscountData, setSeasonDiscountData] = useState([]);
  const [isSeasonalModal, setIsSeasonalModal] = useState(false);

  const [seasonalProds, setSeasonalProds] = useState([]);
  const [seasonalSinDesc, setSeasonalSinDesc] = useState([]);
  const [seasonalSpecial, setSeasonalSpecial] = useState([]);
  const [seasonalTotals, setSeasonalTotals] = useState({});

  const [userData, setUserData] = useState({
    userId: "",
    userStore: "",
    userName: "",
    userCity: "",
  });

  const datosPaneton = [
    { codInterno: "715037", precio: 46.5 },
    { codInterno: "715038", precio: 88.0 },
  ];
  const tabletasArray = [
    "702000",
    "702001",
    "702002",
    "702003",
    "702004",
    "702005",
    "702006",
    "703003",
    "706000",
    "706001",
    "706002",
    "706003",
    "706004",
    "706005",
    "706006",
    "706007",
    "706008",
    "706011",
    "706012",
    "706013",
    "706014",
    "706015",
    "706016",
    "706017",
    "706018",
    "706019",
    "706020",
    "706027",
    "706028",
    "706029",
    "707001",
    "707002",
    "707003",
    "707004",
    "707005",
    "707006",
    "707007",
    "707008",
    "707009",
    "707010",
    "707011",
    "707013",
    "707014",
    "707015",
    "707016",
    "707017",
    "703001",
    "703002",
  ];

  async function listDiscounts(currentDate, tipo) {
    const discountList = await getSeasonalDiscount(currentDate, tipo);
    return discountList;
  }

  useEffect(() => {
    const dType = getDiscountType();
    dType.then((dt) => {
      setDiscountType(dt.data.idTipoDescuento);
    });
    searchRef.current.focus();

    const newly = Cookies.get("nit");
    if (newly) {
      setSearch(newly);
      Cookies.remove("nit");
    }
    const UsuarioAct = Cookies.get("userAuth");
    const parsedUser = JSON.parse(UsuarioAct);
    if (UsuarioAct) {
      const uData = {
        userName: parsedUser.usuario,
        userStore: parsedUser.idAlmacen,
        userId: parsedUser.idUsuario,
      };

      setUserData(uData);
      const PuntoDeVenta = Cookies.get("pdv");
      if (PuntoDeVenta) {
        setIsPoint(true);
        setPointOfsale(PuntoDeVenta);
      } else {
        const mobilepdvdata = getMobileSalePoints(parsedUser.idAlmacen);
        mobilepdvdata.then((res) => {
          const datos = res.data[0];
          if (datos == undefined) {
            setIsPoint(false);
          } else {
            setIsPoint(true);
            setPointOfsale(datos.nroPuntoDeVenta);
            Cookies.set("pdv", datos.nroPuntoDeVenta, { expires: 0.5 });
          }
        });
      }
      const pl = getSalePoints(parsedUser.idAlmacen);
      pl.then((res) => {
        setPointList([{ nroPuntoDeVenta: 0 }]);
      });
    }
    if (Cookies.get("userAuth")) {
      const otrosPagos = otherPaymentsList();
      otrosPagos
        .then((op) => {
          setOtherPayments(op.data);
        })
        .catch((err) => {
          console.log("Otros pagos?", err);
        });
      const disponibles = getProductsWithStock(parsedUser.idAlmacen, "all");
      disponibles.then((fetchedAvailable) => {
        const filtered = fetchedAvailable.data.filter(
          (fa) => fa.activo === 1 && fa.codInterno.length > 5
        );
        setAvailable(filtered);
        setAuxProducts(filtered);
      });
      const suc = getBranchesPs();
      suc.then((resp) => {
        const sucursales = resp.data;
        const sucur = sucursales.find((sc) => "AL001" == sc.idAgencia);
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
      const dl = productsDiscount(parsedUser.idUsuario);
      dl.then((res) => {
        setDiscountList(res.data.data);
      });
      const currentDate = dateString();
      const list = listDiscounts(currentDate, parsedUser.tipoUsuario);
      list.then((l) => {
        setSeasonDiscountData(l.data.data);
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
    if (isQuantity) {
      quantref.current.focus();
    }
  }, [isQuantity]);

  function searchClient(e) {
    e.preventDefault();
    setIsSelected(false);
    setClientes([]);
    setisLoading(true);
    const found = getClient(search);
    found.then((res) => {
      setIsClient(true);
      if (res.data.data.length > 0) {
        if (res.data.data.length == 1) {
          filterSelectedOnlyClient(res.data.data);
          setClientEmail(res.data.data[0].correo);
        } else {
          setClientes(res.data.data);
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

  function filterSelectedClient(id) {
    setSelectedClient(id);
    const searchObject = clientes.find((cli) => cli.idCliente === id);
    const array = [];
    array.push(searchObject);
    setClientes(array);
    setIsSelected(true);
    setIdSelectedClient(searchObject.idCliente);
    setClientEmail(searchObject.correo);
    setTipoDoc(searchObject.tipoDocumento);

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

  function addProductToList(product) {
    const produc = JSON.parse(product);
    const isTableta = tabletasArray.includes(produc.codInterno);
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
      const isPaneton = datosPaneton.find(
        (dp) => dp.codInterno == produc.codInterno
      );

      const precioElegido = isPaneton
        ? isPaneton.precio
        : isTableta
        ? produc.precioDeFabrica * 0.9
        : clientes[0]?.issuper == 1
        ? produc.precioSuper
        : produc.precioDeFabrica;

      const rounded =
        produc.unidadDeMedida == "Unidad"
          ? parseInt(modalQuantity)
          : Number(modalQuantity).toFixed(2);

      const productObj = {
        codInterno: produc.codInterno,
        cantProducto: rounded,
        codigoSin: produc.codigoSin,
        actividadEconomica: produc.actividadEconomica,
        codigoUnidad: produc.codigoUnidad,
        nombreProducto: produc.nombreProducto,
        idProducto: produc.idProducto,
        cant_Actual: produc.cant_Actual,
        cantidadRestante: produc.cant_Actual,
        precioDescuentoFijo: produc.precioDescuentoFijo,
        precioDeFabrica: precioElegido,
        descuentoProd: 0,
        totalProd: precioElegido * rounded,
        tipoProducto: produc.tipoProducto,
        unidadDeMedida: produc.unidadDeMedida,
      };
      setCurrentProd(productObj);
      setSelectedProducts([...selectedProducts, productObj]);
      setAuxSelectedProducts([...auxSelectedProducts, productObj]);
    }
    setFiltered("");
  }

  function addWithScanner(e) {
    e.preventDefault();
    const found = auxProducts.find(
      (ap) => ap.codInterno == filtered || ap.codigoBarras == filtered
    );
    if (found) {
      setCurrentProd(found);
      setIsQuantity(true);
      setFiltered("");
      setAvailable(auxProducts);
    } else {
      setAlert("Producto no encontrado");
      setIsAlert(true);
    }
  }

  function changeQuantitiesModal() {
    addProductToList(JSON.stringify(currentProd));
    setIsQuantity(false);
    setModalQuantity("");
    searchRef.current.focus();
  }

  function handleModalQuantity(cantidad) {
    console.log(Number(cantidad).toFixed(2));
    setModalQuantity(cantidad);
  }

  function changeQuantities(index, cantidad, prod) {
    const rounded =
      prod.unidadDeMedida == "Unidad"
        ? parseInt(cantidad)
        : Number(cantidad).toFixed(2);
    const total = Number(prod.precioDeFabrica * rounded).toFixed(2);
    let auxObj = {
      codInterno: prod.codInterno,
      cantProducto: rounded,
      codigoSin: prod.codigoSin,
      actividadEconomica: prod.actividadEconomica,
      codigoUnidad: prod.codigoUnidad,
      nombreProducto: prod.nombreProducto,
      idProducto: prod.idProducto,
      cant_Actual: prod.cant_Actual,
      cantidadRestante: prod.cant_Actual - cantidad,
      descuentoProd: total - total * (1 - descuento / 100),
      precioDeFabrica: Number(prod.precioDeFabrica).toFixed(2),
      precioDescuentoFijo: Number(prod.precioDescuentoFijo).toFixed(2),
      totalProd: total,
      tipoProducto: prod.tipoProducto,
      descuentoProd: 0,
      unidadDeMedida: prod.unidadDeMedida,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
    setAuxSelectedProducts(auxSelected);
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

  function handleModal() {
    if (isSelected) {
      setTimeout(() => {
        setIsInvoice(true);
        setIsSaleModal(true);
      }, 100);
    } else {
      setAlert("Por favor, seleccione un cliente");
      setIsAlert(true);
    }
  }

  function validateQuantities() {
    const validated = verifyQuantities(selectedProducts);
    validated
      .then(() => {
        verifySeasonal();
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

  async function processDiscounts() {
    const dType = await getDiscountType();
    const discountObject =
      dType.data.idTipoDescuento == 1
        ? complexDiscountFunction(selectedProducts, discountList)
        : complexNewDiscountFunction(selectedProducts, discountList);
    console.log("Discount object", discountObject);
    setTradObject(discountObject.tradicionales);
    setPasObject(discountObject.pascua);
    setNavObject(discountObject.navidad);
    setHallObject(discountObject.halloween);
    setTradicionales(discountObject.arrays.tradicionales);
    setPascua(discountObject.arrays.pascua);
    setNavidad(discountObject.arrays.navidad);
    setHalloween(discountObject.arrays.halloween);
    setSinDesc(discountObject.arrays.sinDesc);
    setEspeciales(discountObject.arrays.especiales);
    setTotalDesc(
      Number(discountObject.tradicionales.descCalculado) +
        Number(discountObject.pascua.descCalculado) +
        Number(discountObject.navidad.descCalculado) +
        Number(discountObject.halloween.descCalculado)
    );
    setTotalPrevio(
      Number(discountObject.tradicionales.total) +
        Number(discountObject.pascua.total) +
        Number(discountObject.navidad.total) +
        Number(discountObject.halloween.total)
    );
    setTotalFacturar(
      Number(discountObject.tradicionales.facturar) +
        Number(discountObject.pascua.facturar) +
        Number(discountObject.navidad.facturar) +
        Number(discountObject.halloween.facturar)
    );
    setDiscModal(true);
  }

  async function verifySeasonal() {
    if (seasonDiscountData.length > 0) {
      const verified = verifySeasonalProduct(
        selectedProducts,
        seasonDiscountData
      );
      console.log("Verified", verified);
      if (verified) {
        setDiscModalType(false);
        const data = await processSeasonalDiscount(
          selectedProducts,
          seasonDiscountData
        );
        console.log("Detalles descuento pedido", data);
        setTotalPrevio(data.totalesPedido.totalPedido);
        setTotalFacturar(data.totalesPedido.totalFacturar);
        setTotalDesc(data.totalesPedido.descCalculado);
        setDescuento(data.totalesPedido.descuento);
        setSeasonalSpecial(data.productArrays.especialDescProds);
        setSeasonalProds(data.productArrays.seasonProducts);
        setSeasonalSinDesc(data.productArrays.sinDescProds);
        setSeasonalTotals(data.totalesPedido);
        setIsSeasonalModal(true);
        setDiscModal(true);
        console.log("Data", data);
      } else {
        setDiscModalType(true);
        processDiscounts();
      }
    } else {
      setDiscModalType(true);
      processDiscounts();
    }
  }

  function cancelDiscounts() {
    setSelectedProducts(auxSelectedProducts);
    setDiscModal(false);
    setTradObject([]);
    setPasObject([]);
    setNavObject([]);
    setHallObject([]);
  }
  function test() {
    validateQuantities();
  }
  return (
    <div>
      <div className="formLabel">VENTAS RUTA</div>
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
        <Modal.Header className="modalHeader">INGRESE CANTIDAD</Modal.Header>
        <Modal.Body>
          <div className="productModal">{currentProd.nombreProducto}</div>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              changeQuantitiesModal(e.target[0].value);
            }}
          >
            <Form.Control
              type="number"
              onChange={(e) => handleModalQuantity(e.target.value)}
              required
              step={"any"}
              ref={quantref}
              value={modalQuantity}
              min={0}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer className="modalFooter">
          <Button variant="success" onClick={(e) => changeQuantitiesModal(e)}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={discModal} size="xl">
        <Modal.Header className="modalTitle">
          <Modal.Title>{`Descuentos por monto`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {discModalType ? (
            <div>
              <ComplexDiscountTable
                tradicionales={tradicionales}
                pascua={pascua}
                navidad={navidad}
                halloween={halloween}
                sinDesc={sinDesc}
                tradObject={tradObject}
                pasObject={pasObject}
                navObject={navObject}
                hallObject={hallObject}
              />
              <SpecialsTable
                especiales={especiales}
                totales={descSimple}
                isEsp={isSpecial}
              />
            </div>
          ) : (
            <div>
              <SeasonalDiscountTable
                seasonal={seasonalProds}
                sinDesc={seasonalSinDesc}
                totales={seasonalTotals}
              />
              <SpecialsTable
                especiales={seasonalSpecial}
                isSeasonalEsp={seasonalTotals.isDescEsp}
              />
              <SinDescTable sindDesc={sinDesc} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modalTitle">
          <Button variant="success" onClick={() => handleModal()}>
            Ir A Facturar
          </Button>
          <Button variant="danger" onClick={() => cancelDiscounts()}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {isInvoice ? (
        <div>
          <SaleModalNew
            aPagar={aPagar}
            branchInfo={branchInfo}
            clientId={selectedClient}
            datos={{
              descuento,
              descuentoCalculado: totalDesc,
              nit: clientes[0].nit,
              razonSocial: clientes[0].razonSocial,
              total: totalPrevio,
              totalDescontado: totalFacturar,
            }}
            emailCliente={clientEmail}
            isRoute={false}
            isSaleModal={isSaleModal}
            ofp={ofp}
            otherPayments={otherPayments}
            pointOfSale={pointOfSale}
            ref={saleModalRef}
            saleType="store"
            selectedProducts={selectedProducts}
            setAPagar={setAPagar}
            setAlert={setAlert}
            setIsAlert={setIsAlert}
            setIsInvoice={setIsInvoice}
            setIsSaleModal={setIsSaleModal}
            setOfp={setOfp}
            show={true}
            tipoDocumento={tipoDoc}
            updateStockBody={{
              idAlmacen: userData.userStore,
              productos: selectedProducts,
            }}
            userData={userData}
            isSeasonal={isSeasonalModal}
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
      <Form className="d-flex">
        <Form.Control
          ref={searchRef}
          type="search"
          placeholder="Ingrese Nit"
          className="me-2"
          aria-label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? searchClient(e) : null)}
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
                setCurrentProd(JSON.parse(e.target.value));
                setIsQuantity(true);
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
        <Form>
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
                              onClick={() =>
                                deleteProduct(index, sp.idProducto, sp)
                              }
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
                            placeholder="0"
                            value={sp.cantProducto}
                            onChange={(e) => {
                              changeQuantities(index, e.target.value, sp);
                            }}
                          />
                        </td>
                        <td className="smallTableColumn">
                          {parseFloat(sp.totalProd).toFixed(2)}
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
                      {`${selectedProducts
                        .reduce((accumulator, object) => {
                          return accumulator + parseFloat(object.totalProd);
                        }, 0)
                        .toFixed(2)} Bs.`}
                    </th>
                    <th className="smallTableColumn">
                      {isMobile ? "Total Descon tado" : "Total descontado: "}
                    </th>
                    <th className="smallTableColumn">{`${(
                      (selectedProducts.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.totalProd);
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
                      disabled={true}
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
                    onClick={() => test()}
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
