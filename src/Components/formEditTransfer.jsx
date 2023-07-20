import React, { useEffect, useState, useRef } from "react";
import {
  addProductToTransfer,
  deleteProductFromTransfer,
  transferList,
  transferProducts,
  updateChangedTransfer,
  updateProductTransfer,
} from "../services/transferServices";
import Cookies from "js-cookie";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
import "../styles/buttonsStyles.css";
import "../styles/modalStyles.css";
import "../styles/generalStyle.css";
import { Button, Form, Table } from "react-bootstrap";
import { getProductsWithStock } from "../services/productServices";
import { dateString } from "../services/dateServices";
import LoadingModal from "./Modals/loadingModal";
import { updateMultipleStock, updateStock } from "../services/orderServices";
import { set } from "lodash";
export default function FormEditTransfer() {
  const [userId, setUserId] = useState("");
  const [tList, setTList] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState({});
  const [transferProductList, setTransferProductList] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [transferId, setTransferId] = useState("");
  const [transferOrigin, setTransferOrigin] = useState("");
  const [auxPedidosList, setAuxPedidosList] = useState([]);
  const [filter, setFilter] = useState("");
  const timestampRef = useRef(Date.now());
  const productRef = useRef([]);

  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserId(JSON.parse(UsuarioAct).idUsuario);
      const idUsuario = JSON.parse(UsuarioAct).idUsuario;
      const lista = transferList("todo");
      lista.then((res) => {
        console.log("Lista", res);
        const list = res.data;
        const userList = list.filter(
          (ls) => ls.idUsuario == idUsuario && ls.listo != 1
        );
        console.log("User list", userList);
        setAuxPedidosList(userList);
        setTList(userList);
      });
    }
  }, []);
  useEffect(() => {
    if (transferId != "") {
      selectTransfer();
    }
  }, [transferId, timestampRef]);
  function selectTransfer() {
    console.log("Id seleccionado", transferId);
    setSelectedTransfer({});
    setSelectedProducts([]);
    setAlertSec("Cargando traspaso");
    setIsAlertSec(true);
    console.log(
      "Testeando",
      tList.find((tl) => tl.idTraspaso == transferId)
    );
    setSelectedTransfer(tList.find((tl) => tl.idTraspaso == transferId));
    const storeId = tList.find((tl) => (tl.idTraspaso = transferId)).idOrigen;
    setTransferOrigin(storeId);
    const prods = getProductsWithStock(storeId, "all");
    prods.then((pr) => {
      console.log("Flag 1");
      const filtered = pr.data.filter((pd) => pd.activo === 1);
      setStockList(filtered);
      productRef.current = filtered;

      const details = transferProducts(transferId);
      details.then((res) => {
        console.log("Detalles traspaso", res);
        setTransferProductList(res.data.response);
        setSelectedProducts(res.data.response);
        setIsAlertSec(false);
        // setTransferId("");
      });
    });
  }

  function updateCurrentStock() {
    setTransferProductList([]);
    setSelectedProducts([]);
    const storeId = tList.find((tl) => (tl.idTraspaso = transferId)).idOrigen;

    const prods = getProductsWithStock(storeId, "all");
    prods.then((pr) => {
      console.log("Flag 1");
      const filtered = pr.data.filter((pd) => pd.activo === 1);
      setStockList(filtered);
      const details = transferProducts(transferId);
      details.then((res) => {
        console.log("Detalles traspaso", res);
        setTransferProductList(res.data.response);
        setSelectedProducts(res.data.response);
        // setIsAlertSec(false);
        // setTransferId("");
        // productRef.current = res.data.response;
      });
    });
  }

  function changeQuantities(index, cantidad) {
    const updatedArray = selectedProducts.map((obj, i) => {
      if (i == index) {
        return {
          ...obj,
          cantProducto: cantidad,
          cantidadRestante:
            parseFloat(
              stockList.find((sl) => sl.idProducto == obj.idProducto)
                .cant_Actual
            ) +
            parseFloat(obj.cantidadProducto) -
            parseFloat(cantidad),
        };
      }
      return obj;
    });

    setSelectedProducts(updatedArray);
  }
  function addProductToList(pr) {
    const producto = JSON.parse(pr);
    const prodObj = {
      idTraspaso: selectedTransfer.idTraspaso,
      idProducto: producto.idProducto,
      cantProducto: 0,
      cantidadProducto: 0,
      cantidadRestante: stockList.find(
        (sl) => sl.idProducto == producto.idProducto
      )?.cant_Actual,
      nombreProducto: producto.nombreProducto,
      codInterno: producto.codInterno,
    };
    const present = selectedProducts.find(
      (sp) => sp.idProducto == producto.idProducto
    );
    if (!present) {
      setAddedProducts([...addedProducts, prodObj]);
      setSelectedProducts([...selectedProducts, prodObj]);
    } else {
      console.log("Producto ya presente en la lista");
    }
  }

  function deleteProduct(index, producto) {
    const prodObj = {
      idTraspaso: selectedTransfer.idTraspaso,
      idProducto: producto.idProducto,
      cantProducto: 0,
      cantidadProducto: 0,
      cantidadRestante: stockList.find(
        (sl) => sl.idProducto == producto.idProducto
      )?.cant_Actual,
      nombreProducto: producto.nombreProducto,
      codInterno: producto.codInterno,
    };
    setDeletedProducts([...deletedProducts, prodObj]);
    const auxArray = [...selectedProducts];
    auxArray.splice(index, 1);
    setSelectedProducts(auxArray);
  }

  const compareArrays = (array1, array2) => {
    const commonObjects = array1.filter((obj1) => {
      return array2.some((obj2) => {
        return obj1.idProducto === obj2.idProducto;
      });
    });
    return commonObjects;
  };

  function sortProducts() {
    if (verifyQuantities()) {
      setAlertSec("Alguno de los productos tiene cantidad 0");
      setIsAlertSec(true);
      setTimeout(() => {
        setIsAlertSec(false);
      }, 2000);
    } else {
      var arrReturns = [];
      var arrAdds = [];
      var arrNew = [];
      for (const product of selectedProducts) {
        const found = transferProductList.find(
          (prod) => prod.idProducto == product.idProducto
        );
        if (found) {
          console.log("Producto que ya estaba", product);
        } else {
          console.log("Producto a sacar de stock por completo", product);
        }
      }
      setAlertSec("Actualizando traspaso");
      setIsAlertSec(true);
      if (
        JSON.stringify(transferProductList) === JSON.stringify(selectedProducts)
      ) {
        console.log("No se detectaron cambios en el traspaso");
      } else {
        const added = compareArrays(selectedProducts, addedProducts);

        const deleted = compareArrays(transferProductList, deletedProducts);

        const remaining = compareArrays(selectedProducts, transferProductList);
        saveTransfer(added, deleted, remaining);
      }
    }
  }

  async function saveTransfer(added, deleted, remaining) {
    console.log("Devolviendo stock", transferProductList);
    const updateToreturn = {
      accion: "add",
      idAlmacen: transferOrigin,
      productos: transferProductList,
      detalle: `DSETR-${selectedTransfer.idTraspaso}`,
    };
    const updateToTake = {
      accion: "take",
      idAlmacen: transferOrigin,
      productos: selectedProducts,
      detalle: `SSETR-${selectedTransfer.idTraspaso}`,
    };

    const updateMultipleStocks = updateMultipleStock([
      updateToreturn,
      updateToTake,
    ]);
    updateMultipleStocks
      .then((res) => {
        const add = addProductToTransfer({
          idTraspaso: selectedTransfer.idTraspaso,
          productos: added,
        });
        add
          .then((response) => {
            const deld = deleteProductFromTransfer({
              idTraspaso: selectedTransfer.idTraspaso,
              productos: deleted,
            });
            deld
              .then((res) => {
                const rem = updateProductTransfer({
                  idTraspaso: selectedTransfer.idTraspaso,
                  productos: remaining,
                });
                rem
                  .then((resp) => {
                    const updateBody = {
                      fechaActualizacion: dateString(),
                      idTraspaso: selectedTransfer.idTraspaso,
                    };
                    const updated = updateChangedTransfer(updateBody);
                    updated
                      .then((up) => {
                        console.log("Sacando Stock", selectedProducts);
                        setAlertSec("Traspaso actualizado");
                        setIsAlertSec(true);
                        setTimeout(() => {
                          setIsAlertSec(false);
                        }, 2000);
                        window.location.reload();
                      })
                      .catch((err) => {
                        setAlertSec(
                          "Error al editar productos del traspaso:",
                          err
                        );
                        setTimeout(() => {
                          setIsAlertSec(false);
                        }, 5000);
                      });
                  })
                  .catch((err) => {
                    setAlertSec("Error al editar productos del traspaso:", err);
                    setTimeout(() => {
                      setIsAlertSec(false);
                    }, 5000);
                  });
              })
              .catch((err) => {
                console.log("Error al borrar productos del traspaso", err);
                setAlertSec("Error al borrar productos del traspaso:", err);
                setTimeout(() => {
                  setIsAlertSec(false);
                }, 5000);
              });
          })
          .catch((err) => {
            setAlertSec("Error al agregar productos al traspaso:", err);
            console.log("error", err);
            setTimeout(() => {
              setIsAlertSec(false);
            }, 5000);
          });
      })
      .catch((err) => {
        updateCurrentStock();
        setAlertSec("Error al actualizar stock:", err);
        console.log("error", err);
        setTimeout(() => {
          setIsAlertSec(false);
        }, 5000);
      });
  }

  function verifyQuantities() {
    const verified = selectedProducts.map((sp) => {
      if (sp.cantProducto < 1) {
        return false;
      }
      return true;
    });
    return verified.includes(false);
  }

  function filterOrders(value) {
    setFilter(value);
    const filtered = auxPedidosList.filter((data) =>
      data.nroOrden
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase())
    );
    setTList(filtered);
  }

  return (
    <div>
      <LoadingModal isAlertSec={isAlertSec} alertSec={alertSec} />
      <div className="formLabel">EDITAR TUS TRASPASOS</div>
      <div>
        <Form.Label>Filtrar por numero, usuario o tipo</Form.Label>
        <Form.Control
          type="text"
          onChange={(e) => {
            filterOrders(e.target.value);
          }}
          value={filter}
        />
        <Form.Label className="formLabel">Lista de Traspasos</Form.Label>
        <Form.Select
          value={transferId}
          onChange={(e) => setTransferId(e.target.value)}
          className="selectMargin"
        >
          <option value={null}>Seleccione un traspaso</option>
          {tList.map((tl, index) => {
            return (
              <option value={tl.idTraspaso} key={index}>
                {tl.nroOrden}
              </option>
            );
          })}
        </Form.Select>
      </div>
      {selectedTransfer.idTraspaso && stockList.length > 0 ? (
        <div>
          <div className="formLabel">
            Detalles del traspaso {` ${selectedTransfer.nroOrden}`}
          </div>
          <div>
            <Table>
              <thead>
                <tr className="tableHeader">
                  <th colSpan={3}>Origen</th>
                  <th colSpan={2}>Destino</th>
                </tr>
                <tr className="tableRow">
                  <td colSpan={3}>{selectedTransfer.nombreOrigen}</td>
                  <td colSpan={2}>{selectedTransfer.nombreDestino}</td>
                </tr>
                <tr className="tableHeader">
                  <th colSpan={3}>Usuario Solicitante</th>
                  <th colSpan={2}>Fecha creación traspaso</th>
                </tr>
                <tr className="tableRow">
                  <td colSpan={3}>{selectedTransfer.nombreCompleto}</td>
                  <td colSpan={2}>{selectedTransfer.fechaCrea}</td>
                </tr>
                <tr className="tableHeader">
                  <th colSpan={5}>Productos</th>
                </tr>
                <tr className="tableHeader">
                  <th colSpan={1}></th>
                  <th colSpan={3}>
                    <Form.Select
                      onChange={(e) => addProductToList(e.target.value)}
                    >
                      <option>Agregar Productos</option>
                      {stockList.map((sl, index) => {
                        return (
                          <option key={index} value={JSON.stringify(sl)}>
                            {sl.nombreProducto}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </th>
                  <th colSpan={1}></th>
                </tr>
                <tr className="tableHeader">
                  <th></th>
                  <th>Codigo</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Disponible</th>
                </tr>
              </thead>

              <tbody>
                {[...selectedProducts].map((sp, index) => {
                  const cantBuscada = parseInt(
                    stockList.find((sl) => sl.idProducto == sp.idProducto)
                      ?.cant_Actual
                  );
                  const cantBuscadaRef = parseInt(
                    productRef.current.find(
                      (sl) => sl.idProducto == sp.idProducto
                    )?.cant_Actual
                  );

                  return (
                    <tr className="tableRow" key={index}>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deleteProduct(index, sp)}
                        >
                          x
                        </Button>
                      </td>
                      <td>{sp.codInterno}</td>
                      <td>{sp.nombreProducto}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={sp.cantProducto}
                          onChange={(e) =>
                            changeQuantities(index, e.target.value)
                          }
                          min={0}
                        />
                      </td>
                      {/* <td>
                        {parseInt(
                          stockList.find((sl) => sl.idProducto == sp.idProducto)
                            ?.cant_Actual
                        )}
                      </td> */}
                      <td
                        className="smallTableColumn"
                        style={{
                          color: cantBuscada != cantBuscadaRef ? "red" : "",
                        }}
                      >
                        {cantBuscada}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="tableFootAlt">
                  <td colSpan={5}>
                    <Button
                      onClick={() => sortProducts()}
                      variant="warning"
                      className="yellowLarge"
                    >
                      Actualizar
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      ) : (
        <div>Seleccione un traspaso</div>
      )}
    </div>
  );
}
