import React from "react";
import Display from "./display";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import FormModifyOrders from "./formModifyOrder";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export default function ModifyOrder() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(Cookies.get("userAuth"));
    const permittedLp = [1, 10, 13];
    const permittedInt = [1, 5, 6, 9, 10];
    if (user) {
      if (user.idDepto == 1 && !permittedLp.includes(user.rol)) {
        navigate("/principal");
      } else {
        if (user.idDepto != 1 && !permittedInt.includes(user.rol)) {
          navigate("/principal");
        }
      }
    }
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
          <FormModifyOrders />
        </div>
      </div>
    </div>
  );
}
