import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { getPacks } from "../services/packServices";
import { getCurrentStockStore } from "../services/stockServices";
import { updateMultipleStock } from "../services/orderServices";
import Cookies from "js-cookie";
import { ConfirmModal } from "./Modals/confirmModal";
import ToastComponent from "./Modals/Toast";
import { set } from "lodash";
import { Loader } from "./loader/Loader";

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

  const userAlmacen = JSON.parse(Cookies.get("userAuth"))?.idAlmacen;
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState("");

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
    } catch (err) {
      setToastText("Error al cargar packs");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, []);

  function getStoreStock(value) {
    setSelectedStoreId(value);
    const stock = getCurrentStockStore(value);
    stock.then((st) => {
      setProductStock(st.data);
      setIsAgency(true);
    });
  }
  function selectPack(value) {
    setIsPack(true);
    setSelectedPackId(value);
    const prodList = allPacks.filter((pk) => pk.idPack == value);
    console.log("TCL: selectPack -> prodList", prodList);
    const grupoPRoductos = [
      {
        idProducto: 50,
      },
      {
        idProducto: 53,
      },
    ];

    prodList.map((pl) => {
      const found = grupoPRoductos.find((gp) => gp.idProducto == pl.idProducto);
      if (found) {
        pl.isGrupo = true;
        pl.idGrupo = found.idProducto;
      }
    });
    setProductList(prodList);
  }
  async function asignPack() {
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
      getStoreStock(userAlmacen);
      setShowModal(false);
      setLoading(false);
      setShowToast(true);
      setCantPack(0);
      setIsPack(false);
      setSelectedPack("");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < e.target.length - 1; i++) {
      console.log(e.target[i].value);
    }
    setShowModal(true);
  };

  return (
    <div>
      <div className="formLabel">Asignar Packs</div>
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        title={`Asignar ${cantPack} Pack(s)`}
        text="¿Desea asignar el pack?"
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
      <div>
        <div className="formLabel">Cantidad de packs a armar</div>
        <Form>
          <Form.Control
            type="Number"
            onChange={(e) => setCantPack(e.target.value)}
            value={cantPack}
          />
        </Form>
      </div>
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
                    return (
                      <tr key={index} className="tableRow">
                        <td>{index + 1}</td>
                        <td>
                          {pl.isGrupo ? (
                            <Form.Group>
                              <Form.Select>
                                <option value={"Tableta1"}>Tableta1</option>
                                <option value={"Tableta2"}>Tableta 2</option>
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
                        <td>
                          {productStock.find(
                            (ps) => pl.idProducto == ps.idProducto
                          ).cantidad -
                            pl.cantProducto * cantPack}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </Table>
              <Button variant="warning" className="yellowLarge" type="submit">
                Asignar Pack
              </Button>
            </Form>
          </div>
        ) : null}
      </div>
      {loading && <Loader />}
    </div>
  );
}
