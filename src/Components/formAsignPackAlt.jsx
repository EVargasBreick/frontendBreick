import React, { useState, useEffect, useRef } from "react";
import { Button, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { getPacks } from "../services/packServices";
import {
  getCurrentStockStore,
  getProductsGroup,
} from "../services/stockServices";
import { updateMultipleStock } from "../services/orderServices";
import Cookies from "js-cookie";
import { ConfirmModal } from "./Modals/confirmModal";
import ToastComponent from "./Modals/Toast";
import { set } from "lodash";
import { Loader } from "./loader/Loader";
import { PackageDropComponent } from "./packacgeDropComponent";
import { getBranchesPs } from "../services/storeServices";
import { handleDownloadPdf } from "../services/utils";
import ReactToPrint from "react-to-print";
import LoadingModal from "./Modals/loadingModal";

export default function FormAsignPack() {
  const [packs, setPacks] = useState([]);
  const [allPacks, setAllPacks] = useState([]);
  const [selectedPackId, setSelectedPackId] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [productStock, setProductStock] = useState([]);
  const [productList, setProductList] = useState([]);
  const [cantPack, setCantPack] = useState(0);
  const [isAgency, setIsAgency] = useState(false);
  const [isPack, setIsPack] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState("");
  const [productGroupList, setProductGroupList] = useState([]);
  const [modalText, setModalText] = useState("");
  const [changed, setChanged] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [filtered, setFiltered] = useState("");
  const [auxPacks, setAuxPacks] = useState([]);
  // ref
  const dropRef = useRef();
  const [branchInfo, setBranchInfo] = useState({});
  const invoiceRef = useRef();

  const refRestante = useRef([]);

  const sudostore = Cookies.get("sudostore");

  const userAlmacen = sudostore
    ? sudostore
    : JSON.parse(Cookies.get("userAuth"))?.idAlmacen;

  useEffect(() => {
    try {
      setLoading(true);
      const packList = getPacks();
      packList.then((res) => {
        console.log("Packs para amar", res.data);
        const filtered = res.data.filter((data) => data.activo == 1);
        setAllPacks(filtered);
        let uniqueArray = filtered.reduce((acc, curr) => {
          if (!acc.find((obj) => obj.nombrePack === curr.nombrePack)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setAuxPacks(uniqueArray);
        setPacks(uniqueArray);
      });
      getStoreStock(userAlmacen);
      const groupList = getProductsGroup();
      groupList.then((res) => {
        //console.log("Respuesta de los grupos", res.data);
        setProductGroupList(res.data);
      });

      const suc = getBranchesPs();
      suc.then((resp) => {
        const sucursales = resp.data;
        const alm = sudostore
          ? sudostore
          : JSON.parse(Cookies.get("userAuth")).idAlmacen;

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
        //console.log("Resultados", results);
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
      setProductStock(st.data);
      setIsAgency(true);
    });
  }
  function selectPack(value) {
    refRestante.current = [];
    setIsPack(true);
    setSelectedPackId(value);
    const prodList = allPacks.filter((pk) => pk.idPack == value);
    //console.log("Pack seleccionado", prodList);
    setProductList(prodList);
  }
  async function asignPack() {
    setShowModal(false);
    setAlert("Armando Packs");
    setIsAlert(true);
    try {
      setLoading(true);
      const selectedProducts = [];
      productList.map((pl) => {
        const prodObj = {
          idProducto: pl.idProducto,
          cantProducto: pl.cantProducto * cantPack,
        };
        selectedProducts.push(prodObj);
      });
      const objProdsTake = {
        accion: "take",
        idAlmacen: selectedStoreId,
        productos: selectedProducts,
        detalle: `SPPACK-${selectedPackId}`,
      };
      const found = productList.find(
        (pl) => (pl.idPack = selectedPackId)
      ).idPackProd;

      const objProdsAdd = {
        accion: "add",
        idAlmacen: selectedStoreId,
        productos: [
          {
            idProducto: found,
            cantProducto: cantPack,
          },
        ],
        detalle: `ACPACK-${selectedPackId}`,
      };
      const updateMultiple = await updateMultipleStock([
        objProdsTake,
        objProdsAdd,
      ]);
      if (updateMultiple.data.code !== 200) {
        throw new Error("Error al asignar pack");
      }
      setToastText("Pack asignado correctamente");
      setToastType("success");
    } catch (err) {
      setToastText("Error al asignar pack");
      setToastType("danger");
    } finally {
      if (invoiceRef.current) {
        invoiceRef.current.click();
      }
      // getStoreStock(userAlmacen);
      setShowModal(false);
      setLoading(false);
      setShowToast(true);
      // setCantPack(0);
      // setIsPack(false);
      // setSelectedPack("");
      // setProductList([]);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if some in ref is negative show modal
    const isNegative = refRestante.current.some((r) => r < 0);
    if (isNegative) {
      setShowButtons(false);
      setModalText(
        <>
          <h2 className="text-danger">
            No hay suficiente stock para armar el pack, revise los productos
          </h2>
        </>
      );
      setShowModal(true);
    } else {
      setShowButtons(true);
      const packsAll = await getPacks();
      const productOriginal = packsAll.data.filter(
        (pk) => pk.idPack == selectedPackId
      );
      const results = productList.filter(
        ({ idProducto: id1 }) =>
          !productOriginal.some(
            ({ idProducto: id2 }) => id2.toString() === id1.toString()
          )
      );

      const stock = getCurrentStockStore(selectedStoreId);
      const lastCantidadList = [];
      const updateCantidadList = [];
      stock.then((st) => {
        productList.forEach((pl) => {
          const updateCantidad = st.data.find(
            (ps) => pl.idProducto == ps.idProducto
          ).cantidad;
          const lastCantidad = productStock.find(
            (ps) => pl.idProducto == ps.idProducto
          ).cantidad;

          updateCantidadList.push(updateCantidad);
          lastCantidadList.push(lastCantidad);
        });

        setProductStock(st.data);

        // if lastCantidadList is different from updateCantidadList show modal
        const isDifferent = lastCantidadList.some(
          (r, index) => r != updateCantidadList[index]
        );
        if (isDifferent) {
          setShowButtons(false);
          setModalText(
            <>
              <h2 className="text-danger">
                Hubo cambios en el stock de los productos, revise los productos
              </h2>
            </>
          );
          setShowModal(true);
        } else {
          setShowButtons(true);
          setModalText(
            <>
              <Table>
                <thead className="tableHeader">
                  <tr>
                    <th>Nro</th>
                    <th>Producto</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((pl, index) => {
                    return (
                      <tr key={index} className="tableRow">
                        <td>{index + 1}</td>
                        <td>{pl.nombreProducto}</td>
                        <td>{pl.cantProducto * cantPack}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </Table>
              {results.length > 0 ? (
                <h2 className="text-danger">
                  Hubo cambios en los productos del pack original
                </h2>
              ) : null}
            </>
          );
          setShowModal(true);
        }
      });
    }
  };

  function filterPack(value) {
    setFiltered(value);
    const filtered = auxPacks.filter((ap) =>
      ap.nombrePack.toLowerCase().includes(value.toLowerCase())
    );
    setPacks(filtered);
  }

  function handleProductChange(index, idProducto) {
    if (productList[index].idProducto !== idProducto) {
      const auxProdList = [...productList];
      const found = productStock.find((ps) => ps.idProducto == idProducto);
      auxProdList[index].idProducto = idProducto;
      auxProdList[index].nombreProducto = found.nombreProducto;
      auxProdList[index].precioDeFabrica = found.precioDeFabrica;
      setProductList(auxProdList);
      //console.log("Cambiado");
      setChanged(true);
    }
  }

  async function restoreOriginalPack() {
    const packsAll = await getPacks();
    const productOriginal = packsAll.data.filter(
      (pk) => pk.idPack == selectedPackId
    );
    setProductList(productOriginal);
    setChanged(false);
  }

  return (
    <div>
      <div className="formLabel">Armar Packs</div>
      <ConfirmModal
        isButtons={showButtons}
        show={showModal}
        setShow={setShowModal}
        title={`Asignar ${cantPack} Pack(s)?`}
        text={modalText}
        handleSubmit={() => asignPack()}
        handleCancel={() => setShowModal(false)}
      />
      <ToastComponent
        show={showToast}
        autoclose={2}
        setShow={setShowToast}
        text={toastText}
        type={toastType}
      />
      <LoadingModal isAlertSec={isAlert} alertSec={alert} />

      <Form
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginBottom: "10px",
        }}
      >
        <Form.Select
          style={{ width: "40%" }}
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
        <Form.Control
          style={{ width: "40%" }}
          placeholder="buscar por nombre"
          value={filtered}
          onChange={(e) => filterPack(e.target.value)}
        />
      </Form>

      <div className="formLabel">Detalles pack seleccionado</div>
      <div>
        {isAgency && isPack ? (
          <div>
            <Form onSubmit={handleSubmit}>
              <Table>
                <thead className="tableHeader">
                  <tr>
                    <th>Nro</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Disponible</th>
                    <th>Restante</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((pl, index) => {
                    const isInGroup = productGroupList.find(
                      (pg) => pg.idProducto == pl.idProducto
                    );
                    const optionList = isInGroup
                      ? productGroupList.filter(
                          (pgl) => pgl.idGrupo == isInGroup?.idGrupo
                        )
                      : [];
                    const restante =
                      productStock.find((ps) => pl.idProducto == ps.idProducto)
                        .cantidad -
                      pl.cantProducto * cantPack;

                    refRestante.current[index] = Number(restante);

                    return (
                      <tr key={index} className="tableRow">
                        <td>{index + 1}</td>
                        <td>
                          {isInGroup ? (
                            <Form.Group>
                              <Form.Select
                                onChange={(e) =>
                                  handleProductChange(index, e.target.value)
                                }
                              >
                                <option value={pl.idProducto}>
                                  {pl.nombreProducto}
                                </option>

                                {optionList.map((ol, index) => {
                                  return pl.idProducto != ol.idProducto ? (
                                    <option key={index} value={ol.idProducto}>
                                      {
                                        productStock.find(
                                          (ps) =>
                                            ps.idProducto === ol.idProducto
                                        )?.nombreProducto
                                      }
                                    </option>
                                  ) : null;
                                })}
                              </Form.Select>
                            </Form.Group>
                          ) : (
                            pl.nombreProducto
                          )}
                        </td>
                        <td>{pl.cantProducto}</td>
                        <td>{pl.cantProducto * cantPack}</td>
                        <td>
                          {
                            productStock.find(
                              (ps) => pl.idProducto == ps.idProducto
                            ).cantidad
                          }
                        </td>
                        <td
                          style={{
                            color: restante < 0 ? "red" : "",
                            fontSize: restante < 0 ? "x-large" : "",
                          }}
                        >
                          {restante}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </Table>
              <div>
                <div className="formLabel">Cantidad de packs a armar</div>

                <Form.Control
                  type="Number"
                  onChange={(e) => setCantPack(e.target.value)}
                  value={cantPack}
                />
              </div>
              <div className="my-2 d-flex gap-4">
                <Button
                  variant="warning"
                  className="yellowLarge flex-grow-1"
                  type="submit"
                >
                  Asignar Pack
                </Button>
                <Button
                  onClick={restoreOriginalPack}
                  className="btn btn-info  flex-grow-1"
                  type="reset"
                  disabled={!changed}
                >
                  Restaurar a pack original
                </Button>
              </div>
            </Form>
          </div>
        ) : null}
        <>
          <ReactToPrint
            trigger={() => (
              <button ref={invoiceRef} hidden>
                Print this out!
              </button>
            )}
            content={() => dropRef.current}
            onAfterPrint={() => {
              handleDownloadPdf(
                `nota_de_armado: ${productList[0]?.nombrePack}`,
                dropRef
              );
            }}
          />
          <Button className="visually-hidden">
            <PackageDropComponent
              ref={dropRef}
              branchInfo={branchInfo}
              selectedProducts={productList}
              cliente={{
                nit: "128153028",
                razonSocial: "INCADEX S.R.L.",
              }}
              packName={productList[0]?.nombrePack}
              cantPack={cantPack}
            />
          </Button>
        </>
      </div>
      {loading && <Loader />}
    </div>
  );
}
