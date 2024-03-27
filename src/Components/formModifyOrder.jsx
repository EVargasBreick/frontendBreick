import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Image, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import {
  addProductToOrder,
  cancelOrder,
  composedCancelOrder,
  deleteProductOrder,
  getOrderDetail,
  getOrderProdList,
  getUserOrderList,
  logOrderUpdate,
  updateDbOrder,
  updateMultipleStock,
  updateMultipleVirtualStock,
  updateOrderProduct,
  updateVirtualStock,
} from "../services/orderServices";
import loading2 from "../assets/loading2.gif";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import {
  availableProducts,
  logShortage,
  productsDiscount,
  updateForMissing,
} from "../services/productServices";
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
import { dateString } from "../services/dateServices";
import SeasonalDiscountTable from "./seasonalDiscountTable";
import SinDescTable from "./sinDescTable";
import {
  getDiscountType,
  getSeasonalDiscount,
} from "../services/discountEndpoints";
import { WholeSaleModal } from "./Modals/wholesaleModal";
export default function FormModifyOrders() {
  const [discountType, setDiscountType] = useState("");
  const [pedidosList, setPedidosList] = useState([]);
  const [totalDesc, setTotalDesc] = useState(0);
  const [totalPrevio, setTotalPrevio] = useState(0);
  const [totalFacturar, setTotalFacturar] = useState(0);
  const [selectedProds, setSelectedProds] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [cliente, setCliente] = useState("");
  const [zona, setZona] = useState("");
  const [idPedido, setIdPedido] = useState("");
  const [total, setTotal] = useState("");
  const [descuento, setDescuento] = useState("");
  const [facturado, setFacturado] = useState("");
  const [isProduct, setIsProduct] = useState(false);
  const [alert, setAlert] = useState("");
  const [isSpecial, setIsSpecial] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [fechaCrea, setFechaCrea] = useState("");
  const [codigoPedido, setCodigoPedido] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [available, setAvailable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [auxSelectedProds, setAuxSelectedProds] = useState([]);
  const [auxOrder, setAuxOrder] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userStore, setUserStore] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [prevDisc, setPrevDisc] = useState("");
  const [arrProductsDeleted, setArrProductsDeleted] = useState([]);
  const [filtered, setFiltered] = useState("");
  const [auxAva, setAuxAva] = useState([]);
  const [auxProducts, setAuxProducts] = useState([]);
  const [faltantes, setFaltantes] = useState([]);
  const [flagDiscount, setFlagDiscount] = useState(false);
  const [fechaPedido, setFechaPedido] = useState("");
  const [userRol, setUserRol] = useState("");
  const [clientInfo, setClientInfo] = useState({});
  const [orderType, setOrderType] = useState("");
  const [seasonDiscountData, setSeasonDiscountData] = useState([]);
  const [isSeasonalModal, setIsSeasonalModal] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [auxTotalPrev, setAuxTotalPrev] = useState("");
  const [auxTotalFac, setAuxTotalFac] = useState("");
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const datosPaneton = [
    { codInterno: "715037", precio: 46.5 },
    { codInterno: "715038", precio: 88.0 },
  ];

  const navigate = useNavigate();
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
  const [usuarioCrea, setUsuarioCrea] = useState("");
  const [discModalType, setDiscModalType] = useState(true);
  const [auxProds, setAuxProds] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [isInterior, setIsInterior] = useState(false);
  const [originalProducts, setOriginalProducts] = useState();
  const [auxPedidosList, setAuxPedidosList] = useState([]);
  const [filter, setFilter] = useState("");
  const [creatorStore, setCreatorStore] = useState("");

  const [seasonalProds, setSeasonalProds] = useState([]);
  const [seasonalSinDesc, setSeasonalSinDesc] = useState([]);
  const [seasonalSpecial, setSeasonalSpecial] = useState([]);
  const [seasonalTotals, setSeasonalTotals] = useState({});
  const [isWholeModal, setIsWholeModal] = useState(false);

  async function listDiscounts(currentDate, tipo) {
    const discountList = await getSeasonalDiscount(currentDate, tipo);
    return discountList;
  }

  const productRef = useRef([]);
  useEffect(() => {
    const dType = getDiscountType();
    dType.then((dt) => {
      console.log("Tipo de descuento", dt.data);
      setDiscountType(dt.data.idTipoDescuento);
    });
    const UsuarioAct = Cookies.get("userAuth");

    if (JSON.parse(UsuarioAct).rol == 13) {
      const selectedWhole = Cookies.get("selectedwhole");
      if (!selectedWhole) {
        setIsWholeModal(true);
      }
    }

    const wholeSale = Cookies.get("selectedwhole");
    if (UsuarioAct) {
      if (
        wholeSale
          ? JSON.parse(wholeSale).idDepto != 1
          : JSON.parse(UsuarioAct).idDepto != 1
      ) {
        setIsInterior(true);
      }
      setUserEmail(
        wholeSale ? JSON.parse(wholeSale).correo : JSON.parse(UsuarioAct).correo
      );
      setUserStore(
        wholeSale
          ? JSON.parse(wholeSale).idAlmacen
          : JSON.parse(UsuarioAct).idAlmacen
      );
      const isSudo = wholeSale
        ? [1, 10, 13].includes(JSON.parse(wholeSale).rol)
        : JSON.parse(UsuarioAct).rol === 1 ||
          JSON.parse(UsuarioAct).rol === 10 ||
          JSON.parse(UsuarioAct).rol === 13
        ? true
        : false;
      const listaPedidos = getUserOrderList(
        isSudo
          ? ""
          : wholeSale
          ? JSON.parse(wholeSale).idUsuario
          : JSON.parse(Cookies.get("userAuth")).idUsuario,
        `and estado!='2' and facturado=0 and case when tipo='normal' then (listo=0 or listo=1) when tipo='muestra' then listo=0 when tipo='consignacion' then listo=0 else (listo=1 or listo=0)  end 
        and TO_TIMESTAMP(a."fechaCrea", 'DD/MM/YYYY HH24:MI:SS') >= (CURRENT_DATE - INTERVAL '3 month')`
      );
      listaPedidos.then((res) => {
        const userAlm = wholeSale
          ? JSON.parse(wholeSale).idAlmacen
          : JSON.parse(UsuarioAct).idAlmacen;
        const filtered = res.data.data.filter(
          (listItem) => listItem.idAlmacen === userAlm
        );
        setPedidosList(filtered);
        setAuxPedidosList(filtered);
      });
      setTipoUsuario(JSON.parse(Cookies.get("userAuth")).tipoUsuario);
    }

    const disponibles = availableProducts(
      wholeSale
        ? JSON.parse(wholeSale).idUsuario
        : JSON.parse(Cookies.get("userAuth")).idUsuario
    );
    disponibles.then((fetchedAvailable) => {
      const filtered = fetchedAvailable.data.data.filter(
        (product) => product.activo === 1
      );
      setAvailable(filtered);
      setAuxProducts(filtered);
      setAuxAva(filtered);
      productRef.current = filtered;
    });
  }, []);

  function updateCurrentStock() {
    setAvailable([]);
    setAuxAva([]);
    setAuxProducts([]);
    const wholeSale = Cookies.get("selectedwhole");
    const disponibles = availableProducts(
      wholeSale
        ? JSON.parse(wholeSale).idUsuario
        : JSON.parse(Cookies.get("userAuth")).idUsuario
    );
    disponibles.then((fetchedAvailable) => {
      const filtered = fetchedAvailable.data.data.filter(
        (product) => product.activo === 1
      );
      setAvailable(filtered);
      setAuxProducts(filtered);
      setAuxAva(filtered);
    });
  }

  useEffect(() => {
    if (flagDiscount) {
      verifySeasonal();
    }
  }, [flagDiscount]);
  function selectProduct(product) {
    const parsed = JSON.parse(product);
    var aux = false;
    const prodObj = {
      cantPrevia: 0,
      cantProducto: 0,
      codInterno: parsed.codInterno,
      codigoBarras: parsed.codigoBarras,
      idPedido: idPedido,
      idPedidoProducto: null,
      idProducto: parsed.idProducto,
      nombreProducto: parsed.nombreProducto,
      precioDeFabrica: isSuper ? parsed.precioSuper : parsed.precioDeFabrica,
      precioDescuentoFijo: parsed.precioDescuentoFijo,
      totalDescFijo: 0,
      totalProd: 0,
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
    setIsProduct(true);
  }

  const handleClose = () => {
    setIsAlert(false);
    setIsLoading(false);
  };
  function deleteProduct(index, cod, prod) {
    const auxArray = [...selectedProds];
    auxArray.splice(index, 1);
    setSelectedProds(auxArray);
    if (prod.idPedidoProducto !== null) {
      setArrProductsDeleted([...arrProductsDeleted, prod]);
    }
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

  function setOrderDetails(stringPedido) {
    if (stringPedido != "-1") {
      setSelectedProds([]);
      setAuxProds([]);
      setNavidad([]);
      setTradicionales([]);
      setPascua([]);
      setHalloween([]);
      setEspeciales([]);
      setSinDesc([]);
      setAuxSelectedProds([]);
      setUserRol("");
      setAuxOrder([]);
      setFechaPedido("");
      setClientInfo({});
      setOrderType("");
      const stringParts = stringPedido.split("|");
      setIsLoading(true);
      setCodigoPedido(stringParts[1]);
      setSelectedOrder(stringParts[0]);
      const wholeSale = Cookies.get("selectedwhole");
      const currentUser = Cookies.get("userAuth");
      const order = getOrderDetail(stringParts[0]);
      order.then((res) => {
        const currentDate = dateString();
        const list = listDiscounts(currentDate, res.data.data[0].tipoUsuario);
        list.then((l) => {
          setSeasonDiscountData(l.data.data);
        });
        console.log("Almacen del usuario", res.data.data[0].idAlmacen);
        setSelectedProds([]);
        console.log("order details", res.data.data);
        const dl = productsDiscount(res.data.data[0].idUsuarioCrea);
        dl.then((res) => {
          setDiscountList(res.data.data);
        });
        setUserRol(res.data.data[0].rol);
        setAuxOrder(res.data.data[0]);
        setFechaPedido(res.data.data[0].fechaCrea);
        setIsSuper(res.data.data[0]?.issuper ? true : false);
        const verifySuper = res.data.data[0]?.issuper ? true : false;
        setClientInfo({
          nitCliente: res.data.data[0].nit,
          idZona: res.data.data[0].idZona,
          issuper: res.data.data[0].issuper,
        });
        setOrderType(res.data.data[0].tipo);
        const fechaDesc = res.data.data[0].fechaCrea
          .substring(0, 10)
          .split("/");
        setFechaCrea(
          fechaDesc[0] +
            " de " +
            meses[fechaDesc[1] - 1] +
            " de " +
            fechaDesc[2]
        );

        setIdPedido(res.data.data[0].idPedido);
        const prodHeaderObj = {
          vendedor: res.data.data[0].nombreVendedor,
          cliente: res.data.data[0].razonSocial,
          zona: res.data.data[0].zona,
          montoTotal: res.data.data[0].montoFacturar,
          descuento: res.data.data[0].descuento,
          facturado: res.data.data[0].montoTotal,
          fechaCrea:
            fechaDesc[2] +
            " de " +
            meses[fechaDesc[1] - 1] +
            " de " +
            fechaDesc[0],
        };
        setVendedor(res.data.data[0].nombreVendedor);
        setCliente(res.data.data[0].razonSocial);
        setZona(res.data.data[0].zona);
        setTotal(res.data.data[0].montoFacturar);
        setDescuento(res.data.data[0].descuento);
        setPrevDisc(res.data.data[0].descuento);
        setFacturado(res.data.data[0].montoTotal);
        setTotalPrevio(res.data.data[0].montoFacturar);
        setAuxTotalPrev(res.data.data[0].montoFacturar);
        setTotalDesc(res.data.data[0].descuentoCalculado);
        setTotalFacturar(res.data.data[0].montoTotal);
        setTipoUsuario(
          wholeSale
            ? JSON.parse(currentUser).tipoUsuario
            : res.data.data[0].tipoUsuario
        );

        console.log(
          "tipo usuario",
          wholeSale
            ? JSON.parse(currentUser).tipoUsuario
            : res.data.data[0].tipoUsuario
        );

        setAuxTotalFac(res.data.data[0].montoTotal);
        setUsuarioCrea(res.data.data[0].idUsuarioCrea);
        setCodigoPedido(res.data.data[0].codigoPedido);
        setCreatorStore(res.data.data[0].idAlmacen);

        const prodList = getOrderProdList(stringParts[0]);
        prodList.then((res) => {
          res.data.data.map((prod) => {
            const objProd = {
              cantProducto: prod.cantidadProducto,
              idProducto: prod.idProducto,
            };
            setAuxSelectedProds((auxSelectedProds) => [
              ...auxSelectedProds,
              objProd,
            ]);
          });
          var tradArray = [];
          var pasArray = [];
          var navArray = [];
          var hallArray = [];
          var sinArray = [];
          var espArray = [];

          res.data.data.map((parsed, index) => {
            //console.log("TESTEANDO SUPER", res.data.data[0]);
            const precio = parsed.precio_producto
              ? parsed.precio_producto
              : verifySuper
              ? parsed.precioSuper
              : parsed.precioDeFabrica;

            const prodObj = {
              cantPrevia: parsed.cantidadProducto,
              cantProducto: parsed.cantidadProducto,
              codInterno: parsed.codInterno,
              codigoBarras: parsed.codigoBarras,
              idPedido: parsed.idPedido,
              idPedidoProducto: parsed.idPedidoProducto,
              idProducto: parsed.idProducto,
              nombreProducto: parsed.nombreProducto,
              precioDeFabrica: verifySuper
                ? parsed.precioSuper
                : parsed.precioDeFabrica,
              precioDescuentoFijo: parsed.precioDescuentoFijo,
              totalProd: parsed.cantidadProducto * precio,
              totalDescFijo:
                parsed.cantidadProducto * parsed.precioDescuentoFijo,
              tipoProducto: parsed.tipoProducto,
              descuentoProd: 0,
              unidadDeMedida: parsed.unidadDeMedida,
              precio_producto: parsed.precio_producto,
            };
            //console.log("Datos del producto", prodObj);
            setSelectedProds((selectedProds) => [...selectedProds, prodObj]);
            switch (parsed.tipoProducto) {
              case 1:
                tradArray.push(prodObj);
                break;
              case 2:
                pasArray.push(prodObj);
                break;
              case 3:
                navArray.push(prodObj);
                break;
              case 4:
                hallArray.push(prodObj);
                break;
              case 5:
                sinArray.push(prodObj);
                break;
              case 6:
                espArray.push(prodObj);
                break;
            }
            setIsLoading(false);
          });
          setTradicionales(tradArray);
          setPascua(pasArray);
          setNavidad(navArray);
          setHalloween(hallArray);
          setSinDesc(sinArray);
          setEspeciales(espArray);
          const auxDetail = [...productDetail];
          setProductDetail([...auxDetail, prodHeaderObj]);
          setIsOrder(true);
          setIsPdf(true);
        });
      });
    }
  }
  function changeQuantitys(index, cantidades, prod) {
    var cantidad;
    if (prod.unidadDeMedida == "unidad") {
      cantidad = cantidades != "" ? parseInt(cantidades) : 0;
    } else {
      cantidad = parseFloat(cantidades).toFixed(2);
    }
    let auxObj = {
      cantPrevia: prod.cantPrevia,
      cantProducto: cantidades,
      codInterno: prod.codInterno,
      codigoBarras: prod.codigoBarras,
      idPedido: prod.idPedido,
      idPedidoProducto: prod.idPedidoProducto,
      idProducto: prod.idProducto,
      nombreProducto: prod.nombreProducto,
      precioDeFabrica: prod.precioDeFabrica,
      precioDescuentoFijo: prod.precioDescuentoFijo,
      totalProd: cantidad * (prod.precio_producto ?? prod.precioDeFabrica),
      totalDescFijo: cantidad * prod.precioDescuentoFijo,
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
        const eindex = especiales.findIndex(
          (ep) => ep.idProducto == prod.idProducto
        );
        const eaux = [...especiales];
        eaux[eindex] = auxObj;
        setEspeciales(eaux);
        break;
    }
  }
  async function deleteOrderAndUpdate() {
    if (idPedido === "") {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    } else {
      setAlertSec("Cancelando pedido y actualizando kardex");
      setIsAlertSec(true);
      const objProdsDelete = {
        accion: "add",
        idAlmacen: creatorStore,
        productos: auxSelectedProds,
        detalle: `DPCPD-${idPedido}`,
      };
      const bodyVirtualDelete = {
        accion: "take",
        clientInfo: clientInfo,
        productos: auxSelectedProds,
      };

      const compBody = {
        stock: objProdsDelete,
        order: selectedOrder,
      };
      try {
        const canceled = await composedCancelOrder(compBody);
        const updatedVirtual = await updateVirtualStock(bodyVirtualDelete);
        console.log("Cancelado correctamente", canceled);
        console.log("Actualizado virtual", updatedVirtual);
        setAlertSec("Pedido cancelado y kardex actualizado, redirigiendo...");
        setIsAlertSec(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        setIsAlertSec(false);
        console.log("Error al cancelar", error);
        setAlert("Error al cancelar", error);
        setIsAlert(true);
      }
    }
  }
  function updateOrder() {
    setDiscModal(false);
    if (idPedido === "") {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    } else {
      var arrayAdds = [];
      var arrayTakes = [];
      var objProductsAdded = [];
      var objProductsUpdated = [];
      var total = selectedProds.reduce((accumulator, object) => {
        return accumulator + object.totalProd;
      }, 0);
      const userId = JSON.parse(Cookies.get("userAuth")).idUsuario;
      const objUpdateOrder = {
        idPedido: idPedido,
        idUsuario: userId,
        montoFacturar: totalPrevio,
        montoTotal: totalFacturar,
        descuento: descuento,
        descCalculado: totalDesc,
        listo: 0,
        impreso: isInterior ? 1 : 0,
        estado: 0,
      };
      var countProdsChanged = 0;
      selectedProds.map((sp) => {
        console.log("TCL: updateOrder -> sp", sp);
        if (sp.cantProducto === sp.cantPrevia) {
          countProdsChanged++;
        } else {
          if (sp.cantProducto > sp.cantPrevia) {
            const objProd = {
              idProducto: sp.idProducto,
              cantProducto: sp.cantProducto - sp.cantPrevia,
              totalProd:
                sp.cantProducto * (sp.precio_producto ?? sp.precioDeFabrica),
              precio_producto: sp.precio_producto ?? sp.precioDeFabrica,
            };
            arrayTakes.push(objProd);
          } else {
            const objProd = {
              idProducto: sp.idProducto,
              cantProducto: sp.cantPrevia - sp.cantProducto,
              totalProd:
                sp.cantProducto * (sp.precio_producto ?? sp.precioDeFabrica),
              precio_producto: sp.precio_producto ?? sp.precioDeFabrica,
            };
            arrayAdds.push(objProd);
          }
        }
        if (sp.idPedidoProducto === null) {
          const objProd = {
            idProducto: sp.idProducto,
            cantProducto: sp.cantProducto,
            totalProd:
              sp.cantProducto * (sp.precio_producto ?? sp.precioDeFabrica),
            descuentoProd: sp.descuentoProd,
            idPedidoProducto: sp.idPedidoProducto,
            precioDeFabrica: sp.precioDeFabrica,
            precio_producto: sp.precio_producto ?? sp.precioDeFabrica,
          };
          objProductsAdded.push(objProd);
        } else {
          const objProd = {
            idPedidoProducto: sp.idPedidoProducto,
            idProducto: sp.idProducto,
            cantProducto: sp.cantProducto,
            totalProd:
              sp.cantProducto * (sp.precio_producto ?? sp.precioDeFabrica),
            descuentoProd: sp.descuentoProd,
            idPedidoProducto: sp.idPedidoProducto,
            precio_producto: sp.precio_producto ?? sp.precioDeFabrica,
          };
          objProductsUpdated.push(objProd);
        }
      });

      if (
        countProdsChanged === selectedProds.length &&
        descuento === prevDisc &&
        auxSelectedProds.length === selectedProds.length &&
        totalPrevio == auxTotalPrev &&
        totalFacturar == auxTotalFac &&
        1 != 1
      ) {
        setAlert("No se han detectado cambios en el pedido ");
        setIsAlert(true);
      } else {
        setAlertSec("Actualizando Pedido");
        setIsAlertSec(true);
        const toUpdateTakes = {
          accion: "add",
          idAlmacen: creatorStore,
          productos: auxSelectedProds,
          detalle: `DSEPD-${idPedido}`,
        };
        const toUpdateAdds = {
          accion: "take",
          idAlmacen: creatorStore,
          productos: selectedProds,
          detalle: `SSEPD-${idPedido}`,
        };

        const updateMultiple = updateMultipleStock([
          toUpdateTakes,
          toUpdateAdds,
        ]);

        updateMultiple
          .then((res) => {
            const toAddProducts = {
              idPedido: idPedido,
              productos: objProductsAdded,
            };
            const addedProds = addProductToOrder(toAddProducts);
            addedProds.then((added) => {
              const toUpdateProducts = {
                idPedido: idPedido,
                productos: objProductsUpdated,
              };
              const updatedProds = updateOrderProduct(toUpdateProducts);
              updatedProds.then((res) => {
                const objDeletedProds = {
                  productos: arrProductsDeleted,
                };
                const deletedProds = deleteProductOrder(objDeletedProds);
                deletedProds.then((res) => {
                  const updOrder = updateDbOrder(objUpdateOrder);
                  updOrder
                    .then(async (upo) => {
                      const bodyVirtualAdd = {
                        accion: "add",
                        clientInfo: clientInfo,
                        productos: selectedProds,
                      };
                      const bodyVirtualTake = {
                        accion: "take",
                        clientInfo: clientInfo,
                        productos: auxSelectedProds,
                      };
                      if (orderType === "consignacion") {
                        try {
                          const updatedMultiple =
                            await updateMultipleVirtualStock([
                              bodyVirtualAdd,
                              bodyVirtualTake,
                            ]);
                          console.log(
                            "Updateado stock virtual",
                            updatedMultiple
                          );
                          try {
                            await logOrderUpdate({
                              pedido: objUpdateOrder,
                              productos: selectedProds,
                            });
                            setTimeout(() => {
                              setAlertSec("Pedido actualizado correctamente");
                              setIsAlertSec(true);
                              Cookies.remove("selectedwhole");
                              window.location.reload();
                            }, 3000);
                          } catch (error) {
                            console.log("Error al loggear la edicion");
                          }
                        } catch (err) {
                          console.log(
                            "Error al actualizar stock para consignacion"
                          );
                        }
                      } else {
                        try {
                          await logOrderUpdate({
                            pedido: objUpdateOrder,
                            productos: selectedProds,
                          });
                          setTimeout(() => {
                            setAlertSec("Pedido actualizado correctamente");
                            setIsAlertSec(true);
                            Cookies.remove("selectedwhole");
                            window.location.reload();
                          }, 3000);
                        } catch (error) {
                          console.log("Error al loggear la edicion");
                        }
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
              });
            });
          })
          .catch((error) => {
            setAlertSec(
              "Error al actualizar el pedido, revise stocks por favor"
            );
            updateCurrentStock();
            console.log("Se llego aca");
            setTimeout(() => {
              setIsAlertSec(false);
            }, 5000);
          });
      }
    }
  }
  function handleDiscount(value) {
    setDescuento(value);
  }

  async function processDiscounts() {
    console.log("TIPO DESCUENTILLO", tipoUsuario);
    if (tipoUsuario != 2 && tipoUsuario != 3 && tipoUsuario != 4) {
      const objDesc = discountByAmount(selectedProds, descuento);
      const objDescNew = newDiscountByAmount(selectedProds, descuento);
      console.log("Obj desc new", objDescNew);
      setDescSimple(objDescNew);
      setTotalDesc(objDescNew.descCalculado);
      setTotalPrevio(
        Number(objDescNew.totalEspecial + objDescNew.totalDescontables)
      );
      setTotalFacturar(
        Number(objDescNew.totalTradicional + objDescNew.totalEspecial)
      );
      console.log(
        "CHEKIANDO ESTO",
        Number(objDescNew.totalTradicional + objDescNew.totalEspecial)
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
  function validateProductLen() {
    if (selectedProds.length > 0) {
      setAuxProds(selectedProds);
      console.log("Productos a devolver a stock", auxSelectedProds);
      console.log("Productos a sacar de stock", selectedProds);
      verifySeasonal();
    } else {
      setAlert("Seleccione al menos un producto por favor");
      setIsAlert(true);
    }
  }

  function updateStockState() {
    const disponibles = availableProducts(
      JSON.parse(Cookies.get("userAuth")).idUsuario
    );
    disponibles.then((fetchedAvailable) => {
      setAvailable(fetchedAvailable.data.data);
      setAuxProducts(fetchedAvailable.data.data);
      setAuxAva(fetchedAvailable.data.data);
    });
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
    setSelectedProds(auxProds);
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
    const finded = selectedProds.find((sp) => sp.codigoBarras === filtered);
    const product = available.find((sp) => sp.codigoBarras === filtered);

    if (finded === undefined) {
      selectProduct(JSON.stringify(product));
      setFiltered("");
    } else {
      setAlert("Producto ya encontrado en la lista");
      setIsAlert(true);
      setFiltered("");
    }
  }

  function filterOrders(value) {
    setFilter(value);
    const filtered = auxPedidosList.filter(
      (data) =>
        data.idPedido === value ||
        data.codigoPedido
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase())
    );
    setPedidosList(filtered);
  }

  return (
    <div>
      <div className="formLabel">MODIFICAR PEDIDO</div>
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
            Cerrar
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
                sinDesc={sinDesc}
                pascua={pascua}
                navidad={navidad}
                halloween={halloween}
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
              <SinDescTable sinDesc={sinDesc} />
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
          <Button variant="success" onClick={() => updateOrder()}>
            Actualizar Pedido
          </Button>
          <Button variant="danger" onClick={() => cancelDiscounts()}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Label>Filtrar por numero, usuario o tipo</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => {
              filterOrders(e.target.value);
            }}
            value={filter}
          />
          <Form.Label className="formLabel">Lista de Pedidos</Form.Label>
          <Form.Select onChange={(e) => setOrderDetails(e.target.value)}>
            <option value={"-1"}>Seleccione pedido</option>
            {pedidosList.map((pedido) => {
              return (
                <option
                  value={pedido.idPedido + "|" + pedido.codigoPedido}
                  key={pedido.idPedido}
                >
                  {pedido.codigoPedido}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </Form>
      <div className="secondHalf">
        <div className="formLabel">DETALLES DEL PEDIDO</div>
        <div>
          {isLoading ? <Image src={loading2} style={{ width: "2%" }} /> : null}
        </div>
        <Form>
          <div className="halfContainer">
            <Form.Group className="half" controlId="vendor">
              <Form.Label>Vendedor</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                disabled
                value={vendedor}
              />
            </Form.Group>
            <Form.Group className="half" controlId="client">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                disabled
                value={cliente}
              />
            </Form.Group>
          </div>
          <div className="halfContainer">
            <Form.Group className="half" controlId="vendor">
              <Form.Label>Zona</Form.Label>
              <Form.Control type="text" placeholder="" disabled value={zona} />
            </Form.Group>
            <Form.Group className="half" controlId="client">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                disabled
                value={fechaCrea}
              />
            </Form.Group>
          </div>
        </Form>
      </div>
      {selectedProds.length > 0 ? (
        <div className="secondHalf">
          <div className="formLabel">Agregar Productos</div>
          <div className="rowFormInputs">
            <Form className="mb-3 halfSelect">
              <Form.Group controlId="order">
                <Form.Select
                  className="selectorColor"
                  onChange={(e) => selectProduct(e.target.value)}
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
            <Form
              className="mb-3 searchHalf"
              onSubmit={(e) => addWithScanner(e)}
            >
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
          <Form.Group>
            <div className="formLabel">DESCUENTO (%)</div>
            <div className="percent">
              <Form.Control
                min={0}
                max={100}
                required
                value={descuento}
                //disabled={userRol == 1 ? false : true}
                onChange={(e) => handleDiscount(e.target.value)}
                type="number"
                placeholder="Ingrese porcentaje"
              ></Form.Control>
            </div>
          </Form.Group>
        </div>
      ) : null}
      <div className="secondHalf">
        <div className="formLabel">Detalle productos</div>
        <div className="tableOne">
          {selectedProds.length > 0 ? (
            <div>
              <Table bordered striped hover className="table">
                <thead>
                  <tr className="tableHeader">
                    <td className="tableColumnSmall"></td>
                    <th className="tableColumnSmall">Codigo Producto</th>
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Disponible</th>
                    <th className="tableColumnSmall">Reservado</th>

                    <th className="tableColumnSmall">Precio</th>
                    <th className="tableColumnSmall">Cantidad</th>
                    <th className="tableColumnMedium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProds.map((product, index) => {
                    const cActual = auxProducts.find(
                      (ap) => ap.idProducto == product.idProducto
                    )?.cant_Actual;
                    const refActual = productRef.current.find(
                      (pr) => pr.idProducto == product.idProducto
                    )?.cant_Actual;
                    const isPaneton = datosPaneton.find(
                      (dp) => dp.codInterno == product.codInterno
                    );
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumnSmall">
                          <Button
                            className="yellow"
                            variant="warning"
                            onClick={() => {
                              deleteProduct(index, product.idProducto, product);
                            }}
                          >
                            Quitar
                          </Button>
                        </td>
                        <td className="tableColumnSmall">
                          {product.codInterno}
                        </td>
                        <td className="tableColumn">
                          {product.nombreProducto}
                        </td>
                        <td
                          className="tableColumnSmall"
                          style={{ color: cActual != refActual ? "red" : "" }}
                        >
                          {cActual}
                        </td>
                        <td className="tableColumnSmall">
                          {product.cantPrevia}
                        </td>

                        <td style={{ width: "10%" }}>
                          <InputGroup>
                            <Form.Control
                              disabled={
                                ![1, 10].includes(
                                  JSON.parse(Cookies.get("userAuth"))
                                    .tipoUsuario
                                ) &&
                                !(
                                  (tipoUsuario != 2 &&
                                    tipoUsuario != 3 &&
                                    tipoUsuario != 4) ||
                                  isPaneton
                                )
                              }
                              required
                              type="number"
                              value={
                                product.precio_producto ??
                                product.precioDeFabrica
                              }
                              onChange={(e) => {
                                const aux = [...selectedProds];
                                aux[index].precio_producto = e.target.value;
                                aux[index].totalProd =
                                  e.target.value * product.cantProducto;
                                setSelectedProds(aux);
                              }}
                            />{" "}
                            <InputGroup.Text>Bs</InputGroup.Text>
                          </InputGroup>
                        </td>
                        <td className="tableColumnSmall">
                          <Form>
                            <Form.Group>
                              <Form.Control
                                type="number"
                                placeholder=""
                                className="tableTotal"
                                min="0"
                                onChange={(e) =>
                                  changeQuantitys(
                                    index,
                                    e.target.value,
                                    product
                                  )
                                }
                                value={product.cantProducto}
                              />
                            </Form.Group>
                          </Form>
                        </td>

                        <td className="tableColumnMedium">{`${product.totalProd.toFixed(
                          2
                        )} Bs.`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText">Total</div>
                  {/* total of totals */}
                  <div className="totalColumnData">{`${selectedProds
                    .reduce((accumulator, object) => {
                      return accumulator + object.totalProd;
                    }, 0)
                    .toFixed(2)} Bs.`}</div>
                </div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText"> Descuento:</div>
                  <div className="totalColumnData">{`${parseFloat(
                    totalDesc
                  )?.toFixed(2)}`}</div>
                </div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText"> A Facturar:</div>
                  <div className="totalColumnData">
                    {`${parseFloat(totalFacturar)?.toFixed(2)} Bs.`}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="secondHalf">
          <div className="buttons">
            <Button
              variant="light"
              className="cyanLarge"
              onClick={() => validateProductLen()}
            >
              Procesar Pedido
            </Button>
            <Button
              variant="light"
              className="yellowLarge"
              onClick={() => deleteOrderAndUpdate()}
            >
              Cancelar Pedido
            </Button>
          </div>
        </div>
      </div>
      {isWholeModal && (
        <WholeSaleModal
          showModal={isWholeModal}
          sudoId={JSON.parse(Cookies.get("userAuth")).idUsuario}
        />
      )}
    </div>
  );
}
