import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import FormNewUser from "./formNewUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormEditUserAgnecy from "./formEditUserAgency";
export default function EditUserAgency() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    const permitted = [1, 9, 12];
    const parsed = JSON.parse(Cookies.get("userAuth")).rol;
    if (user) {
      if (!permitted.includes(parsed)) {
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
          <FormEditUserAgnecy />
        </div>
      </div>
    </div>
  );
}
