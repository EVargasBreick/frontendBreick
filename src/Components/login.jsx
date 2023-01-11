import React from "react";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../styles/loginStyle.css";
import BreickLogo from "../assets/Breick-logo.png";
import loading2 from "../assets/loading2.gif";
import Powered2 from "../assets/Powered2.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/generalStyle.css";
import { useState } from "react";
import { loginRequest } from "../services/loginServices";
import { loginInputControl } from "../services/loginServices";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { comfiarLogin } from "../services/soapServices";

export default function Login() {
  const horaActual =
    new Date().getHours() < 10
      ? "0" + new Date().getHours()
      : new Date().getHours();
  const minutoActual =
    new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes();
  const horaFinal = horaActual + ":" + minutoActual + ":00";
  const [isOutHours, setIsOutHours] = useState(false);
  const { setIsAuth } = useContext(UserContext);
  useEffect(() => {
    const isLogged = Cookies.get("userAuth");
    if (isLogged !== undefined) {
      setIsAuth(true);
      navigate("/principal");
    } else {
      setIsAuth(false);
    }
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const { setuserData } = useContext(UserContext);
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  function login() {
    const inputControl = loginInputControl(username, password);
    if (inputControl) {
      setIsAlert(false);
      setisLoading(true);
      const loginState = loginRequest(username, password);
      loginState.then((userDataFetchd) => {
        setisLoading(false);
        console.log("Respuesta del fetch", userDataFetchd.data.message);
        if (userDataFetchd.data.message === "Usuario encontrado") {
          setuserData(JSON.stringify(userDataFetchd.data.data[0][0]));
          Cookies.set(
            "userAuth",
            JSON.stringify(userDataFetchd.data.data[0][0]),
            { expires: 1 }
          );
          console.log(
            "Hora entrada",
            userDataFetchd.data.data[0][0].horaEntrada + ":00"
          );
          if (
            Date.parse("01/01/2000 " + horaFinal) <
              Date.parse(
                "01/01/2000 " +
                  userDataFetchd.data.data[0][0].horaEntrada +
                  ":00"
              ) ||
            Date.parse("01/01/2000 " + horaFinal) >
              Date.parse(
                "01/01/2000 " +
                  userDataFetchd.data.data[0][0].horaSalida +
                  ":00"
              )
          ) {
            console.log("Entrando fuera de hora");
          } else {
            console.log("Entrando en hora");
          }

          navigate("/principal");
        }
        if (userDataFetchd.data.message === "Usuario no encontrado") {
          setIsAlert(true);
          setAlert("Usuario no encontrado");
          setUsername("");
          setPassword("");
        }
      });
    } else {
      setIsAlert(true);
      setAlert("Por favor ingrese usuario y contraseña ");
    }
  }

  return (
    <div className="appContainer">
      <div className="center">
        <Alert
          variant="danger"
          show={isAlert}
          style={{ backgroundColor: "#5cb8b2", color: "white" }}
        >
          {alert}
        </Alert>
        <div className="box">
          <Image src={BreickLogo} className="imageLogo"></Image>
          <Form className="loginForm">
            <Form.Group className="inputGroup" controlId="formBasicEmail">
              <Form.Label className="label">Usuario:</Form.Label>
              <Form.Control
                value={username}
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="inputGroup" controlId="formBasicPassword">
              <Form.Label className="label">Contraseña:</Form.Label>
              <Form.Control
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => (e.key === "Enter" ? login() : null)}
              />
            </Form.Group>
            <Button
              disabled={isLoading}
              className="loginButton"
              variant="warning"
              onClick={() => login()}
            >
              {isLoading ? (
                <Image src={loading2} style={{ width: "5%" }} />
              ) : (
                "Iniciar Sesion"
              )}
            </Button>
          </Form>
          <Image src={Powered2} className="powered"></Image>
        </div>
      </div>
    </div>
  );
}
