import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
export default function FormManageOrders() {
  const [desc, setDesc] = useState(false);

  return (
    <div>
      <div className="formLabel">ADMINISTRAR PEDIDOS</div>
      <Form>
        <Form.Group className="mb-3" controlId="order">
          <Form.Select>
            <option>Seleccione pedido</option>
          </Form.Select>
        </Form.Group>
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
        <div className="halfContainer">
          <Form.Group className="half" controlId="zone">
            <Form.Label>Zona</Form.Label>
            <Form.Control type="text" placeholder="" disabled />
          </Form.Group>
          <Form.Group className="half" controlId="total">
            <Form.Label>Total</Form.Label>
            <Form.Control type="number" placeholder="" disabled />
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="discount">
            <Form.Label>Descuento</Form.Label>
            <Form.Control type="number" placeholder="" disabled />
          </Form.Group>
          <Form.Group className="half" controlId="invoiced">
            <Form.Label>Total Facturado</Form.Label>
            <Form.Control type="number" placeholder="" disabled />
          </Form.Group>
        </div>
      </Form>
      <div className="secondHalf">
        <div className="formLabel">APROBAR PEDIDO</div>
        <Form>
          <Form.Group className="halfRadio" controlId="productDisccount">
            <div className="buttonsLarge">
              <Button variant="light" className="cyanLarge">
                Aprobar
              </Button>
              <Button variant="light" className="yellowLarge">
                Generar Nota
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
