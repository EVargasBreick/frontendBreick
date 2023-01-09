import React, { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/formLayouts.css";
import "../styles/generalStyle.css";
import { getProducts } from "../services/productServices";
export default function FormEditProducts() {
  const [desc, setDesc] = useState(false);
  const [type, setType] = useState(true);
  const [prodList, setprodList] = useState([]);
  useEffect(() => {
    const allProducts = getProducts("");
    allProducts.then((fetchedProducts) => {
      console.log("Productos ", fetchedProducts.data.data[0]);
      setprodList(fetchedProducts.data.data[0]);
    });
  }, []);
  return (
    <div>
      <div className="formLabel">GESTION DE PRODUCTOS</div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Select>
            <option>Seleccione producto</option>
            {prodList.map((producto) => {
              return (
                <option value={producto.idProducto} key={producto.idProducto}>
                  {producto.nombreProducto}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group className="half" controlId="productName">
          <Form.Label>Editar Nombre</Form.Label>
          <Form.Control type="text" placeholder="Ingrese nuevo nombre" />
        </Form.Group>

        <Form.Group className="half" controlId="producPrice">
          <Form.Label>Ingresar Precio</Form.Label>
          <Form.Control type="number" placeholder="Ingrese nuevo precio" />
        </Form.Group>
        <Form.Group className="half" controlId="productQuantity">
          <Form.Label>Ingresar Cantidad</Form.Label>
          <Form.Control type="number" placeholder="Ingrese nueva cantidad" />
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
        <Button variant="light" type="submit" className="cyan">
          Actualizar Producto
        </Button>
      </Form>
      <div className="secondHalf">
        <div className="formLabel">CARGA MASIVA</div>
        <Form>
          <Form.Group className="halfRadio" controlId="productDisccount">
            <Form.Check
              onClick={() => setType(!type)}
              type="switch"
              label={type ? "Todo" : "Solo cantidades"}
              id="custom-switch"
            />
            <div className="buttons">
              <Button variant="light" className="normal">
                Descargar plantilla
              </Button>
              <Button variant="light" className="yellow">
                Subir archivo (Ninguno seleccionado)
              </Button>
              <Button variant="light" className="cyan">
                Actualizar productos
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
