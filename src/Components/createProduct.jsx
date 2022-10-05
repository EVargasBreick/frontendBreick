import React from "react";
import Display from "./display";

import "../styles/formLayouts.css";
import Sidebar from "./sidebar";

import FormNewProduct from "./formNewProduct";
export default function CreateProduct() {
  return (
    <div>
      <div className="user">
        <Display />
      </div>
      <div className="form">
        <div className="sidebarDisplay">
          <Sidebar />
        </div>
        <div className="formDisplay">
          <FormNewProduct />
        </div>
      </div>
    </div>
  );
}
