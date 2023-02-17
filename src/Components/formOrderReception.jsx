import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import { ordersToPrint, printedOrder } from "../services/orderServices";
import { printedTrasnfer } from "../services/transferServices";
import "../styles/modalStyles.css";
import { OrderNote } from "./orderNote";
export default function FormOrderReception() {
  const [idsArray, setIdsArray] = useState([]);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [listId, setListId] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReloaded, setIsReloaded] = useState(false);
  const componentRef = useRef();
  useEffect(() => {
    verifyOrders();
    const intervalId = setInterval(() => {
      verifyOrders();
    }, 180000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  function verifyOrders() {
    console.log("Verificando...");
    const toPrint = ordersToPrint();
    toPrint.then((resp) => {
      console.log("Orders to print", resp);
      const flt = resp.data;
      setFullList(resp.data);
      let uniqueArray = resp.data.reduce((acc, curr) => {
        if (!acc.find((obj) => obj.idOrden === curr.idOrden)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      setIdsArray(uniqueArray);
      const list = [];
      uniqueArray.map((ua) => {
        list.push(ua.idOrden);
      });
      setNumberOfOrders(uniqueArray.length);

      setListId(list);
      const array = [];
      list.map((li) => {
        const detallesPedido = flt.filter((fl) => fl.idOrden == li);

        const element = {
          idNro: detallesPedido[0].idOrden,
          id: detallesPedido[0].nroOrden,
          productos: detallesPedido,
          fechaSolicitud: detallesPedido[0].fechaCrea,
          usuario: detallesPedido[0].usuario,
          tipo: detallesPedido[0].tipo,
        };
        array.push(element);
      });
      setProductList(array);
    });
  }
  useEffect(() => {
    if (numberOfOrders > 0) {
      setIsModal(true);
    } else {
      setIsModal(false);
    }
  }, [numberOfOrders]);
  useEffect(() => {
    if (numberOfOrders === productList.length) {
      setIsLoaded(true);
    }
  }, [productList, numberOfOrders]);
  function printOrders() {
    console.log("Is loaded", isLoaded);
  }
  function updatePrinted() {
    //aca usas productList
    var validator = true;
    productList.map((pl) => {
      if (pl.tipo == "P") {
        const printed = printedOrder(pl.idNro);
        printed
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            validator = false;
          });
      } else {
        const printed = printedTrasnfer(pl.idNro);
        printed
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            validator = false;
          });
      }
    });
    if (validator) {
      window.location.reload();
    } else {
      console.log("Error al actualizar");
    }
  }
  return (
    <div>
      <div className="formLabel">RECEPCION DE PEDIDOS</div>
      <Modal show={isModal} size="xl">
        <Modal.Header className="modalAlertHeader">ALERTA</Modal.Header>
        <Modal.Body className="modalAlertBody">{`TIENE ${numberOfOrders} PEDIDOS SIN IMPRIMIR`}</Modal.Body>
        <Modal.Footer className="modalAlertFooter">
          {isLoaded ? (
            <div>
              <div hidden>
                <OrderNote productList={productList} ref={componentRef} />
              </div>
              <ReactToPrint
                trigger={() => (
                  <Button variant="warning" className="yellowLarge">
                    Imprimir ordenes
                  </Button>
                )}
                content={() => componentRef.current}
                onAfterPrint={() => updatePrinted()}
              />
            </div>
          ) : null}
        </Modal.Footer>
      </Modal>
      <div className="fullBody">
        {numberOfOrders == 0 ? (
          <div className="bigText">No tiene pedidos/traspasos por imprimir</div>
        ) : null}
      </div>
    </div>
  );
}
