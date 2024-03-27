import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BodyDailyDiscountsReport from "./bodyDailyDiscountsReport";
export default function DailyDiscountsReport() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    const permitted = [1, 7, 9];

    if (user) {
      const parsed = JSON.parse(Cookies.get("userAuth"));
      if (!permitted.includes(parsed.rol)) {
        navigate("/principal");
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
          <BodyDailyDiscountsReport />
        </div>
      </div>
    </div>
  );
}
