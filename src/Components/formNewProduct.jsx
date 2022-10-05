import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
export default function FormNewProduct() {
  const [desc, setDesc] = useState(false);

  return (
    <div>
      <div className="formLabel">AGREGAR PRODUCTOS</div>
      <Form>
        <Form.Group className="half" controlId="productCode">
          <Form.Label>Codigo</Form.Label>
          <Form.Control type="text" placeholder="Ingrese codigo" />
        </Form.Group>
        <Form.Group className="half" controlId="productName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Ingrese nombre" />
        </Form.Group>
        <Form.Group className="select" controlId="productType">
          <Form.Label>Tipo</Form.Label>
          <Form.Select>
            <option>Seleccione tipo de producto</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="half" controlId="productQuantity">
          <Form.Label>Ingresar Cantidad</Form.Label>
          <Form.Control type="number" placeholder="Ingrese cantidad" />
        </Form.Group>
        <Form.Group className="half" controlId="producPrice">
          <Form.Label>Ingresar Precio</Form.Label>
          <Form.Control type="number" placeholder="Ingrese precio" />
        </Form.Group>
        <Form.Group className="halfRadio" controlId="productDisccount">
          <Form.Check
            onClick={() => setDesc(!desc)}
            type="switch"
            label={
              desc
                ? "Aplica a descuentos mayoristas"
                : "No aplica a descuentos mayoristas"
            }
            id="custom-switch"
          />
        </Form.Group>
        <div className="buttonCreate">
          <Button variant="light" className="cyan">
            Crear productos
          </Button>
        </div>
      </Form>
    </div>
  );
}
