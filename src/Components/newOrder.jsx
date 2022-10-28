import React from "react";
import Display from "./display";
import FormNewOrder from "./formNewOrder";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
export default function NewOrder() {
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
          <FormNewOrder />
        </div>
      </div>
    </div>
  );
}
