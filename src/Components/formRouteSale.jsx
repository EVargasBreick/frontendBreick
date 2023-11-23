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
import { useNavigate } from "react-router-dom";

import { convertToText } from "../services/numberServices";

import SaleModal from "./saleModal";
import { dateString } from "../services/dateServices";
import {
  createSale,
  deleteSale,
  verifyQuantities,
} from "../services/saleServices";
import {
  getBranches,
  getBranchesPs,
  getMobileSalePoints,
  getSalePoints,
} from "../services/storeServices";
import {
  createInvoice,
  deleteInvoice,
  otherPaymentsList,
} from "../services/invoiceServices";

import {
  addProductDiscounts,
  christmassDiscounts,
  complexDiscountFunction,
  complexNewDiscountFunction,
  easterDiscounts,
  halloweenDiscounts,
  saleDiscount,
  traditionalDiscounts,
  verifyAutomaticDiscount,
} from "../services/discountServices";
import { updateStock } from "../services/orderServices";
import FormSimpleRegisterClient from "./formSimpleRegisterClient";
import ComplexDiscountTable from "./complexDiscountTable";
import SpecialsTable from "./specialsTable";
import { getDiscountType } from "../services/discountEndpoints";

export default function FormRouteSale() {
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
  const [tipo, setTipo] = useState("normal");
  const [isDesc, setIsDesc] = useState(false);
  const [pedidoFinal, setPedidoFinal] = useState({});
  const [discModal, setDiscModal] = useState(false);
  const [usuarioAct, setUsuarioAct] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [filtered, setFiltered] = useState("");
  const [willCreate, setWillCreate] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);

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
  const [auxProducts, setAuxProducts] = useState([]);
  const [sucursal, setSucursal] = useState("");
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
  const [giftCard, setGiftCard] = useState(0);
  const [userCity, setUserCity] = useState("");
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
  const [mobilePdv, setMobilePdv] = useState({});
  const quantref = useRef(null);
  const saleModalRef = useRef();
  const tabletasArray = [
    "702000",
    " 702001",
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
  ];
  useEffect(() => {
    const dType = getDiscountType();
    dType.then((dt) => {
      console.log("Tipo de descuento", dt.data);
      setDiscountType(dt.data.idTipoDescuento);
    });
    searchRef.current.focus();
    const spplited = dateString().split(" ");

    const newly = Cookies.get("nit");
    if (newly) {
      setSearch(newly);
      Cookies.remove("nit");
    }
    const UsuarioAct = Cookies.get("userAuth");

    if (UsuarioAct) {
      setUserCity(JSON.parse(UsuarioAct).idDepto);
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      const PuntoDeVenta = Cookies.get("pdv");
      if (PuntoDeVenta) {
        setIsPoint(true);
        setPointOfsale(PuntoDeVenta);
      } else {
        const mobilepdvdata = getMobileSalePoints(
          JSON.parse(UsuarioAct).idAlmacen
        );
        mobilepdvdata.then((res) => {
          const datos = res.data[0];
          console.log("Datos del punto de venta", datos);
          if (datos == undefined) {
            setIsPoint(false);
          } else {
            setIsPoint(true);
            setPointOfsale(datos.nroPuntoDeVenta);
            Cookies.set("pdv", datos.nroPuntoDeVenta, { expires: 0.5 });
          }
        });
      }

      setUserName(JSON.parse(UsuarioAct).usuario);
      const pl = getSalePoints(JSON.parse(UsuarioAct).idAlmacen);
      pl.then((res) => {
        setPointList([{ nroPuntoDeVenta: 0 }]);
      });
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      const otrosPagos = otherPaymentsList();
      otrosPagos
        .then((op) => {
          setOtherPayments(op.data);
        })
        .catch((err) => {
          console.log("Otros pagos?", err);
        });
      const disponibles = getProductsWithStock(
        JSON.parse(Cookies.get("userAuth")).idAlmacen,
        "all"
      );
      disponibles.then((fetchedAvailable) => {
        const filtered = fetchedAvailable.data.filter((fa) => fa.activo === 1);
        setAvailable(filtered);
        setAuxProducts(filtered);
      });
      const suc = getBranchesPs();
      suc.then((resp) => {
        const sucursales = resp.data;
        const alm = JSON.parse(Cookies.get("userAuth")).idAlmacen;
        const sucur = sucursales.find((sc) => "AL001" == sc.idAgencia);
        console.log("Sucursal", sucur);
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
      const dl = productsDiscount(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      dl.then((res) => {
        setDiscountList(res.data.data);
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

  function addProductToList(action, product) {
    if (action == "manual") {
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
          precioDeFabrica: isTableta
            ? produc.precioDeFabrica * 0.9
            : produc.precioDeFabrica,
          descuentoProd: 0,
          totalProd: produc.precioDeFabrica,
          tipoProducto: produc.tipoProducto,
          unidadDeMedida: produc.unidadDeMedida,
        };
        const tipo = isTableta ? 5 : produc.tipoProducto;
        switch (produc.tipoProducto) {
          case 1:
            console.log("Tradicional agregado");
            setTradicionales([...tradicionales, productObj]);
            break;
          case 2:
            console.log("Pascua agregado");
            setPascua([...pascua, productObj]);
            break;
          case 3:
            setNavidad([...navidad, productObj]);
            break;
          case 4:
            setHalloween([...halloween, productObj]);
            break;
          case 5:
            setSinDesc([...sinDesc, productObj]);
            break;
          case 6:
            setEspeciales([...especiales, productObj]);
            break;
        }
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

      if (selected != undefined) {
        const isTableta = tabletasArray.includes(selected.codInterno);
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
            precioDeFabrica: isTableta
              ? selected.precioDeFabrica * 0.9
              : selected.precioDeFabrica,
            precioDescuentoFijo: selected.precioDescuentoFijo,
            descuentoProd: 0,
            totalProd: selected.precioDeFabrica,
            tipoProducto: selected.tipoProducto,
            unidadDeMedida: selected.unidadDeMedida,
          };
          const tipo = isTableta ? 5 : selected.tipoProducto;
          switch (selected.tipoProducto) {
            case 1:
              setTradicionales([...tradicionales, productObj]);
              break;
            case 2:
              setPascua([...pascua, productObj]);
              break;
            case 3:
              setNavidad([...navidad, productObj]);
              break;
            case 4:
              setHalloween([...halloween, productObj]);
              break;
            case 5:
              setSinDesc([...sinDesc, productObj]);
              break;
            case 6:
              setEspeciales([...especiales, productObj]);
              break;
          }
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
    e.preventDefault();
    const index = selectedProducts.length - 1;
    const selectedProd = selectedProducts[index];
    changeQuantities(index, modalQuantity, selectedProd, false);
    setIsQuantity(false);
    setModalQuantity("");
    setAvailable(auxProducts);
    searchRef.current.focus();
  }

  const handleClose = () => {
    setIsAlert(false);
    setWillCreate(false);
    setisLoading(false);
    setIsCreate(false);
  };
  function deleteProduct(index, cod, prod) {
    console.log("Producto a borrar", prod, cod, index);
    const auxArray = [...selectedProducts];
    const auxAux = [...auxSelectedProducts];
    console.log("Tipo producto", prod);
    switch (prod.tipoProducto) {
      case 1:
        console.log("Borrando trad");
        const tindex = tradicionales.findIndex((td) => td.idProducto == cod);
        const taux = [...tradicionales];
        taux.splice(tindex, 1);
        setTradicionales(taux);
        break;
      case 2:
        console.log("Borrando Pascua");
        const pindex = pascua.findIndex((ps) => ps.idProducto == cod);
        console.log("Index pascuero", pindex);
        const paux = [...pascua];
        paux.splice(pindex, 1);
        setPascua(paux);
        break;
      case 3:
        console.log("Borrando Navidad");
        const nindex = navidad.findIndex((nv) => nv.idProducto == cod);
        const naux = [...navidad];
        naux.splice(nindex, 1);
        setNavidad(naux);
        break;
      case 4:
        console.log("Borrando Halloween");
        const hindex = halloween.findIndex((hl) => hl.idProducto == cod);
        const haux = [...halloween];
        haux.splice(hindex, 1);
        setHalloween(haux);
        break;
      case 5:
        console.log("Borrando sin desc");
        const sindex = sinDesc.findIndex((sd) => sd.idProducto == cod);
        const saux = [...sinDesc];
        saux.splice(sindex, 1);
        setSinDesc(saux);
        break;
      case 6:
        console.log("Borrando especial");
        const eindex = especiales.findIndex((ep) => ep.idProducto == cod);
        const eaux = [...especiales];
        eaux.splice(eindex, 1);
        setEspeciales(eaux);
        break;
    }
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
      precioDeFabrica: prod.precioDeFabrica,
      precioDescuentoFijo: prod.precioDescuentoFijo,
      totalProd: total,
      tipoProducto: prod.tipoProducto,
      descuentoProd: 0,
      unidadDeMedida: prod.unidadDeMedida,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
    setAuxSelectedProducts(auxSelected);
    switch (prod.tipoProducto) {
      case 1:
        const tindex = tradicionales.findIndex(
          (td) => td.idProducto == prod.idProducto
        );
        const taux = [...tradicionales];
        taux[tindex] = auxObj;
        console.log("Cantidad en pascua cambiando");
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
  function handleModal() {
    if (isSelected) {
      const invoiceBody = {
        idCliente: idSelectedClient,
        nroFactura: 1,
        idSucursal: sucursal.idImpuestos,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
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
      setTimeout(() => {
        setIsInvoice(true);
        setIsSaleModal(true);
      }, 100);
    } else {
      setAlert("Por favor, seleccione un cliente");
      setIsAlert(true);
    }
  }
  function saveSale(createdId) {
    const totPrev = parseFloat(
      auxSelectedProducts.reduce((accumulator, object) => {
        return accumulator + parseFloat(object.total).toFixed(2);
      }, 0)
    ).toFixed(2);
    console.log("Tot prev 2", parseFloat(totPrev).toFixed(2));
    const totDesc = selectedProducts.reduce((accumulator, object) => {
      return accumulator + parseFloat(object.total).toFixed(2);
    }, 0);
    return new Promise((resolve, reject) => {
      setFechaHora(dateString());
      const objVenta = {
        pedido: {
          idUsuarioCrea: usuarioAct,
          idCliente: selectedClient,
          fechaCrea: dateString(),
          fechaActualizacion: dateString(),
          montoTotal: parseFloat(totalPrevio).toFixed(2),
          descCalculado: parseFloat(totalDesc).toFixed(2),
          descuento: descuento,
          montoFacturar: parseFloat(totalPrevio - totalDesc).toFixed(2),
          idPedido: "",
          idFactura: createdId,
        },
        productos: selectedProducts,
      };
      const ventaCreada = createSale(objVenta);
      ventaCreada
        .then((res) => {
          const idVenta = res.data.idCreado;
          setTimeout(() => {
            const updatedStock = updateStock({
              accion: "take",
              idAlmacen: userStore,
              productos: selectedProducts,
              detalle: `NVAG-${idVenta}`,
            });
            const objStock = {
              accion: "add",
              idAlmacen: userStore,
              productos: selectedProducts,
              detalle: `CVAGN-${idVenta}`,
            };
            updatedStock
              .then((us) => {
                saleModalRef.current.childFunction(
                  createdId,
                  idVenta,
                  objStock
                );
                resolve(true);
                setIsAlertSec(true);
              })
              .catch((err) => {
                setAlert(err.response.data.message);
                const deletedInvoice = deleteInvoice(createdId);
                deletedInvoice.then((rs) => {
                  const deletedSale = deleteSale(idVenta);
                  deletedSale.then((res) => {
                    console.log("Borrados");
                  });
                });
              });
          }, 500);
        })
        .catch((err) => {
          console.log("Error al crear la venta", err);
          const deletedInvoice = deleteInvoice(createdId);
          setAlert("Error al crear la factura, intente nuevamente");
          reject(false);
        });
    });
  }
  function saveInvoice() {
    return new Promise((resolve, reject) => {
      setAlertSec("Registrando Venta");
      setIsAlertSec(true);
      const invoiceBody = {
        idCliente: selectedClient,
        nroFactura: 0,
        idSucursal: branchInfo.nro,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
        fechaHora: dateString(),
        nitCliente: clientes[0].nit,
        razonSocial: clientes[0].razonSocial,
        tipoPago: tipoPago,
        pagado: cancelado,
        cambio: parseFloat(cambio).toFixed(2),
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: "",
        importeBase: parseFloat(
          parseFloat(cancelado).toFixed(2) - parseFloat(cambio).toFixed(2)
        ).toFixed(2),
        debitoFiscal: parseFloat(
          (parseFloat(cancelado).toFixed(2) - parseFloat(cambio).toFixed(2)) *
            0.13
        ).toFixed(2),
        desembolsada: 0,
        autorizacion: `${dateString()}|${pointOfSale}|${userStore}`,
        cufd: "",
        fechaEmision: "",
        nroTransaccion: 0,
        idOtroPago: ofp,
        vale: giftCard,
        aPagar: aPagar,
        puntoDeVenta: pointOfSale,
        idAgencia: userStore,
      };
      console.log("INVOICE BODY", invoiceBody);
      setInvoice(invoiceBody);
      console.log("Invoice body", invoiceBody);
      const newInvoice = createInvoice(invoiceBody);
      newInvoice
        .then((res) => {
          setTimeout(() => {
            const newId = res.data.idCreado;
            const created = saveSale(newId);
            created
              .then((res) => {
                resolve(true);
              })
              .catch((error) => {
                reject(false);
              });
          }, 500);
        })
        .catch((error) => {
          console.log("Error en la creacion de la factura", error);
          setAlert("Error al crear la factura, intente nuevamente");
        });

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

  function validateQuantities() {
    const validated = verifyQuantities(selectedProducts);
    validated
      .then(() => {
        processDiscounts();
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
    setTradObject(discountObject.tradicionales);
    setPasObject(discountObject.pascua);
    setNavObject(discountObject.navidad);
    setHallObject(discountObject.halloween);
    setTotalDesc(
      discountObject.tradicionales.descCalculado +
        discountObject.pascua.descCalculado +
        discountObject.navidad.descCalculado +
        discountObject.halloween.descCalculado
    );
    setTotalPrevio(
      discountObject.tradicionales.total +
        discountObject.pascua.total +
        discountObject.navidad.total +
        discountObject.halloween.total
    );
    setTotalFacturar(
      discountObject.tradicionales.facturar +
        discountObject.pascua.facturar +
        discountObject.navidad.facturar +
        discountObject.halloween.facturar
    );
    setDiscModal(true);
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
          <SaleModal
            ref={saleModalRef}
            datos={{
              total: totalPrevio,
              descuento,
              totalDescontado: totalFacturar,
              nit: clientes[0].nit,
              razonSocial: clientes[0].razonSocial,
            }}
            show={true}
            setDescuento={setDescuento}
            isSaleModal={isSaleModal}
            setIsSaleModal={setIsSaleModal}
            setIsInvoice={setIsInvoice}
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
              parseFloat(pasObject.descCalculado) +
              parseFloat(tradObject.descCalculado) +
              parseFloat(navObject.descCalculado) +
              parseFloat(hallObject.descCalculado)
            }
            totalDescontado={
              parseFloat(tradObject.facturar) +
              parseFloat(pasObject.facturar) +
              parseFloat(navObject.facturar) +
              parseFloat(hallObject.facturar)
            }
            fechaHora={fechaHora}
            tipoDocumento={tipoDoc}
            userName={userName}
            pointOfSale={pointOfSale}
            otherPayments={otherPayments}
            giftCard={giftCard}
            setGiftCard={setGiftCard}
            userStore={userStore}
            userId={usuarioAct}
            saleType="store"
            setTotalFacturar={setTotalFacturar}
            setTotalDesc={setTotalDesc}
            setTotalPrevio={setTotalPrevio}
            ofp={ofp}
            setOfp={setOfp}
            aPagar={aPagar}
            setAPagar={setAPagar}
            isRoute={true}
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
