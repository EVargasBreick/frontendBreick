import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Image, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { getProducts, newProduct } from "../services/productServices";
import {
  addPackid,
  getPacks,
  registerPack,
  updatePack,
  updatePackState,
} from "../services/packServices";
import {
  getCurrentStockStore,
  getProductsGroup,
  initializeStock,
} from "../services/stockServices";
import { dateString } from "../services/dateServices";
import Cookies from "js-cookie";
import { getBranchesPs } from "../services/storeServices";
import { set, update } from "lodash";
import ToastComponent from "./Modals/Toast";
export default function FormEditPack() {
  // Listas cargadas en render
  const [prodList, setProdList] = useState([]);
  const [auxProdList, setAuxProdList] = useState([]);
  // Listas y valores cargados manualmente
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPack, setTotalPack] = useState(0);
  const [nombrePack, setNombrePack] = useState("");
  // Validadores de estado
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [selectedPack, setSelectedPack] = useState("");
  const [packs, setPacks] = useState([]);
  const [allPacks, setAllPacks] = useState([]);
  const [isPack, setIsPack] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedPackId, setSelectedPackId] = useState("");
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productGroupList, setProductGroupList] = useState([]);
  const [branchInfo, setBranchInfo] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("success");
  const userAlmacen = JSON.parse(Cookies.get("userAuth")).idAlmacen;
  const [productStock, setProductStock] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [isAgency, setIsAgency] = useState(false);
  const allProducts = useRef([]);
  const [changeTotal, setChangeTotal] = useState(false);
  const [packId, setPackId] = useState("");
  const [packStatus, setPackStatus] = useState("");
  useEffect(() => {
    const allProducts = getProducts("all");
    allProducts.then((fetchedProducts) => {
      setProdList(fetchedProducts.data.data);
      setAuxProdList(fetchedProducts.data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const tot = selectedProducts.reduce((accumulator, object) => {
        return (
          accumulator +
          (object.cantidadProducto || object.cantProducto) *
            (object.precioDeFabrica || object.precioDeFabrica)
        );
      }, 0);
      if (changeTotal) {
        setTotalPack(selectedProducts[0].precioPack);
      } else {
        setTotalPack(tot);
      }
    }
  }, [changeTotal, selectedPack]);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const tot = selectedProducts.reduce((accumulator, object) => {
        return (
          accumulator +
          (object.cantidadProducto || object.cantProducto) *
            (object.precioDeFabrica || object.precioDeFabrica)
        );
      }, 0);
      if (tot != selectedProducts[0].precioPack) {
        setChangeTotal(true);
      } else {
        setChangeTotal(false);
      }
    }
  }, [selectedProducts]);

  useEffect(() => {
    try {
      setLoading(true);
      const packList = getPacks();
      packList.then((res) => {
        setAllPacks(res.data);
        let uniqueArray = res.data.reduce((acc, curr) => {
          if (!acc.find((obj) => obj.nombrePack === curr.nombrePack)) {
            acc.push(curr);
          }
          return acc;
        }, []);

        setPacks(uniqueArray);
      });
      getStoreStock(userAlmacen);
      const groupList = getProductsGroup();
      groupList.then((res) => {
        console.log("Respuesta de los grupos", res.data);
        setProductGroupList(res.data);
      });

      const suc = getBranchesPs();
      suc.then((resp) => {
        const sucursales = resp.data;
        const alm = JSON.parse(Cookies.get("userAuth")).idAlmacen;

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
    } catch (err) {
      setToastText("Error al cargar packs");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const packsAll = getPacks();
      packsAll.then((res) => {
        const productOriginal = res.data.filter(
          (pk) => pk.idPack == selectedPackId
        );
        const results = productList.filter(
          ({ idProducto: id1 }) =>
            !productOriginal.some(
              ({ idProducto: id2 }) => id2.toString() === id1.toString()
            )
        );
        console.log("Resultados", results);
        if (results.length > 0) {
          setChanged(true);
        } else {
          setChanged(false);
        }
      });
    } catch (err) {
      setToastText("Error al cargar packs");
      setToastType("danger");
      setShowToast(true);
    }
  }, [productList]);

  function getStoreStock(value) {
    setSelectedStoreId(value);
    const stock = getCurrentStockStore(value);
    stock.then((st) => {
      console.log("TCL: getStoreStock -> st", st);
      allProducts.current = st.data;
      setProductStock(st.data);
      setIsAgency(true);
    });
  }

  const handleClose = () => {
    setIsAlert(false);
    setIsAlertSec(false);
    window.location.reload();
  };
  function selectPack(value) {
    setPackId(value);

    setIsPack(true);
    setSelectedPackId(value);
    const prodList = allPacks.filter((pk) => pk.idPack == value);
    console.log("TCL: selectPack -> prodList", prodList);
    setPackStatus(prodList[0].activo);
    setProdList(prodList);
    setAuxProdList(prodList);
    setNombrePack(prodList[0].nombrePack);
    setSelectedProducts(prodList);
    setProductList(prodList);
  }
  function selectProduct(prod) {
    const product = JSON.parse(prod);
    const prodObj = {
      idProducto: product.idProducto,
      nombreProducto: product.nombreProducto,
      codInterno: product.codInterno,
      cantidadProducto: 1,
      precioDeFabrica: product.precioDeFabrica,
    };
    setSelectedProducts([...selectedProducts, prodObj]);
    setProdList(auxProdList);
  }
  function changeQuantities(cantidad, index) {
    const updatedArray = [...selectedProducts];
    updatedArray[index] = {
      ...updatedArray[index],
      cantidadProducto: cantidad,
      cantProducto: cantidad,
    };
    setSelectedProducts(updatedArray);
  }
  function deleteProduct(index) {
    const auxArray = [...selectedProducts];
    auxArray.splice(index, 1);
    setSelectedProducts(auxArray);
  }
  function savePack() {
    const objSave = {
      nombrePack: nombrePack,
      total: totalPack,
      descPack: nombrePack,
      productos: selectedProducts,
    };
    console.log("TCL: savePack -> objSave", objSave);
    const updated = updatePack(objSave);
    updated
      .then((res) => {
        console.log("TCL: savePack -> res", res);
        setToastText("Pack Actualizado Correctamente");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      })
      .catch((err) => {
        setToastText("Error al actualizar pack");
        setToastType("error");
        setShowToast(true);
      })
      .finally(() => {
        console.log("TCL: savePack -> res", showToast);
      });
  }
  function saveProduct(data) {
    const packId = data.data.id;
    const objProd = {
      codInterno: parseInt(500000 + packId),
      nombreProducto: nombrePack,
      descProducto: nombrePack,
      gramajeProducto: 0,
      precioDeFabrica: totalPack,
      codigoBarras: "-",
      cantCajon: 0,
      unidadDeMedida: "Unidad",
      tiempoDeVida: 1,
      activo: 1,
      precioPDV: totalPack,
      cantDisplay: 0,
      aplicaDescuento: "No",
      tipoProducto: 5,
      precioDescuentoFijo: totalPack,
      actividadEconomica: 107900,
      codigoSin: 99100,
      codigoUnidad: 57,
      origenProducto: 1,
    };
    const added = newProduct(objProd);
    added
      .then((res) => {
        const addedId = addPackid({
          idProducto: res.data.id,
          idPack: packId,
        });
        addedId.then((ai) => {
          const inicializado = initializeStock({
            idProducto: res.data.id,
            fechaHora: dateString(),
          });
          inicializado.then((response) => {
            setAlertSec("Pack Guardado Correctamente");
            setIsAlertSec(true);
            setTimeout(() => {
              window.location.reload(false);
            }, 2000);
          });
        });
      })
      .catch((err) => console.log("Error al crear producto", err));
  }

  function searchProduct(value) {
    const filtered = allProducts.current.filter(
      (ap) =>
        ap.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        ap.codInterno == value
    );

    setProductStock(filtered);
  }

  async function changePackStatus() {
    setAlertSec(packStatus == 1 ? "Desactivando Pack" : "Activando Pack");
    setIsAlertSec(true);
    const body = {
      idPack: packId,
      estado: packStatus == 1 ? 0 : 1,
    };
    try {
      const updatedPack = await updatePackState(body);
      console.log("Updated pack", updatedPack);
      const text = packStatus == 1 ? "Desactivado" : "Activado";
      setAlertSec(`Pack ${text} Correctamente`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log("Error al actualizar el pack", err);
      setAlertSec("Error al cambiar el estado del pack");
      setTimeout(() => {
        setIsAlertSec(false);
      }, 2000);
    }
  }

  return (
    <div>
      <ToastComponent
        show={showToast}
        autoclose={2}
        setShow={setShowToast}
        text={toastText}
        type={toastType}
      />
      <div className="formLabel">EDITAR PACKS BREICK</div>
      <div className="formLabelAlt">Seleccionar Pack</div>
      <Form>
        <Form.Select
          onChange={(e) => {
            selectPack(e.target.value);
            setSelectedPack(e.target.value);
          }}
          value={selectedPack}
        >
          <option value={""}>Seleccione pack</option>
          {packs.map((pk, index) => {
            return (
              <option key={index} value={pk.idPack}>
                {pk.nombrePack}
              </option>
            );
          })}
        </Form.Select>
      </Form>
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
            Confirmo, cerrar Mensaje del Sistema
          </Button>
        </Modal.Footer>
      </Modal>

      {selectedProducts.length > 0 ? (
        <div>
          <div style={{ margin: "10px" }}>{`EL PACK SE ENCUENTRA ${
            packStatus == 1 ? "ACTIVADO" : "DESACTIVADO"
          }`}</div>
          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              display: "flex",
              position: "relative",
              left: "0",
            }}
          >
            Agregar Productos
          </div>

          <Form style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Form.Select
              onChange={(e) => selectProduct(e.target.value)}
              style={{ width: "45%" }}
            >
              <option>{"Seleccione producto"}</option>
              {productStock.map((pr, index) => {
                return (
                  <option value={JSON.stringify(pr)} key={index}>
                    {pr.nombreProducto}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control
              style={{ width: "45%" }}
              type="text"
              placeholder="buscar"
              onChange={(e) => searchProduct(e.target.value)}
            />
          </Form>
          <div style={{ margin: "20px" }}>Productos Seleccionados</div>
          <Table className="tableOneAlt">
            <thead className="tableHeader">
              <tr>
                <th className="smallTableCol"></th>
                <th className="largeTableCol">Producto</th>
                <th className="smallTableCol">Precio</th>
                <th className="smallTableCol">Cantidad</th>
                <th className="mediumTableCol">Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((sp, index) => {
                return (
                  <tr className="tableRow" key={index}>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => deleteProduct(index)}
                      >
                        Quitar
                      </Button>
                    </td>
                    <td>{sp.nombreProducto}</td>
                    <td>{sp.precioDeFabrica.toFixed(2)}</td>
                    <td>
                      {
                        <Form>
                          <Form.Control
                            type="number"
                            onChange={(e) => {
                              changeQuantities(e.target.value, index);
                            }}
                            value={sp.cantProducto || sp.cantidadProducto}
                            required
                          />
                        </Form>
                      }
                    </td>
                    <td>
                      {(
                        sp.precioDeFabrica * sp.cantidadProducto ||
                        sp.precioDeFabrica * sp.cantProducto
                      ).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="tableFoot">
              <tr>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      onChange={(e) => setChangeTotal(e.target.checked)}
                      checked={changeTotal}
                    />
                    <label
                      className="form-check-label"
                      for="flexSwitchCheckDefault"
                    >
                      Poner Total Manualmente
                    </label>
                  </div>
                </td>
                <td colSpan={3}>Total</td>

                <td>
                  {
                    <Form>
                      <Form.Control
                        type="number"
                        value={totalPack}
                        onChange={(e) => setTotalPack(e.target.value)}
                        disabled={!changeTotal}
                      />
                    </Form>
                  }
                </td>
              </tr>
            </tfoot>
          </Table>
          <div className="formLabelAlt">Nombre del Pack</div>
          <Form>
            <Form.Control
              disabled
              type="text"
              onChange={(e) => setNombrePack(e.target.value)}
              value={nombrePack}
              placeholder="Ingrese nombre del nuevo pack"
            />
          </Form>
          <div className="formLabelAlt"></div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant={packStatus == 1 ? "danger" : "success"}
              onClick={() => changePackStatus()}
            >
              {packStatus == 1 ? "Desactivar Pack" : "Activar Pack"}
            </Button>
            <Button variant="warning" onClick={() => savePack()}>
              Actualizar Pack
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
