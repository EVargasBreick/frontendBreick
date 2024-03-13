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
import { verifyQuantities } from "../services/saleServices";
import {
  getBranchesPs,
  getMobileSalePoints,
  getOnlyStores,
  getSalePoints,
} from "../services/storeServices";
import { otherPaymentsList } from "../services/invoiceServices";
import FormSimpleRegisterClient from "./formSimpleRegisterClient";
import {
  roundToTwoDecimalPlaces,
  roundWithFixed,
  rountWithMathFloor,
} from "../services/mathServices";
import SaleModalNew from "./saleModalNew";
import { StoreListModal } from "./Modals/storeListModal";
import { Loader } from "./loader/Loader";

export default function FormNewSaleNew() {
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isLoading, setisLoading] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
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
  const [tipoDoc, setTipoDoc] = useState("");
  const [isSaleModal, setIsSaleModal] = useState(true);
  const [ofp, setOfp] = useState(0);
  const [aPagar, setAPagar] = useState(0);
  const [isCreate, setIsCreate] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [auxProducts, setAuxProducts] = useState([]);
  const [branchInfo, setBranchInfo] = useState({});
  const [auxSelectedProducts, setAuxSelectedProducts] = useState("");
  const [userData, setUserData] = useState({
    userName: "",
    userStore: "",
    userId: "",
  });
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
  const searchRef = useRef(null);
  const productRef = useRef(null);
  const quantref = useRef(null);
  const saleModalRef = useRef();
  const [clientEmail, setClientEmail] = useState("");
  const [testArray, setTestArray] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [isSudoStoreSelected, setIsSudoStoreSelected] = useState(true);
  const [sudoStoreSelected, setSudoStoreSelected] = useState("");
  const [currentStore, setCurrentStore] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabledDiscount, setDisabledDiscount] = useState(false);
  //Procesos al montarse el componente por primera vez

  useEffect(() => {
    searchRef.current.focus();
    const newly = Cookies.get("nit");
    if (newly) {
      setSearch(newly);
      Cookies.remove("nit");
    }

    const sList = getOnlyStores();
    sList.then((stores) => {
      console.log("STORE LIST", stores.data);
      setStoreList(stores.data);
    });

    const UsuarioAct = Cookies.get("userAuth");
    const parsedUser = JSON.parse(UsuarioAct);
    if (UsuarioAct) {
      const isSudoStore = [1, 9, 7, 8, 12].includes(parsedUser.rol);
      const sudStore = Cookies.get("sudostore");
      console.log("SUDSTORE", sudStore);
      if (isSudoStore) {
        if (sudStore) {
          const PuntoDeVenta = Cookies.get("pdv");
          console.log("Datos punto de venta", PuntoDeVenta);
          if (PuntoDeVenta) {
            setIsPoint(true);
            setPointOfsale(PuntoDeVenta);
          } else {
            const mobilepdvdata = getMobileSalePoints(sudStore);
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

          const pl = getSalePoints(sudStore);
          pl.then((res) => {
            setPointList(res.data);
          });
          const suc = getBranchesPs();
          suc.then((resp) => {
            const sucursales = resp.data;
            const alm = sudStore;
            const sucur =
              sucursales.find((sc) => alm == sc.idAgencia) == undefined
                ? sucursales.find((sc) => "AL001" == sc.idAgencia)
                : sucursales.find((sc) => alm == sc.idAgencia);
            const branchData = {
              nombre: sucur.nombre,
              dir: sucur.direccion,
              tel: sucur.telefono,
              ciudad: sucur.ciudad,
              nro: sucur.idImpuestos,
            };
            setBranchInfo(branchData);
          });

          if (Cookies.get("userAuth")) {
            const uData = {
              userName: parsedUser.usuario,
              userStore: sudStore,
              userId: parsedUser.idUsuario,
            };

            setUserData(uData);

            const otrosPagos = otherPaymentsList();
            otrosPagos
              .then((op) => {
                setOtherPayments(op.data);
              })
              .catch((err) => {
                console.log("Otros pagos?", err);
              });
            console.log("PARSED USER", parsedUser);
            const disponibles = getProductsWithStock(sudStore, "all");
            disponibles.then((fetchedAvailable) => {
              const filtered = fetchedAvailable.data.filter(
                (fa) => fa.activo === 1 && fa.codInterno.length > 2
              );
              setAvailable(filtered);
              setAuxProducts(filtered);
            });
          }
        } else {
          console.log("TRIGGERED");
          setIsSudoStoreSelected(false);
        }
      } else {
        const PuntoDeVenta = Cookies.get("pdv");
        console.log("Datos punto de venta", PuntoDeVenta);
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
          setPointList(res.data);
        });
        const suc = getBranchesPs();
        suc.then((resp) => {
          const sucursales = resp.data;
          const alm = parsedUser.idAlmacen;
          const sucur =
            sucursales.find((sc) => alm == sc.idAgencia) == undefined
              ? sucursales.find((sc) => "AL001" == sc.idAgencia)
              : sucursales.find((sc) => alm == sc.idAgencia);
          const branchData = {
            nombre: sucur.nombre,
            dir: sucur.direccion,
            tel: sucur.telefono,
            ciudad: sucur.ciudad,
            nro: sucur.idImpuestos,
          };
          setBranchInfo(branchData);
        });

        if (Cookies.get("userAuth")) {
          const uData = {
            userName: parsedUser.usuario,
            userStore: parsedUser.idAlmacen,
            userId: parsedUser.idUsuario,
          };

          setUserData(uData);

          const otrosPagos = otherPaymentsList();
          otrosPagos
            .then((op) => {
              setOtherPayments(op.data);
            })
            .catch((err) => {
              console.log("Otros pagos?", err);
            });
          console.log("PARSED USER", parsedUser);
          const disponibles = getProductsWithStock(parsedUser.idAlmacen, "all");
          disponibles.then((fetchedAvailable) => {
            console.log("FETCHED", fetchedAvailable.data);
            const filtered = fetchedAvailable.data.filter(
              (fa) => fa.activo === 1 && fa.codInterno.length > 2
            );
            setAvailable(filtered);
            setAuxProducts(filtered);
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const foundDisc = selectedProducts.filter((sp) => sp.descuentoProd > 0);
      const foundWD = selectedProducts.filter((sp) => sp.tipoProducto > 4);
      if (foundDisc.length > 0 || foundWD.length > 0) {
        console.log("Deberia desactivarse");
        setDisabledDiscount(true);
      } else {
        console.log("No deberia desactivarse");
        setDisabledDiscount(false);
      }
    }
  }, [selectedProducts]);

  //Maneja el ancho de la pantalla para determinar display movil o pc

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //En base al descuento ingresado, setea el total a facturar

  useEffect(() => {
    setTotalFacturar(Number(totalFacturar) * (1 - Number(descuento) / 100));
    setTotalDesc(totalFacturar - totalFacturar * (1 - descuento / 100));
  }, [descuento]);

  //Pone el focus en el formulario del Modal de Cantidades

  useEffect(() => {
    if (isQuantity) {
      quantref.current.focus();
    }
  }, [isQuantity]);

  const handleSelection = (value) => {
    setLoading(true);
    setIsPoint(true);
    setIsSudoStoreSelected(true);
    setSudoStoreSelected(value);
    Cookies.set("sudostore", value, { expires: 0.5 });
    setTimeout(() => {
      Cookies.remove("pdv");
      window.location.reload();
    }, 500);
  };

  //Busqueda de clientes

  function searchClient(e) {
    e.preventDefault();
    setIsSelected(false);
    setClientes([]);
    setisLoading(true);
    const found = getClient(search);
    found.then((res) => {
      const cli = res.data.data;
      if (cli.length > 0) {
        setIsClient(true);
        if (search == "0") {
          const filtered = cli.find((cl) => cl.nit == "0");
          filterSelectedOnlyClient([filtered]);
          setClientEmail(filtered.correo);
        } else {
          if (cli.length == 1) {
            filterSelectedOnlyClient(cli);
            setClientEmail(cli[0].correo);
          } else {
            setClientes(cli);
          }
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

  //Funcion de busqueda de productos

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

  //Filtrado de clientes

  function filterSelectedClient(id) {
    const searchObject = clientes.find((cli) => cli.idCliente === id);
    const array = [];
    array.push(searchObject);
    setClientes(array);
    setIsSelected(true);
    setSelectedClient(searchObject.idCliente);
    setTipoDoc(searchObject.tipoDocumento);
    setClientEmail(searchObject.correo);
    productRef.current.focus();
  }

  function filterSelectedOnlyClient(cliente) {
    const client = cliente[0];
    setSelectedClient(client.idCliente);
    setClientes(cliente);
    setIsSelected(true);
    setTipoDoc(client.tipoDocumento);
    productRef.current.focus();
  }

  //Agregar productos a la lista

  function addProductToList(product) {
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
      const precioElegido =
        userData.userStore === "AG009"
          ? produc.precioPDV
          : clientes[0]?.issuper == 1
          ? produc.precioSuper
          : produc.precioDeFabrica;

      const rounded =
        produc.unidadDeMedida == "Unidad"
          ? parseInt(modalQuantity)
          : Number(modalQuantity).toFixed(3);

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
        total: precioElegido * rounded,
        tipoProducto: produc.tipoProducto,
        unidadDeMedida: produc.unidadDeMedida,
      };
      setCurrentProd(productObj);
      setSelectedProducts([...selectedProducts, productObj]);
      setAuxSelectedProducts([...auxSelectedProducts, productObj]);
      setFiltered("");
      searchRef.current.focus();
    }
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

  //Manejo de cantidades

  function changeQuantitiesModal() {
    addProductToList(JSON.stringify(currentProd));
    setIsQuantity(false);
    setModalQuantity("");
    searchRef.current.focus();
  }

  function handleModalQuantity(cantidad) {
    console.log(Number(cantidad).toFixed(3));
    setModalQuantity(cantidad);
  }

  function changeQuantities(index, cantidad, prod) {
    console.log("CANTIDAD", cantidad);
    const rounded =
      prod.unidadDeMedida == "Unidad"
        ? Math.floor(cantidad)
        : parseFloat(Number(cantidad).toFixed(3));
    console.log("ROUNDED", rounded);
    const total = Number(Number(prod.precioDeFabrica * rounded).toFixed(2));
    console.log("TOTAL TESTEANDO DEC", total);
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
      precioDeFabrica: Number(Number(prod.precioDeFabrica).toFixed(2)),
      precioDescuentoFijo: Number(prod.precioDescuentoFijo).toFixed(2),
      total: total,
      tipoProducto: prod.tipoProducto,
      descuentoProd: 0,
      unidadDeMedida: prod.unidadDeMedida,
    };
    console.log("Aux object", auxObj);
    let auxSelected = [...selectedProducts];
    auxSelected[index] = auxObj;
    setSelectedProducts(auxSelected);
    setAuxSelectedProducts(auxSelected);
  }

  //Cerrar modales

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

  //Cambiar descuentos individuales

  function changeDiscount(index, descuento) {
    console.log("Descuento ingresado", descuento);
    const auxSelected = [...selectedProducts];
    auxSelected[index].descuentoProd = descuento;
    console.log("Descuentazo", auxSelected);
    setSelectedProducts(auxSelected);
    setAuxSelectedProducts(auxSelected);
    setTestArray(auxSelected);
    setDescuento(0);
  }

  //Calcular totales

  async function calculateTotals() {
    let totalNeto = 0;
    let descuentoCalculado = 0;
    const auxiliarArray = [...auxSelectedProducts];
    const array = [];
    for (const product of auxiliarArray) {
      const descCalcIndividual =
        (product.total * Number(product.descuentoProd)) / 100;
      const descCalcTot = Number(
        (product.total - descCalcIndividual) * (1 - descuento / 100)
      );
      const descCalculadoCompuesto =
        Math.round((product.total - descCalcTot) * 100) / 100;

      totalNeto += Number(roundToTwoDecimalPlaces(product.total));
      descuentoCalculado += Number(
        roundToTwoDecimalPlaces(descCalculadoCompuesto)
      );

      // Create a new object to avoid modifying the original object
      const auxProd = { ...product, descuentoProd: descCalculadoCompuesto };
      array.push(auxProd);
    }
    console.log("TOTAL NETO", totalNeto);
    setTotalPrevio(rountWithMathFloor(totalNeto));
    setTotalDesc(rountWithMathFloor(descuentoCalculado));
    setTotalFacturar(rountWithMathFloor(totalNeto - descuentoCalculado));
    setSelectedProducts(array);
  }

  //Visibilizar modal de pagos

  function handleModal() {
    if (isSelected) {
      calculateTotals();
      setTimeout(() => {
        setIsInvoice(true);
        setIsSaleModal(true);
      }, 100);
    } else {
      setAlert("Por favor, seleccione un cliente");
      setIsAlert(true);
    }
  }

  //Validar cantidades

  function validateQuantities() {
    const validated = verifyQuantities(selectedProducts);
    validated
      .then(() => {
        handleModal();
      })
      .catch((err) => {
        setAlert(err);
        setIsAlert(true);
      });
  }

  //Crear cliente en caso de no existir

  function createNewClient(e) {
    e.preventDefault();
    setIsCreate(true);
  }

  //Manejar Punto de venta

  function handleSalePoint(id) {
    setPointOfsale(id);
    Cookies.set("pdv", id, { expires: 0.5 });
    setIsPoint(true);
  }

  return (
    <div>
      <div className="formLabel">{`Ventas ${
        storeList
          .find((sl) => sl.idAgencia == userData.userStore)
          ?.Nombre?.substring(5)
          ? storeList
              .find((sl) => sl.idAgencia == userData.userStore)
              ?.Nombre?.substring(5)
          : "Detectando ..."
      }`}</div>

      <StoreListModal
        sudoStoreSelected={sudoStoreSelected}
        show={isSudoStoreSelected}
        handleSelection={handleSelection}
      />

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
          <Modal.Header className="modalHeader">{`INGRESE CANTIDAD`}</Modal.Header>
          <Modal.Body>
            <div className="productModal">{`${
              currentProd.nombreProducto
            } - ${currentProd.precioDeFabrica?.toFixed(2)} Bs`}</div>
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
      <Modal show={isCreate} size="lg">
        <Modal.Header>
          <Modal.Title>Clientes</Modal.Title>
        </Modal.Header>
        <Modal.Body className="formModalAlt">
          <FormSimpleRegisterClient
            isModal={true}
            idUsuario={usuarioAct}
            nit={search}
            setIsCreate={setIsCreate}
            handleCloseProp={handleClose}
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
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validateQuantities();
          }}
        >
          {auxSelectedProducts.length > 0 ? (
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
                    <th className="smallTableColumn">Descuento %</th>

                    <th className="smallTableColumn">Total</th>

                    <th className="smallTableColumn">
                      {isMobile ? "Total Desc" : "Total con Descuento"}
                    </th>
                    <th className="smallTableColumn">
                      {isMobile ? "Cant Disp" : "Cantidad Disponible"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auxSelectedProducts.map((sp, index) => {
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
                          <div className="input-group mb-3">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="0"
                              aria-label="0"
                              aria-describedby="0 de descuento"
                              min={0}
                              max={100}
                              value={sp.descuentoProd}
                              disabled={sp.tipoProducto > 4}
                              onChange={(e) => {
                                const inputRes = Number(e.target.value);

                                if (
                                  inputRes > 100 ||
                                  inputRes < 0 ||
                                  typeof inputRes !== "number"
                                ) {
                                  return;
                                }

                                changeDiscount(index, inputRes);
                              }}
                            />
                            <div className="input-group-append">
                              <span
                                className="input-group-text"
                                id="basic-addon2"
                              >
                                %
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="smallTableColumn">
                          {parseFloat(Number(sp.total)).toFixed(2)}
                        </td>

                        <td>
                          {parseFloat(
                            Number(sp.total) * (1 - sp.descuentoProd / 100)
                          ).toFixed(2)}
                        </td>
                        <td className="smallTableColumn">
                          {sp.unidadDeMedida == "Unidad"
                            ? parseInt(sp.cant_Actual)
                            : rountWithMathFloor(sp.cant_Actual)}
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
                    <th></th>

                    <th className="smallTableColumn">{"Total: "}</th>
                    <th className="smallTableColumn">
                      {`${roundToTwoDecimalPlaces(
                        selectedProducts.reduce((accumulator, object) => {
                          return accumulator + Number(object.total);
                        }, 0)
                      )} Bs.`}
                    </th>
                    <th className="smallTableColumn">
                      {isMobile ? "Total Descontado" : "Total descontado: "}
                    </th>
                    <th className="smallTableColumn">{`${roundToTwoDecimalPlaces(
                      (selectedProducts.reduce((accumulator, object) => {
                        return (
                          accumulator +
                          object.total * (1 - object.descuentoProd / 100)
                        );
                      }, 0) *
                        (100 - descuento)) /
                        100
                    )}
                     Bs.`}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </Table>
              <Form.Group>
                <Form.Group>
                  <div className="formLabel">DESCUENTO (%)</div>
                  <div className="percent">
                    <Form.Control
                      disabled={disabledDiscount}
                      min="0"
                      max="100"
                      value={descuento}
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
      {loading && <Loader />}
    </div>
  );
}
