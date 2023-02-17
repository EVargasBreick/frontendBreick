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

import { convertToText } from "../services/numberServices";

import SaleModal from "./saleModal";
import { dateString } from "../services/dateServices";
import { createSale, verifyQuantities } from "../services/saleServices";
import {
  getBranches,
  getBranchesPs,
  getSalePoints,
} from "../services/storeServices";
import {
  createInvoice,
  deleteInvoice,
  otherPaymentsList,
} from "../services/invoiceServices";

import {
  saleDiscount,
  verifyAutomaticDiscount,
} from "../services/discountServices";
import { updateStock } from "../services/orderServices";
import FormSimpleRegisterClient from "./formSimpleRegisterClient";

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
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 700 ? false : true
  );
  const [giftCard, setGiftCard] = useState(0);
  const searchRef = useRef(null);
  const productRef = useRef(null);
  const quantref = useRef(null);
  useEffect(() => {
    searchRef.current.focus();
    const spplited = dateString().split(" ");

    const newly = Cookies.get("nit");
    if (newly) {
      setSearch(newly);
      Cookies.remove("nit");
    }
    const UsuarioAct = Cookies.get("userAuth");

    if (UsuarioAct) {
      const PuntoDeVenta = Cookies.get("pdv");

      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      setUserName(JSON.parse(UsuarioAct).usuario);
      const pl = getSalePoints(JSON.parse(UsuarioAct).idAlmacen);
      pl.then((res) => {
        setPointList(res.data.data[0]);
      });
      if (PuntoDeVenta) {
        setIsPoint(true);
        setPointOfsale(PuntoDeVenta);
      } else {
        setIsPoint(false);
      }
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
      const disponibles = getProductsWithStock(
        JSON.parse(Cookies.get("userAuth")).idAlmacen,
        "all"
      );
      disponibles.then((fetchedAvailable) => {
        setAvailable(fetchedAvailable.data[0]);
        setAuxProducts(fetchedAvailable.data[0]);
      });
      const suc = getBranchesPs();
      suc.then((resp) => {
        const sucursales = resp.data;
        const alm = JSON.parse(Cookies.get("userAuth")).idAlmacen;
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
      if (res.data.data) {
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
          precioDeFabrica: produc.precioDeFabrica,
          descuentoProd: 0,
          total: produc.precioDeFabrica,
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
            precioDeFabrica: selected.precioDeFabrica,
            precioDescuentoFijo: selected.precioDescuentoFijo,
            descuentoProd: 0,
            total: selected.precioDeFabrica,
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
    e.preventDefault();

    const index = selectedProducts.length - 1;
    const selectedProd = selectedProducts[index];

    changeQuantities(index, modalQuantity, selectedProd, false);
    setIsQuantity(false);
    setModalQuantity("");
    searchRef.current.focus();
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
    const arrCant = !isScanner ? cantidad.split(".") : cantidad;
    const isThree =
      cantidad === ""
        ? ""
        : arrCant[1]?.length > process.env.REACT_APP_DECIMALES
        ? prod.cantProducto
        : cantidad;
    const total = parseFloat(prod.precioDeFabrica) * parseFloat(isThree);
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
      total: total,
      descuentoProd: 0,
      unidadDeMedida: prod.unidadDeMedida,
    };
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
    setAuxSelectedProducts(auxSelected);
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
        });
    });
  }
  function saveInvoice(
    cuf,
    cufd,
    autorizacion,
    fechaEmision,
    nro,
    idTransaccion,
    ofp,
    giftCard,
    aPagar
  ) {
    return new Promise((resolve, reject) => {
      setAlertSec("Guardando Venta");
      const invoiceBody = {
        idCliente: selectedClient,
        nroFactura: nro,
        idSucursal: sucursal.idImpuestos,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
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
        autorizacion: autorizacion,
        cufd: cufd,
        fechaEmision: fechaEmision,
        nroTransaccion: idTransaccion,
        idOtroPago: ofp,
        vale: giftCard,
        aPagar: aPagar,
        puntoDeVenta: pointOfSale,
      };
      setInvoice(invoiceBody);
      const newInvoice = createInvoice(invoiceBody);
      newInvoice
        .then((res) => {
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
      <div className="formLabel">VENTAS AGENCIA</div>
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
            tipoDocumento={tipoDoc}
            userName={userName}
            pointOfSale={pointOfSale}
            otherPayments={otherPayments}
            giftCard={giftCard}
            setGiftCard={setGiftCard}
            userStore={userStore}
            userId={usuarioAct}
            saleType="store"
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
                            placeholder="0"
                            value={sp.cantProducto}
                            onChange={(e) => {
                              changeQuantities(index, e.target.value, sp);
                            }}
                          />
                        </td>
                        <td className="smallTableColumn">
                          {sp.total.toFixed(2)}
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
                          return accumulator + object.total;
                        }, 0)
                        .toFixed(2)} Bs.`}
                    </th>
                    <th className="smallTableColumn">
                      {isMobile ? "Total Descon tado" : "Total descontado: "}
                    </th>
                    <th className="smallTableColumn">{`${(
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
                    onClick={() => validateQuantities()}
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
