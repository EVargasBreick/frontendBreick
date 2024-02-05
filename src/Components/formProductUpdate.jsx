import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, Form, Table, Image, Modal } from "react-bootstrap";
import {
  getProductsWithStock,
  productsService,
} from "../services/productServices";
import { Loader } from "./loader/Loader";
import UpdateFormAlt from "./formProductUpdateAlt";
export default function FormProductUpdate() {
  const [productList, setProductList] = useState([]);
  const [userId, setUserid] = useState("");
  const [storeId, setStoreId] = useState("");

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(
    "Seleccione un producto"
  );
  const [product, setProduct] = useState({});

  const [loading, setLoading] = useState(false);
  const [getProducts, setGetProducts] = useState(false);

  useEffect(() => {
    setLoading(true);
    const data = productsService.getAllProducts();
    data.then((res) => {
      console.log("LISTA DE PRODUCTOS", res);
      setProductList(res);
      setLoading(false);
    });
  }, [getProducts]);

  useEffect(() => {
    if (selectedProduct != "Seleccione un producto") {
      setLoading(true);
      const product = productList.find(
        (prod) => prod.idProducto == selectedProduct
      );
      setLoading(false);
    }
  }, [selectedProduct]);

  useEffect(() => {
    console.log("producto", product);
  }, [product]);

  function filterProducts(value) {
    setSearch(value);
    const newList = productList?.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    setProduct(newList[0] || []);
    setSelectedProduct(newList[0]?.idProducto ?? "Seleccione un producto");
  }

  return (
    <div>
      <div className="formLabel">ACTUALIZAR PRODUCTOS</div>
      <div>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            filterProducts(search);
          }}
        >
          <Form.Label>Lista de Productos</Form.Label>
          <Form.Group className="columnForm">
            <Form.Select
              className="mediumForm"
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setProduct(
                  productList.find((prod) => prod.idProducto == e.target.value)
                );
              }}
              value={selectedProduct}
            >
              <option>Seleccione un producto</option>
              {productList?.map((pl, index) => {
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
      {product.idProducto && (
        <UpdateFormAlt
          setProductList={setProductList}
          props={product}
          setGetProducts={setGetProducts}
        />
      )}

      {loading && <Loader />}
    </div>
  );
}
