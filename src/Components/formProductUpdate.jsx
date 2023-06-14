import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, Form, Table, Image, Modal } from "react-bootstrap";
import { getProductsWithStock } from "../services/productServices";
export default function FormProductUpdate() {
  const [productList, setProductList] = useState([]);
  const [userId, setUserid] = useState("");
  const [storeId, setStoreId] = useState("");

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Seleccione un producto");

  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      const idAlmacen = JSON.parse(Cookies.get("userAuth")).idAlmacen;
      setUserid(JSON.parse(Cookies.get("userAuth")).idUsuario);
      setStoreId(idAlmacen);
      console.log("Id almacen", idAlmacen);
      const prods = getProductsWithStock(idAlmacen, "all");
      prods.then((product) => {
        setProductList(product.data);
      });
    }
    console.log("Length", JSON.stringify(selectedProduct).length);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Producto seleccionado", selectedProduct);
  }

  function filterProducts(value) {
    setSearch(value);
    const newList = productList.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    setSelectedProduct(newList[0]?.idProducto);
  }

  return (
    <div>
      <div className="formLabel">ACTUALIZAR PRODUCTOS</div>
      <div>
        <Form onSubmit={() => filterProducts(search)}>
          <Form.Label>Lista de Productos</Form.Label>
          <Form.Group className="columnForm">
            <Form.Select
              className="mediumForm"
              onChange={(e) => setSelectedProduct(e.target.value)}
              value={selectedProduct}
            >
              <option>Seleccione un producto</option>
              {productList.map((pl, index) => {
                return (
                  <option value={pl.idProducto} key={index}>
                    {pl.nombreProducto}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control
              type="search"
              placeholder="buscar"
              className="mediumForm"
              onChange={(e) => {
                filterProducts(e.target.value);
              }}
              value={search}
            />
          </Form.Group>
        </Form>
      </div>

      <div className="formLabel">Detalles producto seleccionado</div>
    </div>
  );
}
