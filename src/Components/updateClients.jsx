import React from "react";

import Display from "./display";
import "../styles/formLayouts.css";
import "../styles/generalStyle.css";
import Sidebar from "./sidebar";
import FormEditClient from "./formEditClient";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function UpdateClient() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state == null) {
      navigate("/principal");
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
          <FormEditClient
            id={location.state != null ? location.state.id : null}
          />
        </div>
      </div>
    </div>
  );
}
