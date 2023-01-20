import Cookies from "js-cookie";
import React from "react";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { getProducts } from "../services/productServices";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";

export default function FormUpdateStock() {
  const [prodList, setprodList] = useState([]);
  const [userStore, setUserStore] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
    }
    const allProducts = getProducts("all");
    allProducts.then((fetchedProducts) => {
      console.log("Productos ", fetchedProducts.data.data[0]);
      setprodList(fetchedProducts.data.data[0]);
    });
  }, []);
  return (
    <div>
      <div className="formLabel">ACTUALIZAR STOCK EN AGENCIA</div>
      <div className="fullProductTable">
        <Table>
          <thead className="tableHeader">
            <tr>
              <th>Cod Interno</th>
              <th>Nombre Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {prodList.map((pd, index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td>{pd.codInterno}</td>
                  <td>{pd.nombreProducto}</td>
                  <td>
                    <Form>
                      <Form.Control type="number" />
                    </Form>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="tableFoot">
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </div>
      <div>
        <Button>Actualizar Stock</Button>
      </div>
    </div>
  );
}
