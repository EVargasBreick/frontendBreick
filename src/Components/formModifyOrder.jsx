import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Image, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  addProductToOrder,
  cancelOrder,
  deleteProductOrder,
  getOrderDetail,
  getOrderList,
  getOrderProdList,
  updateDbOrder,
  updateOrderProduct,
  updateStock,
} from "../services/orderServices";
import loading2 from "../assets/loading2.gif";
import { useNavigate } from "react-router-dom";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import { availableProducts } from "../services/productServices";
import {
  addProductDiscounts,
  addProductDiscSimple,
  christmassDiscounts,
  easterDiscounts,
  halloweenDiscounts,
  manualAutomaticDiscount,
  traditionalDiscounts,
} from "../services/discountServices";
import ComplexDiscountTable from "./complexDiscountTable";
import SimpleDiscountTable from "./simpleDiscountTable";
import SpecialsTable from "./specialsTable";
export default function FormModifyOrders() {
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
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [discModalType, setDiscModalType] = useState(true);
  const [auxProds, setAuxProds] = useState([]);
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      setTipoUsuario(JSON.parse(Cookies.get("userAuth")).tipoUsuario);
      console.log("Usuario actual", UsuarioAct.correo);
    }
    const listaPedidos = getOrderList("");
    listaPedidos.then((res) => {
      setPedidosList(res.data.data[0]);
      console.log("Lista de pedidos", res.data.data[0]);
    });

    const disponibles = availableProducts(
      JSON.parse(Cookies.get("userAuth")).idUsuario
    );
    disponibles.then((fetchedAvailable) => {
      setAvailable(fetchedAvailable.data.data[0]);
      setAuxProducts(fetchedAvailable.data.data[0]);
      setAuxAva(fetchedAvailable.data.data[0]);
    });
  }, []);
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
      precioDeFabrica: parsed.precioDeFabrica,
      precioDescuentoFijo: parsed.precioDescuentoFijo,
      totalDescFijo: 0,
      totalProd: 0,
      tipoProducto: parsed.tipoProducto,
      descuentoProd: 0,
    };
    selectedProds.map((sp) => {
      if (sp.codInterno === JSON.parse(product).codInterno) {
        console.log("Producto repetido");
        aux = true;
      }
    });
    if (!aux) {
      switch (parsed.tipoProducto) {
        case 1:
          console.log("Producto tradicional");
          setTradicionales([...tradicionales, prodObj]);
          break;
        case 2:
          console.log("Producto de pascua");
          setPascua([...pascua, prodObj]);
          break;
        case 3:
          console.log("Producto de navidad");
          setNavidad([...navidad, prodObj]);
          break;
        case 4:
          console.log("Producto de halloween");
          setHalloween([...halloween, prodObj]);
          break;
        case 5:
          console.log("Producto sin Descuento");
          setSinDesc([...sinDesc, prodObj]);
          break;
        case 6:
          console.log("Producto especial");
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
    console.log("Producto:", prod);
    const auxArray = [...selectedProds];
    auxArray.splice(index, 1);
    setSelectedProds(auxArray);
    if (prod.idPedidoProducto !== null) {
      setArrProductsDeleted([...arrProductsDeleted, prod]);
    }
    switch (prod.tipoProducto) {
      case 1:
        const tindex = tradicionales.findIndex((td) => td.idProducto == cod);
        console.log("Index a alterar", tindex);
        const taux = [...tradicionales];
        taux.splice(tindex, 1);
        setTradicionales(taux);
        break;
      case 2:
        const pindex = pascua.findIndex((ps) => ps.idProducto == cod);
        const paux = [...pascua];
        console.log("Index a alterar", pindex);
        paux.splice(pindex, 1);
        setPascua(paux);
        break;
      case 3:
        const nindex = navidad.findIndex((nv) => nv.idProducto == cod);
        const naux = [...navidad];
        console.log("Index a alterar", nindex);
        naux.splice(nindex, 1);
        setNavidad(naux);
        break;
      case 4:
        const hindex = halloween.findIndex((hl) => hl.idProducto == cod);
        const haux = [...halloween];
        console.log("Index a alterar", hindex);
        haux.splice(hindex, 1);
        setHalloween(haux);
        break;
      case 5:
        const sindex = sinDesc.findIndex((sd) => sd.idProducto == cod);
        const saux = [...sinDesc];
        console.log("Index a alterar", sindex);
        saux.splice(sindex, 1);
        setSinDesc(saux);
        break;
      case 6:
        const eindex = especiales.findIndex((ep) => ep.idProducto == cod);
        const eaux = [...especiales];
        console.log("Index a alterar", eindex);
        eaux.splice(eindex, 1);
        setEspeciales(eaux);
        break;
    }
  }

  function setOrderDetails(stringPedido) {
    setSelectedProds([]);
    setAuxProds([]);
    setNavidad([]);
    setTradicionales([]);
    setPascua([]);
    setHalloween([]);
    setEspeciales([]);
    setSinDesc([]);
    const stringParts = stringPedido.split("|");
    setIsLoading(true);
    setCodigoPedido(stringParts[1]);
    setSelectedOrder(stringParts[0]);
    const order = getOrderDetail(stringParts[0]);
    order.then((res) => {
      setSelectedProds([]);
      console.log("Detalles de la orden", res.data.data[0][0]);
      setAuxOrder(res.data.data[0][0]);
      const fechaDesc = res.data.data[0][0].fechaCrea
        .substring(0, 10)
        .split("/");
      setFechaCrea(
        fechaDesc[0] + " de " + meses[fechaDesc[1] - 1] + " de " + fechaDesc[2]
      );
      console.log("Pedido Seleccionado:", res);
      setIdPedido(res.data.data[0][0].idPedido);
      const prodHeaderObj = {
        vendedor: res.data.data[0][0].nombreVendedor,
        cliente: res.data.data[0][0].razonSocial,
        zona: res.data.data[0][0].zona,
        montoTotal: res.data.data[0][0].montoFacturar,
        descuento: res.data.data[0][0].descuento,
        facturado: res.data.data[0][0].montoTotal,
        fechaCrea:
          fechaDesc[2] +
          " de " +
          meses[fechaDesc[1] - 1] +
          " de " +
          fechaDesc[0],
      };
      setVendedor(res.data.data[0][0].nombreVendedor);
      setCliente(res.data.data[0][0].razonSocial);
      setZona(res.data.data[0][0].zona);
      setTotal(res.data.data[0][0].montoFacturar);
      setDescuento(res.data.data[0][0].descuento);
      setPrevDisc(res.data.data[0][0].descuento);
      setFacturado(res.data.data[0][0].montoTotal);
      setTotalPrevio(res.data.data[0][0].montoFacturar);
      setTotalDesc(res.data.data[0][0].descuentoCalculado);
      setTotalFacturar(res.data.data[0][0].montoTotal);
      const prodList = getOrderProdList(stringParts[0]);

      prodList.then((res) => {
        console.log("Lista de productos", res.data.data[0]);
        res.data.data[0].map((prod) => {
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
        res.data.data[0].map((parsed, index) => {
          console.log("Index de producto", index);
          console.log("Nombre producto", parsed.precioDescuentoFijo);
          const prodObj = {
            cantPrevia: parsed.cantidadProducto,
            cantProducto: parsed.cantidadProducto,
            codInterno: parsed.codInterno,
            codigoBarras: parsed.codigoBarras,
            idPedido: parsed.idPedido,
            idPedidoProducto: parsed.idPedidoProducto,
            idProducto: parsed.idProducto,
            nombreProducto: parsed.nombreProducto,
            precioDeFabrica: parsed.precioDeFabrica,
            precioDescuentoFijo: parsed.precioDescuentoFijo,
            totalProd: parsed.cantidadProducto * parsed.precioDeFabrica,
            totalDescFijo: parsed.cantidadProducto * parsed.precioDescuentoFijo,
            tipoProducto: parsed.tipoProducto,
            descuentoProd: 0,
          };
          setSelectedProds((selectedProds) => [...selectedProds, prodObj]);
          switch (parsed.tipoProducto) {
            case 1:
              console.log("Producto tradicional agregado");
              tradArray.push(prodObj);
              break;
            case 2:
              console.log("Producto de pascua agregado");
              pasArray.push(prodObj);
              break;
            case 3:
              console.log("Producto de navidad agregado");
              navArray.push(prodObj);
              break;
            case 4:
              console.log("Producto de halloween agregado");
              hallArray.push(prodObj);
              break;
            case 5:
              console.log("Producto sin Descuento agregado");
              sinArray.push(prodObj);
              break;
            case 6:
              console.log("Producto especial agregado");
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
  function changeQuantitys(index, cantidad, prod) {
    let auxObj = {
      cantPrevia: prod.cantPrevia,
      cantProducto: cantidad,
      codInterno: prod.codInterno,
      codigoBarras: prod.codigoBarras,
      idPedido: prod.idPedido,
      idPedidoProducto: prod.idPedidoProducto,
      idProducto: prod.idProducto,
      nombreProducto: prod.nombreProducto,
      precioDeFabrica: prod.precioDeFabrica,
      precioDescuentoFijo: prod.precioDescuentoFijo,
      totalProd: cantidad * prod.precioDeFabrica,
      totalDescFijo: cantidad * prod.precioDescuentoFijo,
      tipoProducto: prod.tipoProducto,
      descuentoProd: 0,
    };
    let auxSelected = [...selectedProds];
    auxSelected[index] = auxObj;
    setSelectedProds(auxSelected);
    switch (prod.tipoProducto) {
      case 1:
        console.log("Alterando tradicional");
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
  function deleteOrderAndUpdate() {
    if (idPedido === "") {
      setAlert("Por favor, seleccione un pedido");
      setIsAlert(true);
    } else {
      setAlertSec("Cancelando pedido y actualizando kardex");
      setIsAlertSec(true);
      console.log("Id del pedido a cancelar", idPedido);
      console.log("Productos a borrar", auxSelectedProds);
      const objProdsDelete = {
        accion: "add",
        idAlmacen: userStore,
        productos: auxSelectedProds,
      };
      const reStocked = updateStock(objProdsDelete);
      reStocked.then((rs) => {
        console.log("Id del pedido a cancelar", idPedido);
        const canceled = cancelOrder(idPedido);
        canceled.then((cld) => {
          setAlertSec("Pedido cancelado y kardex actualizado, redirigiendo...");
          setIsAlertSec(true);
          setTimeout(() => {
            navigate("/principal");
          }, 1500);
        });
      });
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
      const objUpdateOrder = {
        idPedido: idPedido,
        montoFacturar: totalPrevio,
        montoTotal: totalFacturar,
        descuento: descuento,
        descCalculado: totalDesc,
      };
      var countProdsChanged = 0;
      selectedProds.map((sp) => {
        if (sp.cantProducto === sp.cantPrevia) {
          countProdsChanged++;
        }
        if (sp.cantProducto > sp.cantPrevia) {
          const objProd = {
            idProducto: sp.idProducto,
            cantProducto: sp.cantProducto - sp.cantPrevia,
            totalProd: sp.cantProducto * sp.precioDeFabrica,
          };
          arrayTakes.push(objProd);
        } else {
          const objProd = {
            idProducto: sp.idProducto,
            cantProducto: sp.cantPrevia - sp.cantProducto,
            totalProd: sp.cantProducto * sp.precioDeFabrica,
          };
          arrayAdds.push(objProd);
        }
        if (sp.idPedidoProducto === null) {
          const objProd = {
            idProducto: sp.idProducto,
            cantProducto: sp.cantProducto,
            totalProd: sp.cantProducto * sp.precioDeFabrica,
            descuentoProd: sp.descuentoProd,
            idPedidoProducto: sp.idPedidoProducto,
          };
          objProductsAdded.push(objProd);
        } else {
          const objProd = {
            idPedidoProducto: sp.idPedidoProducto,
            idProducto: sp.idProducto,
            cantProducto: sp.cantProducto,
            totalProd: sp.cantProducto * sp.precioDeFabrica,
            descuentoProd: sp.descuentoProd,
            idPedidoProducto: sp.idPedidoProducto,
          };
          objProductsUpdated.push(objProd);
        }
      });

      if (
        countProdsChanged === selectedProds.length &&
        descuento === prevDisc &&
        auxSelectedProds.length === selectedProds.length
      ) {
        console.log("No se han detectado cambios en el pedido ");
        setAlert("No se han detectado cambios en el pedido ");
        setIsAlert(true);
      } else {
        setAlertSec("Actualizando Pedido");
        setIsAlertSec(true);
        const toUpdateTakes = {
          accion: "take",
          idAlmacen: userStore,
          productos: arrayTakes,
        };
        const updatedStock = updateStock(toUpdateTakes);
        updatedStock
          .then((res) => {
            console.log("Stock Updateado para sacar productos");
            const toUpdateAdds = {
              accion: "add",
              idAlmacen: userStore,
              productos: arrayAdds,
            };
            const updatedStockThen = updateStock(toUpdateAdds);
            updatedStockThen
              .then((res) => {
                console.log("Stock Updateado para reponer productos");
                const toAddProducts = {
                  idPedido: idPedido,
                  productos: objProductsAdded,
                };
                const addedProds = addProductToOrder(toAddProducts);
                addedProds.then((added) => {
                  console.log("Productos agregados a pedido");
                  console.log(added);
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
                      console.log("Productos borrados del array");
                      const updOrder = updateDbOrder(objUpdateOrder);
                      updOrder
                        .then((upo) => {
                          console.log("Productos actualizados en pedido");
                          setAlertSec("Pedido actualizado correctamente");
                          setIsAlertSec(true);
                          setTimeout(() => {
                            navigate("/principal");
                          }, 1500);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    });
                  });
                });
              })
              .catch((error) => {});
            console.log(res);
          })
          .catch((error) => {
            setIsAlertSec(false);
            setAlert(error.response.data.message);
            setIsAlert(true);
            console.log("Error en el update", error.response.data.message);
          });
      }
    }
  }
  function handleDiscount(value) {
    setDescuento(value);
  }

  function processDiscounts() {
    if (tipoUsuario == 1) {
      const objDesc = manualAutomaticDiscount(
        tradicionales,
        pascua,
        halloween,
        navidad,
        especiales,
        sinDesc,
        descuento
      );
      console.log("Testeando resposta", objDesc);
      setDescSimple(objDesc);
      setTotalDesc(objDesc.descCalculado + objDesc.descCalculadoEspeciales);
      setTotalPrevio(objDesc.totalDescontables + objDesc.totalEspecial);
      setTotalFacturar(objDesc.facturar + objDesc.totalTradicional);
      setDiscModalType(false);
      const newSelected = addProductDiscSimple(selectedProds, objDesc);
      newSelected.then((response) => {
        setSelectedProds(response);
      });
      setDiscModal(true);
    } else {
      const tradObj = traditionalDiscounts(
        tradicionales,
        especiales,
        sinDesc,
        discountList
      );
      const pasObj = easterDiscounts(pascua, discountList);
      const navObj = christmassDiscounts(navidad, discountList);
      const hallObj = halloweenDiscounts(halloween, discountList);
      console.log("Objeto tradicionales", tradObj);
      console.log("Objeto pascua", pasObj);
      console.log("Objeto navidad", navObj);
      console.log("Objeto Hall", hallObj);
      setTradObject(tradObj);
      setPasObject(pasObj);
      setNavObject(navObj);
      setHallObject(hallObj);
      setTotalDesc(
        tradObj.descCalculado +
          pasObj.descCalculado +
          navObj.descCalculado +
          hallObj.descCalculado
      );
      setTotalPrevio(
        parseFloat(
          (tradObj.total + pasObj.total + navObj.total + hallObj.total).toFixed(
            2
          )
        )
      );
      setTotalFacturar(
        parseFloat(
          (
            tradObj.facturar +
            pasObj.facturar +
            navObj.facturar +
            hallObj.facturar
          ).toFixed(2)
        )
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
        console.log("Array Alterado", result);
        setSelectedProds(result);
      });
    }
  }
  function validateProductLen() {
    console.log("Especiales", especiales);
    if (selectedProds.length > 0) {
      setAuxProds(selectedProds);
      processDiscounts();
    } else {
      setAlert("Seleccione al menos un producto por favor");
      setIsAlert(true);
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
    console.log("Finded", finded);
    if (finded === undefined) {
      selectProduct(JSON.stringify(product));
      setFiltered("");
    } else {
      setAlert("Producto ya encontrado en la lista");
      setIsAlert(true);
      setFiltered("");
    }

    console.log("Leido por scanner", filtered);
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
          <Modal.Title>ALERTA</Modal.Title>
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
                pascua={pascua}
                navidad={navidad}
                halloween={halloween}
                tradObject={tradObject}
                pasObject={pasObject}
                navObject={navObject}
                hallObject={hallObject}
              />
              <SpecialsTable especiales={especiales} totales={descSimple} />
            </div>
          ) : (
            <div>
              <SimpleDiscountTable totales={descSimple} />
              <SpecialsTable especiales={especiales} totales={descSimple} />
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
          <Form.Select onChange={(e) => setOrderDetails(e.target.value)}>
            <option>Seleccione pedido</option>
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
                min="0"
                max="100"
                value={descuento}
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
                    <th className="tableColumnSmall">Precio</th>
                    <th className="tableColumnSmall">Cantidad</th>
                    <th className="tableColumnMedium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProds.map((product, index) => {
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
                        <td className="tableColumnSmall">
                          {auxAva.find(
                            (pr) => pr.idProducto === product.idProducto
                          ) !== undefined
                            ? auxAva.find(
                                (pr) => pr.idProducto === product.idProducto
                              ).cant_Actual + product.cantPrevia
                            : 0}
                        </td>
                        <td className="tableColumnSmall">{`${product.precioDeFabrica} Bs.`}</td>
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
                  <div className="totalColumnData">{`${totalPrevio} Bs.`}</div>
                </div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText"> Descuento:</div>
                  <div className="totalColumnData">{`${totalDesc?.toFixed(
                    2
                  )}`}</div>
                </div>
                <div className="padded">
                  <div className="totalColumnBlank"></div>
                  <div className="totalColumnText"> A Facturar:</div>
                  <div className="totalColumnData">
                    {`${totalFacturar?.toFixed(2)} Bs.`}
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
    </div>
  );
}
