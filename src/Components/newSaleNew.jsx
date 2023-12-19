import React from "react";
import Display from "./display";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import FormNewSaleAlt from "./formNewSaleAlt";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { dateString } from "../services/dateServices";
import { remainingDayGoal } from "../services/reportServices";

import ProgressToastComponent from "./Modals/progressToast";
import FormNewSaleNew from "./formNewSaleNew";
export default function NewSaleNew() {
  const navigate = useNavigate();
  const permittedRoles = [1, 2, 6, 7, 9];
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("");
  const [goal, setGoal] = useState("");
  const [total, setTotal] = useState("");
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      if (!permittedRoles.includes(JSON.parse(Cookies.get("userAuth")).rol)) {
        navigate("/principal");
      }
    }
    const idUsuario = JSON.parse(user).idUsuario;
    const fecha = dateString();
    const metas = remainingDayGoal(idUsuario, fecha);
    metas
      .then((meta) => {
        console.log("DATOS DE METAS DIARIAS", meta.data);
        const goalData = meta.data;
        setGoal(goalData.meta);
        setTotal(goalData.total);
        if (goalData.resultado) {
          setToastType("success");
          setToastText(
            `Cumpliste tu meta diaria! Llevas ${goalData.total} Bs vendidos.`
          );
          setShowToast(true);
        } else {
          const percent = (goalData.total / goalData.meta) * 100;
          if (percent < 75) {
            setToastType("danger");
          } else {
            setToastType("warning");
          }
          setToastText("Tu meta");
          setShowToast(true);
        }
      })
      .catch((err) => {
        console.log("Error al cargar el restante", err);
      });
  }, []);
  return (
    <div>
      <div className="userBar">
        <div></div>
        <Display />
      </div>
      <div className="form">
        <div className="sidebarDisplay">
          <Sidebar />
        </div>
        <div className="formDisplay">
          <FormNewSaleNew />
        </div>
      </div>
      {goal > 0 ? (
        <ProgressToastComponent
          show={showToast}
          autoclose={45}
          setShow={setShowToast}
          text={toastText}
          type={toastType}
          goal={goal}
          total={total}
        />
      ) : null}
    </div>
  );
}