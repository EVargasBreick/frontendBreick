import React from "react";
import { Button } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

import "../styles/generalStyle.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import ChangePasswordModal from "./Modals/ChangePasswordModal";
import { allProducts } from "../services/productServices";
import { generateExcel } from "../services/utils";
import ClientInfo from "./Modals/clientInfo";
export default function CurrentUser() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { setIsAuth, setuserData } = useContext(UserContext);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSearchClientModal, setShowSearchClientModal] = useState(false);
  useEffect(() => {
    const isLogged = Cookies.get("userAuth");

    if (isLogged) {
      setIsAuth(true);
      setuserData(isLogged);
      setUserName(
        `${JSON.parse(Cookies.get("userAuth")).nombre} ${
          JSON.parse(Cookies.get("userAuth")).apPaterno
        } ${JSON.parse(Cookies.get("userAuth")).apMaterno}`
      );
    } else {
      navigate("/");
    }
  }, []);
  function logOut() {
    Cookies.remove("userAuth");
    Cookies.remove("pdv");
    Cookies.remove("sudostore");
    navigate("/");
  }

  async function exportTemplate() {
    const pList = await fullProdList();
    generateExcel(pList, `Plantilla Inventario`);
  }

  async function fullProdList() {
    const productList = await allProducts();
    console.log("Product list", productList);
    var prodArray = [];
    for (const product of productList.data) {
      if (product.activo == 1) {
        const item = {
          ["Id Producto"]: product.idProducto,
          ["Cod Interno"]: product.codInterno,
          ["Producto"]: product.nombreProducto,
          ["Cantidad"]: 0,
        };
        prodArray.push(item);
      }
    }
    return new Promise((resolve) => {
      resolve(prodArray);
    });
  }

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="light"
          id="dropdown-basic"
          className="dropButton"
        >
          {userName}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              logOut();
            }}
          >
            Cerrar Sesión
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setShowChangePasswordModal(true);
            }}
          >
            Cambiar Contraseña
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              exportTemplate();
            }}
          >
            Exportar planilla de kardex
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setShowSearchClientModal(true);
            }}
          >
            Buscar cliente
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ChangePasswordModal
        show={showChangePasswordModal}
        handleClose={() => setShowChangePasswordModal(false)}
      />
      <ClientInfo
        setShowSearchClientModal={setShowSearchClientModal}
        showSearchClientModal={showSearchClientModal}
      />
    </>
  );
}
