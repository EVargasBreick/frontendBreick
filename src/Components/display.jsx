import React from "react";
import CurrentUser from "./currenUser";
import "../styles/generalStyle.css";
export default function Display() {
  return (
    <div className="layout">
      <div className="current">
        <CurrentUser />
      </div>
    </div>
  );
}
