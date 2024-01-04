import React, { useState, useRef } from "react";
import { Form, Button, Table, Modal, Image } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";
import { getClient } from "../services/clientServices";
import { useEffect } from "react";
import {
  availableProducts,
  getProducts,
  getProductsWithStock,
  getUserStock,
  logShortage,
  productsDiscount,
  setTotalProductsToZero,
  updateForMissing,
  updateForMissingSample,
} from "../services/productServices";
import Cookies from "js-cookie";
import {
  availabilityInterval,
  createOrder,
  createOrderTransaction,
  deleteOrder,
  getOrderList,
  logOrderUpdate,
  sendOrderEmail,
  updateVirtualStock,
} from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { dateString } from "../services/dateServices";
import {
  addProductDiscounts,
  addProductDiscSimple,
  christmassDiscounts,
  complexDiscountFunction,
  complexNewDiscountFunction,
  discountByAmount,
  easterDiscounts,
  halloweenDiscounts,
  manualAutomaticDiscount,
  newDiscountByAmount,
  processSeasonalDiscount,
  traditionalDiscounts,
  verifySeasonalProduct,
} from "../services/discountServices";
import ComplexDiscountTable from "./complexDiscountTable";
import SimpleDiscountTable from "./simpleDiscountTable";
import SpecialsTable from "./specialsTable";
import SinDescTable from "./sinDescTable";
import {
  getDiscountType,
  getSeasonalDiscount,
} from "../services/discountEndpoints";
import SeasonalDiscountTable from "./seasonalDiscountTable";
import { InputGroup } from "react-bootstrap";
import { userService } from "../services/userServices";
export default function FormNewOrder() {
  const [isClient, setIsClient] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isLoading, setisLoading] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [selectedProds, setSelectedProds] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [totalDesc, setTotalDesc] = useState(0);
  const [totalPrevio, setTotalPrevio] = useState(0);
  const [totalFacturar, setTotalFacturar] = useState(0);
  const [tipo, setTipo] = useState("normal");
  const [isDesc, setIsDesc] = useState(false);
  const [pedidoFinal, setPedidoFinal] = useState({});
  const [usuarioAct, setUsuarioAct] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [available, setAvailable] = useState([]);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userStore, setUserStore] = useState("");
  const [discountList, setDiscountList] = useState([]);
  const [tradicionales, setTradicionales] = useState([]);
  const [navidad, setNavidad] = useState([]);
  const [pascua, setPascua] = useState([]);
  const [halloween, setHalloween] = useState([]);
  const [especiales, setEspeciales] = useState([]);
  const [sinDesc, setSinDesc] = useState([]);
  const [discModal, setDiscModal] = useState(false);
  const [tradObject, setTradObject] = useState({});
  const [pasObject, setPasObject] = useState({});
  const [navObject, setNavObject] = useState({});
  const [hallObject, setHallObject] = useState({});
  const [descSimple, setDescSimple] = useState({});
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [discModalType, setDiscModalType] = useState(true);
  const [filtered, setFiltered] = useState("");
  const [auxProds, setAuxProds] = useState([]);
  const [auxProducts, setAuxProducts] = useState([]);
  const [isSpecial, setIsSpecial] = useState(false);
  const [faltantes, setFaltantes] = useState([]);
  const [flagDiscount, setFlagDiscount] = useState(false);
  const [userName, setUserName] = useState("");
  const [isInterior, setIsInterior] = useState(false);
  const [isQuantity, setIsQuantity] = useState(false);
  const [modalQuantity, setModalQuantity] = useState("");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 700 ? false : true
  );
  const [currentProd, setCurrentProd] = useState("");
  const searchRef = useRef(null);
  const quantref = useRef(null);
  const prodTableRef = useRef(null);
  const productRef = useRef([]);
  const [clientInfo, setClientInfo] = useState({});
  const [seasonDiscountData, setSeasonDiscountData] = useState([]);
  const [isSeasonalModal, setIsSeasonalModal] = useState(false);
  async function listDiscounts(currentDate, tipo) {
    const discountList = await getSeasonalDiscount(currentDate, tipo);
    return discountList;
  }

  const [seasonalProds, setSeasonalProds] = useState([]);
  const [seasonalSinDesc, setSeasonalSinDesc] = useState([]);
  const [seasonalSpecial, setSeasonalSpecial] = useState([]);
  const [seasonalTotals, setSeasonalTotals] = useState({});

  const [discountType, setDiscountType] = useState("");

  const datosPaneton = [
    { codInterno: "715037", precio: 46.5 },
    { codInterno: "715038", precio: 88.0 },
  ];

  useEffect(() => {
    const dType = getDiscountType();
    dType.then((dt) => {
      console.log("Tipo de descuento", dt.data);
      setDiscountType(dt.data.idTipoDescuento);
    });

    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      if (JSON.parse(UsuarioAct).idDepto != 1) {
        setIsInterior(true);
      }
      setUserName(
        `${JSON.parse(UsuarioAct).nombre.substring(0, 1)}${
          JSON.parse(UsuarioAct).apPaterno
        }`
      );
      const currentDate = dateString();
      const list = listDiscounts(
        currentDate,
        JSON.parse(UsuarioAct).tipoUsuario
      );
      list.then((l) => {
        console.log("Descuento de temporada", l.data.data);
        setSeasonDiscountData(l.data.data);
      });
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      setTipoUsuario(JSON.parse(Cookies.get("userAuth")).tipoUsuario);
      const disponibles = availableProducts(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      disponibles.then((fetchedAvailable) => {
        const filtered = fetchedAvailable.data.data.filter(
          (product) => product.cant_Actual > 0 && product.activo === 1
        );
        //console.log("Productos disponibles", filtered);
        setAvailable(filtered);
        setAuxProducts(filtered);
        productRef.current = filtered;
      });
      const dl = productsDiscount(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      dl.then((res) => {
        setDiscountList(res.data.data);
      });
      /*const interval = setInterval(() => {
        const disponibles = availableProducts(
          JSON.parse(Cookies.get("userAuth")).idUsuario
        );
        disponibles.then((fetchedAvailable) => {
          
          setAvailable(fetchedAvailable.data.data[0]);
        });
      }, 300000);*/
    }
  }, []);

  function updateCurrentStock() {
    setAvailable([]);
    setAuxProducts([]);
    const disponibles = availableProducts(
      JSON.parse(Cookies.get("userAuth")).idUsuario
    );
    disponibles.then((fetchedAvailable) => {
      const filtered = fetchedAvailable.data.data.filter(
        (product) => product.cant_Actual > 0 && product.activo === 1
      );
      console.log("Productos disponibles", filtered);
      setAvailable(filtered);
      setAuxProducts(filtered);
    });
  }

  useEffect(() => {
    if (isQuantity) {
      quantref.current.focus();
    }
  }, [isQuantity]);

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
    if (flagDiscount) {
      verifySeasonal();
    }
  }, [flagDiscount]);
  function searchClient(e) {
    e.preventDefault();
    setIsSelected(false);
    setClientes([]);
    setisLoading(true);
    const found = getClient(search);

    found.then((res) => {
      setIsClient(true);
      if (res.data.data) {
        setClientes(res.data.data);
        setisLoading(false);
      } else {
        setIsClient(false);
        setIsAlert(true);
        setAlert("Usuario no encontrado");
      }
    });
  }
  function filterSelectedClient(id) {
    setSelectedClient(id);
    const searchObject = clientes.find((cli) => cli.idCliente === id);
    console.log("cliente", searchObject);
    setClientInfo({
      idZona: searchObject.idZona,
      nitCliente: searchObject.nit,
    });
    const array = [];
    array.push(searchObject);
    setClientes(array);
    setIsSelected(true);
    prodTableRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function updateCurrentStock() {
    setAvailable([]);
    setAuxProducts([]);
    const UsuarioAct = Cookies.get("userAuth");
    const prods = availableProducts(JSON.parse(UsuarioAct).idUsuario);
    prods.then((product) => {
      console.log("TESTEANDO ACA", product);
      const available = product.data.data.filter((prod) => prod.activo === 1);
      console.log("disponibles", available);
      setAvailable(available);
      setAuxProducts(available);
    });
  }

  function selectProduct(product) {
    const parsed = JSON.parse(product);
    var aux = false;
    console.log("Is super?", clientes[0]?.issuper == 1);
    const prodObj = {
      cantPrevia: 0,
      cantProducto: 0,
      cant_Actual: parsed.cant_Actual,
      codInterno: parsed.codInterno,
      idProducto: parsed.idProducto,
      nombreProducto: parsed.nombreProducto,
      precioDeFabrica:
        clientes[0]?.issuper == 1 ? parsed.precioSuper : parsed.precioDeFabrica,
      precioDescuentoFijo: parsed.precioDescuentoFijo,
      codigoBarras: parsed.codigoBarras,
      totalProd: 0,
      totalDescFijo: 0,
      tipoProducto: parsed.tipoProducto,
      descuentoProd: 0,
      unidadDeMedida: parsed.unidadDeMedida,
    };
    selectedProds.map((sp) => {
      if (sp.codInterno === JSON.parse(product).codInterno) {
        aux = true;
      }
    });
    if (!aux) {
      switch (parsed.tipoProducto) {
        case 1:
          setTradicionales([...tradicionales, prodObj]);
          break;
        case 2:
          setPascua([...pascua, prodObj]);
          break;
        case 3:
          setNavidad([...navidad, prodObj]);
          break;
        case 4:
          setHalloween([...halloween, prodObj]);
          break;
        case 5:
          setSinDesc([...sinDesc, prodObj]);
          break;
        case 6:
          setEspeciales([...especiales, prodObj]);
          break;
      }

      setSelectedProds([...selectedProds, prodObj]);
    }
    setCurrentProd(prodObj);
    setIsProduct(true);
    setIsQuantity(true);
  }
  const handleClose = () => {
    setIsAlert(false);
    setisLoading(false);
    setDiscModal(false);
  };
  function deleteProduct(index, cod, prod) {
    const auxArray = [...selectedProds];
    auxArray.splice(index, 1);
    setSelectedProds(auxArray);
    switch (prod.tipoProducto) {
      case 1:
        const tindex = tradicionales.findIndex((td) => td.idProducto == cod);
        const taux = [...tradicionales];
        taux.splice(tindex, 1);
        setTradicionales(taux);
        break;
      case 2:
        const pindex = pascua.findIndex((ps) => ps.idProducto == cod);
        const paux = [...pascua];
        paux.splice(pindex, 1);
        setPascua(paux);
        break;
      case 3:
        const nindex = navidad.findIndex((nv) => nv.idProducto == cod);
        const naux = [...navidad];
        naux.splice(nindex, 1);
        setNavidad(naux);
        break;
      case 4:
        const hindex = halloween.findIndex((hl) => hl.idProducto == cod);
        const haux = [...halloween];
        haux.splice(hindex, 1);
        setHalloween(haux);
        break;
      case 5:
        const sindex = sinDesc.findIndex((sd) => sd.idProducto == cod);
        const saux = [...sinDesc];
        saux.splice(sindex, 1);
        setSinDesc(saux);
        break;
      case 6:
        const eindex = especiales.findIndex((ep) => ep.idProducto == cod);
        const eaux = [...especiales];
        eaux.splice(eindex, 1);
        setEspeciales(eaux);
        break;
    }
  }
  function changeQuantitys(index, cantidades, prod) {
    let auxObj = {
      cant_Actual: prod.cant_Actual,
      cantPrevia: prod.cantPrevia,
      cantProducto: cantidades,
      codInterno: prod.codInterno,
      codigoBarras: prod.codigoBarras,
      idProducto: prod.idProducto,
      nombreProducto: prod.nombreProducto,
      precioDeFabrica: prod.precioDeFabrica,
      precioDescuentoFijo: prod.precioDescuentoFijo,
      totalProd: cantidades * prod.precioDeFabrica,
      totalDescFijo: cantidades * prod.precioDescuentoFijo,
      tipoProducto: prod.tipoProducto,
      descuentoProd: 0,
      unidadDeMedida: prod.unidadDeMedida,
    };
    let auxSelected = [...selectedProds];
    auxSelected[index] = auxObj;
    setSelectedProds(auxSelected);

    switch (prod.tipoProducto) {
      case 1:
        const tindex = tradicionales.findIndex(
          (td) => td.idProducto == prod.idProducto
        );
        const taux = [...tradicionales];
        taux[tindex] = auxObj;
        setTradicionales(taux);
        break;
      case 2:
        const pindex = pascua.findIndex(
          (ps) => ps.idProducto == prod.idProducto
        );
        const paux = [...pascua];
        paux[pindex] = auxObj;
        setPascua(paux);
        break;
      case 3:
        const nindex = navidad.findIndex(
          (nv) => nv.idProducto == prod.idProducto
        );
        const naux = [...navidad];
        naux[nindex] = auxObj;
        setNavidad(naux);
        break;
      case 4:
        const hindex = halloween.findIndex(
          (hl) => hl.idProducto == prod.idProducto
        );
        const haux = [...halloween];
        haux[hindex] = auxObj;
        setHalloween(haux);
        break;
      case 5:
        const sindex = sinDesc.findIndex(
          (sd) => sd.idProducto == prod.idProducto
        );
        const saux = [...sinDesc];
        saux[sindex] = auxObj;
        setSinDesc(saux);
        break;
      case 6:
        const espIndex = especiales.findIndex(
          (ep) => ep.codInterno == prod.codInterno
        );

        const eaux = [...especiales];
        eaux[espIndex] = auxObj;
        setEspeciales(eaux);
        break;
    }
  }

  function handleType(value) {
    setTipo(value);
    if (
      value === "muestra" ||
      value === "consignacion" ||
      value === "reserva"
    ) {
      setDescuento(0);
      setIsDesc(true);
    } else {
      setIsDesc(false);
    }
  }
  function structureOrder(availables) {
    return new Promise((resolve) => {
      var error = false;
      if (selectedClient === "") {
        error = true;
        setAlert("Seleccione un cliente por favor");
      }
      if (selectedProds.length === 0) {
        error = true;
        setAlert("Por favor seleccione al menos un producto");
      }
      selectedProds.map((pr) => {
        if (pr.cantProducto < 0.01 || pr.cantProducto === "") {
          error = true;
          setAlert("La cantidad elegida de algun producto esta en 0");
        }
      });
      resolve(error);
    });
  }

  async function validateAvailability() {
    setDiscModal(false);
    setIsAlertSec(true);
    setAlertSec("Validando Pedido");
    setTimeout(() => {
      const validateAva = availabilityInterval();
      validateAva.then((res) => {
        const disponibles = availableProducts(
          JSON.parse(Cookies.get("userAuth")).idUsuario
        );
        disponibles.then((fetchedAvailable) => {
          const avaSetted = async () => {
            const setted = asyncSetAva(fetchedAvailable.data.data);
            setted.then((res) => {
              setIsAlertSec(false);
              saveOrder(fetchedAvailable.data.data[0]);
            });
          };
          avaSetted();
        });
      });
    }, 200);
  }

  function validateQuantities() {
    var errorList = 0;
    for (const product of selectedProds) {
      if (product.cantProducto > product.cant_Actual) {
        errorList += 1;
      }
    }
    return errorList;
  }

  const asyncSetAva = (array) => {
    return new Promise((resolve) => {
      setAvailable(array);
      resolve(true);
    });
  };

  function saveOrder(availables) {
    const validatedOrder = structureOrder(availables);
    validatedOrder.then(async (res) => {
      setisLoading(true);
      if (!res) {
        setAlertSec("Creando pedido ...");
        setIsAlertSec(true);
        const objPedido = {
          pedido: {
            idUsuarioCrea: usuarioAct,
            idUsuario: usuarioAct,
            idCliente: selectedClient,
            fechaCrea: dateString(),
            fechaActualizacion: dateString(),
            estado: 0,
            montoFacturar: parseFloat(totalPrevio).toFixed(2),
            montoTotal: parseFloat(totalFacturar).toFixed(2),
            tipo: tipo,
            descuento: descuento,
            descCalculado: parseFloat(totalDesc).toFixed(2),
            notas: observaciones,
            impreso: isInterior ? 1 : 0,
          },
          productos: selectedProds,
        };
        //setPedidoFinal(ped);

        const objSubmit = {
          objOrder: objPedido,
          userStore: userStore,
          products: selectedProds,
        };
        try {
          const processOrder = await createOrderTransaction(objSubmit);
          console.log("Respuesta de creacion", processOrder.data);
          const codPedido = await getOrderList(processOrder.data.idCreado);
          const emailBody = {
            codigoPedido: processOrder.data.idCreado,
            correoUsuario: userEmail,
            fecha: dateString(),
            email: [userEmail],
            tipo: "Pedido",
            header: "Pedido Creado",
          };
          const emailSent = await sendOrderEmail(emailBody);

          const objPedidoNew = {
            pedido: {
              idPedido: processOrder.data.idCreado,
              idUsuarioCrea: usuarioAct,
              idUsuario: usuarioAct,
              idCliente: selectedClient,
              fechaCrea: dateString(),
              fechaActualizacion: dateString(),
              estado: 0,
              montoFacturar: parseFloat(totalPrevio).toFixed(2),
              montoTotal: parseFloat(totalFacturar).toFixed(2),
              tipo: tipo,
              descuento: descuento,
              descCalculado: parseFloat(totalDesc).toFixed(2),
              notas: observaciones,
              impreso: isInterior ? 1 : 0,
            },
            productos: selectedProds,
          };

          await logOrderUpdate(objPedidoNew);

          setIsAlertSec(false);
          setAlert("Pedido Creado correctamente");
          setIsAlert(true);

          setTimeout(() => {
            window.location.reload();
            setisLoading(false);
          }, 3000);
        } catch (error) {
          updateCurrentStock();
          console.log("Error al crear el pedido 1", error);
          const errorMes = error.response.data
            .toString()
            .includes("stock_nonnegative")
            ? "Uno de los productos ya no cuenta con la cantidad solicitada de stock"
            : "Error en el Pedido";
          setIsAlertSec(false);
          setAlert(errorMes);
          setIsAlert(true);
        }
      } else {
        setIsAlert(true);
      }
    });
  }

  function saveSampleAndTransfer() {
    const total = selectedProds.reduce((accumulator, object) => {
      return accumulator + Number(object.totalProd);
    }, 0);
    const arrayInZero = setTotalProductsToZero(selectedProds);
    arrayInZero.then((zero) => {
      const validatedOrder = structureOrder();
      validatedOrder.then(async (res) => {
        setisLoading(true);
        if (!res) {
          setAlertSec("Creando pedido ...");
          setIsAlertSec(true);
          const objPedido = {
            pedido: {
              idUsuarioCrea: usuarioAct,
              idUsuario: usuarioAct,
              idCliente: selectedClient,
              fechaCrea: dateString(),
              fechaActualizacion: dateString(),
              estado: 0,
              montoFacturar: total,
              montoTotal: total,
              tipo: tipo,
              descuento: 0,
              descCalculado: 0,
              notas: observaciones,
              impreso: isInterior ? 1 : 0,
            },
            productos: zero.modificados,
          };
          console.log("Objeto pedido", objPedido);
          const objSubmit = {
            objOrder: objPedido,
            userStore: userStore,
            products: zero.modificado,
          };
          try {
            const processOrder = await createOrderTransaction(objSubmit);
            console.log("Respuesta de creacion", processOrder.data);
            const codPedido = await getOrderList(processOrder.data.idCreado);

            const emailBody = {
              codigoPedido: processOrder.data.idCreado,
              correoUsuario: userEmail,
              fecha: dateString(),
              email: [userEmail],
              tipo: "Pedido",
              header: "Pedido Creado",
            };

            if (tipo === "consignacion") {
              console.log("Updating virtual stock");

              const virtualStockObject = {
                accion: "add",
                clientInfo: clientInfo,
                productos: selectedProds,
              };

              await updateVirtualStock(virtualStockObject);
            }

            const emailSent = await sendOrderEmail(emailBody);

            await logOrderUpdate(objPedido);

            setIsAlertSec(false);
            setAlert("Pedido Creado correctamente");
            setIsAlert(true);

            setTimeout(() => {
              window.location.reload();
              setisLoading(false);
            }, 3000);
          } catch (error) {
            updateCurrentStock();
            console.log("Error al crear el pedido 1", error);
            const errorMes = error.response.data
              .toString()
              .includes("stock_nonnegative")
              ? "Uno de los productos ya no cuenta con la cantidad solicitada de stock"
              : "Error en el Pedido";
            setIsAlertSec(false);
            setAlert(errorMes);
            setIsAlert(true);
          }
        } else {
          setIsAlert(true);
        }
      });
    });
  }

  function handleDiscount(value) {
    setDescuento(value);
  }

  function validateProductLen() {
    const validated = validateQuantities();
    if (validated === 0) {
      console.log("Es interior", isInterior);
      if (selectedClient != "") {
        if (selectedProds.length > 0) {
          setAuxProds(selectedProds);
          if (tipo == "normal") {
            verifySeasonal();
          } else {
            saveSampleAndTransfer();
          }
        } else {
          setAlert("Seleccione al menos un producto por favor");
          setIsAlert(true);
        }
      } else {
        setAlert("Seleccione un cliente por favor");

        setIsAlert(true);
      }
    } else {
      setAlert(
        "Una de las cantidades seleccionadas no se encuentra disponible"
      );

      setIsAlert(true);
    }
  }

  async function processDiscounts() {
    if (tipoUsuario != 2 && tipoUsuario != 3 && tipoUsuario != 4) {
      //const objDesc = discountByAmount(selectedProds, descuento);
      const objDescNew = newDiscountByAmount(selectedProds, descuento);
      console.log("Obj desc new", objDescNew);
      setDescSimple(objDescNew);
      setTotalDesc(objDescNew.descCalculado);
      setTotalPrevio(
        Number(
          Number(objDescNew.totalEspecial) +
            Number(objDescNew.totalDescontables)
        )
      );
      setTotalFacturar(
        Number(
          Number(objDescNew.totalTradicional) + Number(objDescNew.totalEspecial)
        )
      );
      console.log(
        "CHEKIANDO ESTO",
        Number(
          Number(objDescNew.totalTradicional) + Number(objDescNew.totalEspecial)
        )
      );
      setDiscModalType(false);
      setSelectedProds(objDescNew.productosReprocesados);
      setDiscModal(true);
    } else {
      const dType = await getDiscountType();
      const discountObject =
        dType.data.idTipoDescuento == 1
          ? complexDiscountFunction(selectedProds, discountList)
          : complexNewDiscountFunction(selectedProds, discountList);
      setTradObject(discountObject.tradicionales);
      setPasObject(discountObject.pascua);
      setNavObject(discountObject.navidad);
      setHallObject(discountObject.halloween);
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
      setIsSpecial(discountObject.tradicionales.especial);
      setDiscModalType(true);
      setDiscModal(true);
    }
  }

  async function verifySeasonal() {
    if (seasonDiscountData.length > 0) {
      const verified = verifySeasonalProduct(selectedProds, seasonDiscountData);
      if (verified) {
        setDiscModalType(false);
        const data = await processSeasonalDiscount(
          selectedProds,
          seasonDiscountData
        );
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
        processDiscounts();
      }
    } else {
      processDiscounts();
    }
  }

  function cancelDiscounts() {
    setSelectedProds(auxProds, discountList);
    setDiscModal(false);
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
  function addWithScanner(e) {
    e.preventDefault();
    if (available.length == 1) {
      setAvailable(auxProducts);
      setFiltered("");
      selectProduct(JSON.stringify(available[0]));
    } else {
      if (available.length == 0) {
        setAlert("Producto no encontrado");
        setIsAlert(true);
        setAvailable(auxProducts);
        setFiltered("");
      }
    }
  }

  function changeQuantitiesModal(e) {
    e.preventDefault();
    const index = selectedProds.length - 1;
    const selectedProd = selectedProds[index];
    changeQuantitys(index, modalQuantity, selectedProd, false);
    setIsQuantity(false);
    setModalQuantity("");
    setAvailable(auxProducts);
    searchRef.current.focus();
  }

  function changePrice(index, value, prod) {
    let auxObj = {
      cant_Actual: prod.cant_Actual,
      cantPrevia: prod.cantPrevia,
      cantProducto: prod.cantProducto,
      codInterno: prod.codInterno,
      codigoBarras: prod.codigoBarras,
      idProducto: prod.idProducto,
      nombreProducto: prod.nombreProducto,
      precioDeFabrica: value,
      precioDescuentoFijo: prod.precioDescuentoFijo,
      totalProd: prod.cantProducto * value,
      totalDescFijo: prod.cantProducto * prod.precioDescuentoFijo,
      tipoProducto: prod.tipoProducto,
      descuentoProd: 0,
      unidadDeMedida: prod.unidadDeMedida,
    };
    let auxSelected = [...selectedProds];
    auxSelected[index] = auxObj;
    setSelectedProds(auxSelected);

    switch (prod.tipoProducto) {
      case 1:
        const tindex = tradicionales.findIndex(
          (td) => td.idProducto == prod.idProducto
        );
        const taux = [...tradicionales];
        taux[tindex] = auxObj;
        setTradicionales(taux);
        break;
      case 2:
        const pindex = pascua.findIndex(
          (ps) => ps.idProducto == prod.idProducto
        );
        const paux = [...pascua];
        paux[pindex] = auxObj;
        setPascua(paux);
        break;
      case 3:
        const nindex = navidad.findIndex(
          (nv) => nv.idProducto == prod.idProducto
        );
        const naux = [...navidad];
        naux[nindex] = auxObj;
        setNavidad(naux);
        break;
      case 4:
        const hindex = halloween.findIndex(
          (hl) => hl.idProducto == prod.idProducto
        );
        const haux = [...halloween];
        haux[hindex] = auxObj;
        setHalloween(haux);
        break;
      case 5:
        const sindex = sinDesc.findIndex(
          (sd) => sd.idProducto == prod.idProducto
        );
        const saux = [...sinDesc];
        saux[sindex] = auxObj;
        setSinDesc(saux);
        break;
      case 6:
        const espIndex = especiales.findIndex(
          (ep) => ep.codInterno == prod.codInterno
        );

        const eaux = [...especiales];
        eaux[espIndex] = auxObj;
        setEspeciales(eaux);
        break;
    }
  }

  return (
    <div>
      <div className="formLabel">REGISTRAR PEDIDOS</div>
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
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={isQuantity}>
        <Modal.Header className="modalHeader">INGRESE CANTIDAD</Modal.Header>
        <Modal.Body>
          <div className="productModal">{currentProd.nombreProducto}</div>
          <Form>
            <Form.Control
              type="number"
              onChange={(e) => setModalQuantity(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" ? changeQuantitiesModal(e) : null
              }
              ref={quantref}
              value={modalQuantity}
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
                tradObject={tradObject}
                pasObject={pasObject}
                navObject={navObject}
                hallObject={hallObject}
                sinDesc={sinDesc}
              />
              <SpecialsTable
                especiales={especiales}
                totales={descSimple}
                isEsp={isSpecial}
              />
              <SinDescTable sindDesc={sinDesc} />
            </div>
          ) : !isSeasonalModal ? (
            <div>
              <SimpleDiscountTable totales={descSimple} />
              <SinDescTable sindDesc={descSimple.productosSinDescuento} />
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
          <Button variant="success" onClick={() => validateAvailability()}>
            Cargar Pedido
          </Button>
          <Button variant="danger" onClick={() => cancelDiscounts()}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Buscar cliente por nit o razon social"
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
            "Buscar todos"
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
                <th className="tableColumnSmall">Nit</th>
                <th className="tableColumn">Razon Social</th>
                <th className="tableColumn">Zona</th>
                <th className="tableColumn">Frecuencia</th>
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
                            filterSelectedClient(client?.idCliente);
                          }}
                        >
                          {isSelected ? "Seleccionado" : "Seleccionar"}
                        </Button>
                      </div>
                    </td>
                    <td className="tableColumnSmall">{client?.nit}</td>
                    <td className="tableColumn">{client?.razonSocial}</td>
                    <td className="tableColumn">{client?.zona}</td>
                    <td className="tableColumn">{client?.dias}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      <div className="formLabelPurple"></div>
      <div className="formLabel">SELECCIONE PRODUCTO</div>
      <div className="rowFormInputs">
        <Form className="mb-3 halfSelect">
          <Form.Group controlId="order">
            <Form.Select
              className="selectorColor"
              onChange={(e) => selectProduct(e.target.value)}
              ref={searchRef}
            >
              <option>Seleccione producto</option>

              {available.map((producto) => {
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
        </Form>
        <Form className="mb-3 searchHalf" onSubmit={(e) => addWithScanner(e)}>
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
          <Form.Group>
            <div className="formLabel">DESCUENTO (%)</div>
            <div className="percent">
              <Form.Control
                min={0}
                max={100}
                required
                value={descuento}
                disabled={tipoUsuario == 1 ? false : true}
                onChange={(e) => handleDiscount(e.target.value)}
                type="number"
                placeholder="Ingrese porcentaje"
              ></Form.Control>
            </div>
          </Form.Group>
          {isProduct && selectedProds.length > 0 ? (
            <div className="tableOne">
              <Table>
                <thead>
                  <tr className="tableHeader">
                    <th className="smallTableColumn"></th>
                    <th className="smallTableColumn">Codigo</th>
                    <th className="smallTableColumn">Nombre</th>
                    <th className="smallTableColumn">Precio Unidad /Kg</th>
                    <th className="smallTableColumn">{`${
                      isMobile ? "Cant" : "Cantidad"
                    } /Peso (Gr)`}</th>
                    <th className="smallTableColumn">Total</th>
                    <th style={{ width: "10%" }}>
                      {isMobile ? "Cant Disp" : "Disponible"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...selectedProds].map((sp, index) => {
                    const cActual = auxProducts.find(
                      (ap) => ap.idProducto == sp.idProducto
                    )?.cant_Actual;
                    const refActual = productRef.current.find(
                      (pr) => pr.idProducto == sp.idProducto
                    )?.cant_Actual;
                    const isPaneton = datosPaneton.find(
                      (dp) => dp.codInterno == sp.codInterno
                    );
                    console.log("REF ACTUAL", refActual);
                    console.log("CANT ACTUALIZADA", cActual);
                    //console.log("IS PANETON", isPaneton);
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="smallTableColumn">
                          <div>
                            <Button
                              onClick={() =>
                                deleteProduct(index, sp.codInterno, sp)
                              }
                              variant="warning"
                              className="tableButtonAlt"
                            >
                              {isMobile ? "X" : "Quitar"}
                            </Button>
                          </div>
                        </td>
                        <td className="smallTableColumn">{sp.codInterno}</td>
                        <td className="smallTableColumn">
                          {sp.nombreProducto}
                        </td>
                        <td style={{ width: "20%" }}>
                          {
                            <InputGroup>
                              <Form.Control
                                disabled={
                                  !(
                                    (tipoUsuario != 2 &&
                                      tipoUsuario != 3 &&
                                      tipoUsuario != 4) ||
                                    isPaneton
                                  )
                                }
                                type="number"
                                value={sp.precioDeFabrica}
                                onChange={(e) =>
                                  changePrice(index, e.target.value, sp)
                                }
                              />{" "}
                              <InputGroup.Text>Bs</InputGroup.Text>
                            </InputGroup>
                          }
                        </td>
                        <td style={{ width: "20%" }}>
                          <Form.Control
                            type="number"
                            min="0"
                            placeholder="0"
                            value={sp.cantProducto}
                            onChange={(e) =>
                              changeQuantitys(index, e.target.value, sp)
                            }
                          />
                        </td>
                        <td className="smallTableColumn">
                          {sp.totalProd?.toFixed(2)}
                        </td>
                        <td
                          style={{ color: cActual != refActual ? "red" : "" }}
                        >
                          {cActual}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="tableHeader">
                    <th className="smallTableColumn"></th>
                    <th className="smallTableColumn"></th>
                    <th className="smallTableColumn"></th>

                    <th className="smallTableColumn"></th>

                    <th className="smallTableColumn">{"Total: "}</th>
                    <th className="smallTableColumn">
                      {selectedProds
                        .reduce((accumulator, object) => {
                          return accumulator + parseFloat(object.totalProd);
                        }, 0)
                        ?.toFixed(2)}
                    </th>
                    <th className="smallTableColumn"></th>
                  </tr>
                </tfoot>
              </Table>
            </div>
          ) : null}
          <div className="formLabel">SELECCIONE TIPO PEDIDO</div>
          <Form.Group className="mb-3" controlId="order">
            <Form.Select
              className="selectorHalf"
              onChange={(e) => handleType(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="muestra">Muestra</option>
              <option value="consignacion">Consignación</option>
              <option value="reserva">Reserva</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <div className="comments">
              <Form.Control
                as="textarea"
                rows={4}
                onChange={(e) => {
                  setObservaciones(e.target.value);
                }}
                value={observaciones}
                placeholder="Notas adicionales"
                maxLength="250"
              ></Form.Control>
              <div>{`${250 - observaciones.length} caracteres restantes`}</div>
            </div>
          </Form.Group>
          <Form.Group>
            <div className="formLabel">CONFIRMAR PRODUCTOS</div>
            <div className="percent">
              <Button
                variant="warning"
                className="yellowLarge"
                onClick={() => validateProductLen()}
                ref={prodTableRef}
              >
                {isLoading ? (
                  <Image src={loading2} style={{ width: "5%" }} />
                ) : tipo == "normal" ? (
                  "Procesar descuentos"
                ) : (
                  `Cargar Pedido`
                )}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

/**

const tradObj = traditionalDiscounts(
        tradicionales,
        especiales,
        sinDesc,
        discountList
      );

      setIsSpecial(tradObj.especial);
      const pasObj = easterDiscounts(pascua, discountList);
      const navObj = christmassDiscounts(navidad, discountList);
      const hallObj = halloweenDiscounts(halloween, discountList);

      setTradObject(tradObj);
      setPasObject(pasObj);
      setNavObject(navObj);
      setHallObject(hallObj);
      setTotalDesc(
        (
          parseFloat(pasObj.descCalculado) +
          parseFloat(tradObj.descCalculado) +
          parseFloat(navObj.descCalculado) +
          parseFloat(hallObj.descCalculado)
        ).toFixed(2)
      );

      setTotalPrevio(
        (
          parseFloat(tradObj.total) +
          parseFloat(pasObj.total) +
          parseFloat(navObj.total) +
          parseFloat(hallObj.total)
        ).toFixed(2)
      );
      setTotalFacturar(
        (
          parseFloat(tradObj.facturar) +
          parseFloat(pasObj.facturar) +
          parseFloat(navObj.facturar) +
          parseFloat(hallObj.facturar)
        ).toFixed(2)
      );

      setDiscModalType(true);
      setDiscModal(true);
      const newArr = addProductDiscounts(
        selectedProds,
        tradObj,
        pasObj,
        navObj,
        hallObj
      );
      newArr.then((result) => {
        setSelectedProds(result);
      });



 */
