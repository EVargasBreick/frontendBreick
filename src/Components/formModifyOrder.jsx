import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/formLayouts.css";
import "../styles/tableStyles.css";
export default function FormModifyOrders() {
  return (
    <div>
      <div className="formLabel">MODIFICAR PEDIDO</div>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Select>
            <option>Seleccione pedido</option>
          </Form.Select>
        </Form.Group>
      </Form>
      <div className="secondHalf">
        <div className="formLabel">MODFIFICAR CANTIDADES</div>
        <Form>
          <div className="halfContainer">
            <Form.Group className="half" controlId="vendor">
              <Form.Label>Vendedor</Form.Label>
              <Form.Control type="text" placeholder="" disabled />
            </Form.Group>
            <Form.Group className="half" controlId="client">
              <Form.Label>Cliente</Form.Label>
              <Form.Control type="text" placeholder="" disabled />
            </Form.Group>
          </div>
        </Form>
      </div>
      <div className="secondHalf">
        <div className="tableOne">
          <Table bordered striped hover>
            <tr className="tableHeader">
              <th className="tableColumn"></th>
              <th className="tableColumn">Codigo Producto</th>
              <th className="tableColumn">Producto</th>
              <th className="tableColumn">Actual</th>
              <th className="tableColumn">Nuevo</th>
              <th className="tableColumn">Cantidad disponible</th>
              <th className="tableColumn">Precio Unidad</th>
              <th className="tableColumn">Total</th>
              <th className="tableColumn">Estado</th>
            </tr>
            <tr className="tableRow">
              <td className="tableColumn">
                <div>
                  <Button variant="warning" className="tableButton">
                    Modificar
                  </Button>
                </div>
              </td>

              <td className="tableColumn">C77777777</td>
              <td className="tableColumn">Lorem ipsum</td>
              <td className="tableColumn">Precio actual</td>
              <td className="tableColumn">
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
              <td className="tableColumn">999</td>
              <td className="tableColumn">99.99</td>
              <td className="tableColumn">10000</td>
              <td className="tableColumn"></td>
            </tr>
          </Table>
        </div>
        <div className="secondHalf">
          <div className="buttons">
            <Button variant="light" className="cyanLarge">
              Actualizar Pedido
            </Button>
            <Button variant="light" className="yellowLarge">
              Cancelar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
