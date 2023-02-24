import React, { useEffect, useState } from "react";
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

        setTList(userList);
      });
    }
  }, []);
  function selectTransfer(id) {
    setAlertSec("Cargando traspaso");
    setIsAlertSec(true);

    const storeId = tList.find((tl) => (tl.idTraspaso = id)).idOrigen;
    const prods = getProductsWithStock(storeId, "all");
    prods.then((pr) => {
      setStockList(pr.data);
      const details = transferProducts(id);
      details.then((res) => {
        console.log("Detalles traspaso", res);
        setSelectedTransfer(tList.find((tl) => tl.idTraspaso == id));
        setTransferProductList(res.data.response);
        setSelectedProducts(res.data.response);
        setIsAlertSec(false);
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

  function saveTransfer(added, deleted, remaining) {
    const add = addProductToTransfer({
      idTraspaso: selectedTransfer.idTraspaso,
      productos: added,
    });
    add.then((response) => {
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
          rem.then((resp) => {
            const updateBody = {
              fechaActualizacion: dateString(),
              idTraspaso: selectedTransfer.idTraspaso,
            };
            const updated = updateChangedTransfer(updateBody);
            updated.then((up) => {
              setAlertSec("Traspaso actualizado");
              setTimeout(() => {
                setIsAlertSec(false);
                window.location.reload();
              }, 2500);
            });
          });
        })
        .catch((err) => {
          console.log("Error al borrar", err);
        });
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

  return (
    <div>
      <LoadingModal isAlertSec={isAlertSec} alertSec={alertSec} />
      <div className="formLabel">EDITAR TUS TRASPASOS</div>
      <div>
        <div>Lista de traspasos</div>
        <Form.Select
          onChange={(e) => selectTransfer(e.target.value)}
          className="selectMargin"
        >
          <option>Seleccione un traspaso</option>
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
          <div className="formLabel">Detalles traspaso</div>
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
                {selectedProducts.map((sp, index) => {
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
                      <td>
                        {parseInt(
                          stockList.find((sl) => sl.idProducto == sp.idProducto)
                            ?.cant_Actual
                        ) + sp.cantidadProducto}
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
