import React, { useState } from "react";
import {
  Form,
  Button,
  Table,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";

export default function FormNewOrder() {
  const [isClient, setIsClient] = useState(false);
  const [isProduct, setIsProduct] = useState(false);

  function searchClient() {
    setIsClient(!isClient);
  }
  function selectProduct() {
    setIsProduct(!isProduct);
  }

  return (
    <div>
      <div className="formLabel">REGISTRAR PEDIDOS</div>

      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Buscar cliente"
          className="me-2"
          aria-label="Search"
        />
        <Button
          variant="warning"
          className="search"
          onClick={() => searchClient()}
        >
          Buscar
        </Button>
      </Form>
      {isClient ? (
        <div className="tableOne">
          <Table>
            <tr className="tableHeader">
              <th className="tableColumnSmall"></th>
              <th className="tableColumnSmall">Codigo</th>
              <th className="tableColumn">Razon Social</th>
              <th className="tableColumn">Nombre contacto</th>
              <th className="tableColumn">Zona</th>
            </tr>
            <tr className="tableRow">
              <td className="tableColumnSmall">
                <div>
                  <Button variant="warning" className="tableButtonAlt">
                    Seleccionar
                  </Button>
                </div>
              </td>
              <td className="tableColumnSmall">9999</td>
              <td className="tableColumn">Test</td>
              <td className="tableColumn">Prueba</td>
              <td className="tableColumn">Achumani</td>
            </tr>
          </Table>
        </div>
      ) : null}
      <div className="formLabelPurple"></div>
      <div className="formLabel">SELECCIONE PRODUCTO</div>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Select
            className="selectorFull"
            onChange={() => selectProduct()}
          >
            <option>Seleccione producto</option>
            <option value="producto 1">Producto 1</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <div className="formLabel">SELECCIONE TIPO PEDIDO</div>
      <div>
        <Form>
          <Form.Group className="mb-3" controlId="order">
            <Form.Select className="selectorHalf">
              <option>Seleccione tipo</option>
              <option>Normal</option>
              <option>Muestra</option>
              <option>Reserva</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <div className="comments">
              <Form.Control
                type="text"
                placeholder="Observaciones"
              ></Form.Control>
            </div>
          </Form.Group>
          <Form.Group>
            <div className="formLabel">DESCUENTO (%)</div>
            <div className="percent">
              <Form.Control
                type="number"
                placeholder="Ingrese porcentaje"
              ></Form.Control>
            </div>
          </Form.Group>
          {isProduct ? (
            <div className="tableOne">
              <Table>
                <tr className="tableHeader">
                  <th className="tableColumnSmall"></th>
                  <th className="tableColumnSmall">Codigo Producto</th>
                  <th className="tableColumn">Producto</th>
                  <th className="tableColumnSmall">Precio Unidad</th>
                  <th className="tableColumnSmall">Cantidad</th>
                  <th className="tableColumnSmall">Cantidad Disponible</th>
                </tr>
                <tr className="tableRow">
                  <td className="tableColumnSmall">
                    <div>
                      <Button variant="warning" className="tableButtonAlt">
                        Quitar
                      </Button>
                    </div>
                  </td>
                  <td className="tableColumnSmall">9999</td>
                  <td className="tableColumn">Test</td>
                  <td className="tableColumnSmall">99</td>
                  <td className="tableColumnSmall">
                    {" "}
                    <div>
                      <Form>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            placeholder=""
                            className="tableInput"
                          />
                        </Form.Group>
                      </Form>
                    </div>
                  </td>
                  <td className="tableColumnSmall">1000</td>
                </tr>
              </Table>
            </div>
          ) : null}
          <Form.Group>
            <div className="formLabel">CONFIRMAR PRODUCTOS</div>
            <div className="percent">
              <Button variant="warning" className="yellowLarge">
                Cargar
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
