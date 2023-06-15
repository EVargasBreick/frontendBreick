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
export default function CurrentUser() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { setIsAuth, setuserData } = useContext(UserContext);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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
    navigate("/");
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
        </Dropdown.Menu>
      </Dropdown>
      <ChangePasswordModal
        show={showChangePasswordModal}
        handleClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}
