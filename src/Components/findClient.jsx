import React from "react";
import Display from "./display";
import FormSearchClient from "./formSearchClient";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
export default function FindClient() {
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
          <FormSearchClient />
        </div>
      </div>
    </div>
  );
}
