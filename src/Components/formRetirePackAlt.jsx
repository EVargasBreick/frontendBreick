import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Image, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { getBranchesPs, getOnlyStores } from "../services/storeServices";
import { getPacks } from "../services/packServices";
import Cookies from "js-cookie";
import {
  getCurrentStockStore,
  getProductsGroup,
} from "../services/stockServices";
import { updateMultipleStock } from "../services/orderServices";
import { ConfirmModal } from "./Modals/confirmModal";
import ToastComponent from "./Modals/Toast";
import { Loader } from "./loader/Loader";
import { PackageDropComponent } from "./packacgeDropComponent";
import ReactToPrint from "react-to-print";
import { handleDownloadPdf } from "../services/utils";

export default function FormRetirePackAlt() {
  // Listas cargadas en render
  const [agencias, setAgencias] = useState([]);
  const [packs, setPacks] = useState([]);
  const [allPacks, setAllPacks] = useState([]);
  const [productGroupList, setProductGroupList] = useState([]);
  const [branchInfo, setBranchInfo] = useState({});
  // Listas y valores cargados manualmente
  const [selectedPackId, setSelectedPackId] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [productStock, setProductStock] = useState([]);
  const [productList, setProductList] = useState([]);
  const [cantPack, setCantPack] = useState(0);
  // Validadores de estado
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isAgency, setIsAgency] = useState(false);
  const [isPack, setIsPack] = useState(false);
  const [packNStock, setPackNStock] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("");
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [filtered, setFiltered] = useState("");
  const [auxPacks, setAuxPacks] = useState([]);

  const dropRef = useRef();
  const invoiceRef = useRef();

  const sudostore = Cookies.get("sudostore");

  const userAlmacen = sudostore
    ? sudostore
    : JSON.parse(Cookies.get("userAuth"))?.idAlmacen;

  const [modalText, setModalText] = useState("");
  useEffect(() => {
    const ag = getOnlyStores();
    ag.then((age) => {
      console.log("Age", age);
      setAgencias(age.data);
    });
    getStoreStock(userAlmacen);
    const groupList = getProductsGroup();
    groupList.then((res) => {
      setProductGroupList(res.data);
    });
    const packList = getPacks();
    packList
      .then((res) => {
        console.log("Packs", res);
        setAllPacks(res.data);
        let uniqueArray = res.data.reduce((acc, curr) => {
          if (!acc.find((obj) => obj.nombrePack === curr.nombrePack)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setAuxPacks(uniqueArray);
        setPacks(uniqueArray);
      })
      .catch((err) => {});
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

  const handleClose = () => {
    setIsAlert(false);
    setIsAlertSec(false);
  };
  function getStoreStock(value) {
    setSelectedStoreId(value);
    const stock = getCurrentStockStore(value);
    stock.then((st) => {
      setProductStock(st.data);
      setIsAgency(true);
    });
  }
  function selectPack(value) {
    setProductList([]);
    setSelectedPackId("");
    setIsPack(false);
    setIsPack(true);
    setSelectedPackId(value);
    console.log("Pack seleccionado", value);
    const prodList = allPacks.filter((pk) => pk.idPack == value);
    setProductList(prodList);
    getPackQuantity(value);
  }
  function getPackQuantity(id) {
    const packId = allPacks.find((ap) => ap.idPack == id).idPackProd;
    const pack = productStock.find((ps) => ps.idProducto == packId);
    console.log("Stock del pack", pack);
    setPackNStock(pack);
  }
  function retirePack() {
    if (cantPack > packNStock.cantidad) {
      setAlert("La cantidad de packs a retirar no está disponible en stock");
      setIsAlert(true);
    } else {
      setAlertSec("Retirando pack");
      setIsAlertSec(true);
      const selectedProducts = [];
      productList.map((pl) => {
        const prodObj = {
          idProducto: pl.idProducto,
          cantProducto: pl.cantProducto * cantPack,
        };
        selectedProducts.push(prodObj);
      });
      const prodPack = [
        {
          idProducto: packNStock.idProducto,
          cantProducto: cantPack,
        },
      ];
      const objProdsTake = {
        accion: "take",
        idAlmacen: selectedStoreId,
        productos: prodPack,
        detalle: `DCPACK-${selectedPackId}`,
      };
      const objProdsAdd = {
        accion: "add",
        idAlmacen: selectedStoreId,
        productos: selectedProducts,
        detalle: `DVPACK-${selectedPackId}`,
      };

      const updateMultiple = updateMultipleStock([objProdsTake, objProdsAdd]);

      updateMultiple.then((res) => {
        setTimeout(() => {
          if (res) {
            setAlertSec("Pack retirado correctamente");
            setIsAlertSec(true);
            if (invoiceRef.current) {
              invoiceRef.current.click();
            }
          } else {
            setAlertSec("Error al retirar pack");
            setIsAlertSec(true);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }, 3100);
      });
    }
  }

  function handleProductChange(index, idProducto) {
    if (productList[index].idProducto !== idProducto) {
      const auxProdList = [...productList];
      const found = productStock.find((ps) => ps.idProducto == idProducto);
      auxProdList[index].idProducto = idProducto;
      auxProdList[index].nombreProducto = found.nombreProducto;
      auxProdList[index].precioDeFabrica = found.precioDeFabrica;
      setProductList(auxProdList);
      console.log("Cambiado");
      setChanged(true);
    }
  }

  function filterPack(value) {
    setFiltered(value);
    const filtered = auxPacks.filter((ap) =>
      ap.nombrePack.toLowerCase().includes(value.toLowerCase())
    );
    setPacks(filtered);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setModalText(
      <>
        <Table>
          <thead className="tableHeader">
            <tr>
              <th>Nro</th>
              <th>Producto</th>
              <th>Cantidad a reponer</th>
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
  };

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
      <div className="formLabel">Desarmar Packs</div>
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
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        title={`Desarmar ${cantPack} Pack(s)`}
        text={modalText}
        handleSubmit={() => retirePack()}
        handleCancel={() => setShowModal(false)}
      />
      <ToastComponent
        show={showToast}
        autoclose={2}
        setShow={setShowToast}
        text={toastText}
        type={toastType}
      />

      {selectedStoreId != "" ? (
        <div>
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
              }}
            >
              <option>Seleccione pack</option>
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
          <Form>
            <div>
              {isPack ? (
                <Table>
                  <thead className="tableHeader">
                    <tr>
                      <th>
                        {`Stock disponible de ${packNStock.nombreProducto} en ${packNStock.NombreAgencia}:`}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="tableRow">
                      <td>{packNStock.cantidad}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : null}
            </div>
          </Form>
          <div className="formLabel">
            Detalles de productos del pack seleccionado
          </div>
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
                        <th>Cantidad a reponer</th>
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
                                        <option
                                          key={index}
                                          value={ol.idProducto}
                                        >
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
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr></tr>
                    </tfoot>
                  </Table>
                  <div>
                    {" "}
                    <div className="formLabel">
                      Cantidad de packs a desarmar
                    </div>
                    <div className="formLabel"></div>
                    <Form.Control
                      type="Number"
                      onChange={(e) => setCantPack(e.target.value)}
                    />
                  </div>
                  <div className="my-2 d-flex gap-4">
                    <Button
                      variant="warning"
                      className="yellowLarge   flex-grow-1"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Desarmar packs
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
          </div>
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
              `nota_de_desarmado: ${productList[0]?.nombrePack}`,
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
      {loading && <Loader />}
    </div>
  );
}
