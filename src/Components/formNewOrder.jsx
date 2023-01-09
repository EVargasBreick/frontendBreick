import React, { useState } from "react";
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
  getUserStock,
  productsDiscount,
} from "../services/productServices";
import Cookies from "js-cookie";
import {
  availabilityInterval,
  createOrder,
  getOrderList,
  sendOrderEmail,
  updateStock,
} from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { dateString } from "../services/dateServices";
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
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      console.log("Usuario actual", UsuarioAct);
      setUserEmail(JSON.parse(UsuarioAct).correo);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
    }
    if (Cookies.get("userAuth")) {
      setUsuarioAct(JSON.parse(Cookies.get("userAuth")).idUsuario);
      setTipoUsuario(JSON.parse(Cookies.get("userAuth")).tipoUsuario);
      const disponibles = availableProducts(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      disponibles.then((fetchedAvailable) => {
        setAvailable(fetchedAvailable.data.data[0]);
        setAuxProducts(fetchedAvailable.data.data[0]);
        console.log("Disponibles", fetchedAvailable.data.data[0]);
      });
      const dl = productsDiscount(
        JSON.parse(Cookies.get("userAuth")).idUsuario
      );
      dl.then((res) => {
        console.log("Descuentos para el usuario", res.data.data[0]);
        setDiscountList(res.data.data[0]);
      });
      /*const interval = setInterval(() => {
        const disponibles = availableProducts(
          JSON.parse(Cookies.get("userAuth")).idUsuario
        );
        disponibles.then((fetchedAvailable) => {
          console.log("Stock automaticamente actualizado");
          setAvailable(fetchedAvailable.data.data[0]);
        });
      }, 300000);*/
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
        setIsAlert(true);
        setAlert("Usuario no encontrado");
      }
    });
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

  function selectProduct(product) {
    const parsed = JSON.parse(product);
    console.log("Tipo de pedido seleccionado", parsed.tipoProducto);

    var aux = false;
    const prodObj = {
      cantPrevia: 0,
      cantProducto: 0,
      cant_Actual: parsed.cant_Actual,
      codInterno: parsed.codInterno,
      idProducto: parsed.idProducto,
      nombreProducto: parsed.nombreProducto,
      precioDeFabrica: parsed.precioDeFabrica,
      precioDescuentoFijo: parsed.precioDescuentoFijo,
      codigoBarras: parsed.codigoBarras,
      totalProd: 0,
      totalDescFijo: 0,
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
      console.log("Producto seleccionado", prodObj);
      setSelectedProds([...selectedProds, prodObj]);
    }
    setIsProduct(true);
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
        console.log("Alterando tradicional");
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
  function changeQuantitys(index, cantidad, prod) {
    let auxObj = {
      cant_Actual: prod.cant_Actual,
      cantPrevia: prod.cantPrevia,
      cantProducto: cantidad,
      codInterno: prod.codInterno,
      codigoBarras: prod.codigoBarras,
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
        console.log("Array especiales", especiales);
        console.log("Id Producto", prod.idProducto);
        const espIndex = especiales.findIndex(
          (ep) => ep.codInterno == prod.codInterno
        );
        console.log("Index de especiales", espIndex);
        const eaux = [...especiales];
        eaux[espIndex] = auxObj;
        setEspeciales(eaux);
        break;
    }
  }

  function handleType(value) {
    setTipo(value);
    if (value === "muestra") {
      setDescuento(0);
      setIsDesc(true);
    } else {
      setIsDesc(false);
    }
  }
  function structureOrder(availables) {
    console.log("Se corrio la funcion de validar campos");
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
        const dispo = availables.find(
          (av) => pr.codInterno === av.codInterno
        ).cant_Actual;
        console.log(
          `Cantidad escogida: ${pr.cantProducto}, disponibilidad ${dispo}`
        );
        if (pr.cantProducto > dispo) {
          error = true;
          setAlert(
            "Uno de los valores ingresados excede la capacidad disponible actualizada"
          );
        }
        if (pr.cantProducto < 1 || pr.cantProducto === "") {
          error = true;
          setAlert("La cantidad elegida de algun producto esta en 0");
        }
      });

      resolve(error);
    });
  }

  async function validateAvailability() {
    setDiscModal(false);
    console.log("Se corrio la funcion de validacion y espera");
    setIsAlertSec(true);
    setAlertSec("Validando Pedido");
    setTimeout(() => {
      const validateAva = availabilityInterval();
      validateAva.then((res) => {
        console.log("Esperaste:", res);
        const disponibles = availableProducts(
          JSON.parse(Cookies.get("userAuth")).idUsuario
        );
        disponibles.then((fetchedAvailable) => {
          console.log("Disponibilidad verificada");
          const avaSetted = async () => {
            const setted = asyncSetAva(fetchedAvailable.data.data[0]);
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

  const asyncSetAva = (array) => {
    return new Promise((resolve) => {
      setAvailable(array);
      resolve(true);
    });
  };

  function saveOrder(availables) {
    const validatedOrder = structureOrder(availables);
    validatedOrder.then((res) => {
      setisLoading(true);
      const tot = selectedProds.reduce((accumulator, object) => {
        return accumulator + object.totalProd;
      }, 0);
      console.log("Respuesta del validador", res);
      if (!res) {
        setAlertSec("Creando pedido ...");
        setIsAlertSec(true);
        const ped = {
          productos: selectedProds,
          total: tot,
        };

        const objPedido = {
          pedido: {
            idUsuarioCrea: usuarioAct,
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
          },
          productos: selectedProds,
        };
        console.log("Objeto siendo enviado al pedido", objPedido);
        setPedidoFinal(ped);
        const stockObject = {
          accion: "take",
          idAlmacen: userStore,
          productos: selectedProds,
        };
        const updatedStock = updateStock(stockObject);
        updatedStock
          .then((updatedRes) => {
            console.log("Stock updateado", updatedRes);
            const newOrder = createOrder(objPedido);
            newOrder
              .then((res) => {
                console.log("Resposta del pedido", res.data.data.idCreado);
                const codPedido = getOrderList(res.data.data.idCreado);
                codPedido.then((res) => {
                  console.log(
                    "Codigo del pedido creado:",
                    res.data.data[0][0].codigoPedido
                  );
                  const emailBody = {
                    codigoPedido: res.data.data[0][0].codigoPedido,
                    correoUsuario: userEmail,
                    fecha: dateString(),
                  };
                  const emailSent = sendOrderEmail(emailBody);
                  emailSent
                    .then((response) => {
                      setIsAlertSec(false);
                      console.log("Respuesta de la creacion", response);
                      setAlert("Pedido Creado correctamente");
                      setIsAlert(true);
                      setTimeout(() => {
                        navigate("/principal");
                        setisLoading(false);
                      }, 3000);
                    })
                    .catch((error) => {
                      console.log("Error al enviar el correo", error);
                    });
                });
              })
              .catch((error) => {
                console.log("Error", error);
              });
          })
          .catch((error) => {
            console.log("errooooooor");
            setIsAlertSec(false);
            setAlert(error.response.data.message);
            setIsAlert(true);
            console.log("Error de updateo", error.response.data.message);
          });
      } else {
        setIsAlert(true);
      }
    });
  }
  function handleDiscount(value) {
    setDescuento(value);
  }

  function validateProductLen() {
    if (selectedClient != "") {
      if (selectedProds.length > 0) {
        setAuxProds(selectedProds);
        processDiscounts();
      } else {
        setAlert("Seleccione al menos un producto por favor");
        setIsAlert(true);
      }
    } else {
      setAlert("Seleccione un cliente por favor");

      setIsAlert(true);
    }
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
          parseFloat(pasObject.descCalculado) +
          parseFloat(tradObject.descCalculado) +
          parseFloat(navObject.descCalculado) +
          parseFloat(hallObject.descCalculado)
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
          parseFloat(tradObject.facturar) +
          parseFloat(pasObject.facturar) +
          parseFloat(navObject.facturar) +
          parseFloat(hallObject.facturar)
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
        console.log("Array Alterado", result);
        setSelectedProds(result);
      });
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
      const index = selectedProds.findIndex(
        (sp) => sp.codigoBarras == filtered
      );
      console.log("Index encontrao", index);
      console.log("Cantidad previa", selectedProds[index].cantProducto);
      changeQuantitys(index, selectedProds[index].cantProducto + 1, product);
      setFiltered("");
    }

    console.log("Leido por scanner", filtered);
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
              <SpecialsTable
                especiales={especiales}
                totales={descSimple}
                isEsp={isSpecial}
              />
            </div>
          ) : (
            <div>
              <SimpleDiscountTable totales={descSimple} />
              <SpecialsTable
                especiales={especiales}
                totales={descSimple}
                isEsp={isSpecial}
              />
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
        />
        <Button
          variant="warning"
          className="search"
          onClick={() => searchClient()}
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
      <div className="formLabel">SELECCIONE TIPO PEDIDO</div>
      <div>
        <Form>
          <Form.Group className="mb-3" controlId="order">
            <Form.Select
              className="selectorHalf"
              onChange={(e) => handleType(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="muestra">Muestra</option>
              <option value="reserva">Reserva</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <div className="comments">
              <Form.Control
                type="text"
                onChange={(e) => {
                  setObservaciones(e.target.value);
                }}
                value={observaciones}
                placeholder="Observaciones"
              ></Form.Control>
            </div>
          </Form.Group>
          <Form.Group>
            <div className="formLabel">DESCUENTO (%)</div>
            <div className="percent">
              <Form.Control
                min="0"
                max="100"
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
                    <th className="tableColumnSmall"></th>
                    <th className="tableColumnSmall">Codigo Producto</th>
                    <th className="tableColumn">Producto</th>
                    <th className="tableColumnSmall">Precio Unidad</th>
                    <th className="tableColumnSmall">Cantidad</th>
                    <th className="tableColumnSmall">Total</th>
                    <th className="tableColumnSmall">Cantidad Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {[...selectedProds].map((sp, index) => {
                    return (
                      <tr className="tableRow" key={index}>
                        <td className="tableColumnSmall">
                          <div>
                            <Button
                              onClick={() =>
                                deleteProduct(index, sp.codInterno, sp)
                              }
                              variant="warning"
                              className="tableButtonAlt"
                            >
                              Quitar
                            </Button>
                          </div>
                        </td>
                        <td className="tableColumnSmall">{sp.codInterno}</td>
                        <td className="tableColumn">{sp.nombreProducto}</td>
                        <td className="tableColumnSmall">
                          {sp.precioDeFabrica + " Bs."}
                        </td>
                        <td className="tableColumnSmall">
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
                        <td className="tableColumnSmall">
                          {sp.totalProd?.toFixed(2)}
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

                    <th className="tableColumnSmall"></th>

                    <th className="tableColumnSmall">{"Total: "}</th>
                    <th className="tableColumnSmall">
                      {`${selectedProds
                        .reduce((accumulator, object) => {
                          return accumulator + object.totalProd;
                        }, 0)
                        .toFixed(2)}`}
                    </th>
                    <th className="tableColumnSmall"></th>
                  </tr>
                </tfoot>
              </Table>
            </div>
          ) : null}
          <Form.Group>
            <div className="formLabel">CONFIRMAR PRODUCTOS</div>
            <div className="percent">
              <Button
                variant="warning"
                className="yellowLarge"
                onClick={() => validateProductLen()}
              >
                {isLoading ? (
                  <Image src={loading2} style={{ width: "5%" }} />
                ) : (
                  "Procesar descuentos"
                )}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
