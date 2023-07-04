import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

export const TipoPagoComponent = ({
  vale,
  total,
  setValeForm,
  otherPayment,
  setVale,
}) => {
  const [tipoPago, setTipoPago] = useState(0);
  const [cancelado, setCancelado] = useState(0);
  const [canceladoTarjeta, setCanceladoTarjeta] = useState(0);
  const [cardNumbersA, setCardNumbersA] = useState("");
  const [cardNumbersB, setCardNumbersB] = useState("");
  const numberBRef = React.useRef(null);
  const [ofp, setOfp] = useState(0);
  const numberARef = React.useRef(null);
  const canceledRef = React.useRef(null);

  useEffect(() => {
    setValeForm({ tipoPago, cancelado, cardNumbersA, cardNumbersB, ofp, vale });
    setVale(vale);
    if (
      tipoPago === 2 ||
      tipoPago === 3 ||
      tipoPago === 5 ||
      tipoPago === 6 ||
      tipoPago === 7 ||
      tipoPago === 8 ||
      tipoPago === 9 ||
      tipoPago === 10
    ) {
      setCancelado(total - vale);
    }
  }, [tipoPago, cancelado, cardNumbersA, cardNumbersB, ofp]);

  function handleCardNumber(number, card) {
    if (card == "A") {
      if (number <= 9999) {
        setCardNumbersA(number);
      }
      if (number.length == 4) {
        numberBRef.current.focus();
      }
    } else {
      if (number <= 9999) {
        setCardNumbersB(number);
      }
    }
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="modalRows">
        <div className="modalLabel"> Tipo de pago Vale:</div>
        <div className="modalData">
          <div>
            <Form.Select
              onChange={(e) => {
                setTipoPago(Number(e.target.value));
                console.log(Number(e.target.value));
              }}
              value={tipoPago}
            >
              <option value={0}>Seleccione tipo de pago</option>
              <option value={1}>Efectivo</option>
              <option value={2}>Tarjeta</option>
              <option value={3}>Cheque</option>
              <option value={5}>Otros</option>
              <option value={6}>Pago Posterior</option>
              <option value={7}>Transferencia</option>
              <option value={8}>Deposito en cuenta</option>
              <option value={9}>Transferencia Swift</option>
              <option value={10}>Efectivo - Tarjeta</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {tipoPago === 1 && (
        <div>
          <div className="modalRows">
            <div className="modalLabel"> Monto cancelado:</div>
            <div className="modalData">
              <div>
                {" "}
                <Form.Control
                  value={cancelado}
                  type="number"
                  onChange={(e) => setCancelado(e.target.value)}
                  min={0}
                />
              </div>
            </div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Cambio:</div>
            <div className="modalData">{`${
              cancelado - (total - vale) < 0
                ? " Ingrese un monto igual o superior"
                : `${(cancelado - (total - vale)).toFixed(2)} Bs.`
            } `}</div>
          </div>
        </div>
      )}

      {tipoPago === 2 && (
        <>
          <div className="modalRows">
            <div className="modalLabel"> Numeros tarjeta:</div>
            <div className="modalData">
              {
                <div className="cardLayout">
                  <Form.Control
                    type="text"
                    onChange={(e) => handleCardNumber(e.target.value, "A")}
                    value={cardNumbersA}
                  ></Form.Control>
                  <div className="modalHyphen">{"-"}</div>
                  <Form.Control
                    ref={numberBRef}
                    min="0000"
                    max="9999"
                    type="number"
                    onChange={(e) => {
                      handleCardNumber(e.target.value, "B");
                    }}
                    value={cardNumbersB}
                  ></Form.Control>
                </div>
              }
            </div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> A cobrar con tarjeta:</div>
            <div className="modalData">
              {`${Number(total - parseFloat(vale)).toFixed(2)} Bs.`}
            </div>
          </div>
        </>
      )}

      {tipoPago === 5 && (
        <div>
          <div className="modalRows">
            <div className="modalLabel"> Otro Tipo de pago:</div>
            <div className="modalData">
              <div>
                <Form.Select
                  onChange={(e) => setOfp(e.target.value)}
                  value={ofp}
                >
                  <option>Seleccione Otro Tipo </option>
                  {otherPayment.map((op, index) => {
                    return (
                      <option value={op.idOtroPago} key={index}>
                        {op.otroPago}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {tipoPago === 10 && (
        <div>
          <div className="modalRows">
            <div className="modalLabel"> Monto cancelado Efectivo:</div>
            <div className="modalData">
              <div>
                <Form.Control
                  ref={canceledRef}
                  value={canceladoTarjeta}
                  onChange={(e) => setCanceladoTarjeta(e.target.value)}
                  type="number"
                  min={0}
                />
              </div>
            </div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> A cobrar con tarjeta:</div>
            <div className="modalData">
              {canceladoTarjeta - (total - parseFloat(vale)) < 0
                ? `${(-(canceladoTarjeta - (total - parseFloat(vale)))).toFixed(
                    2
                  )} Bs.`
                : "No hay dinero a cobrar con tarjeta"}
            </div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Numeros tarjeta:</div>
            <div className="modalData">
              {
                <div className="cardLayout">
                  <Form.Control
                    ref={numberARef}
                    type="text"
                    onChange={(e) => handleCardNumber(e.target.value, "A")}
                    value={cardNumbersA}
                  ></Form.Control>
                  <div className="modalHyphen">{"-"}</div>
                  <Form.Control
                    ref={numberBRef}
                    min="0000"
                    max="9999"
                    type="number"
                    onChange={(e) => handleCardNumber(e.target.value, "B")}
                    value={cardNumbersB}
                  ></Form.Control>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </Form>
  );
};
