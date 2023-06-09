import React from "react";
import { Spinner } from "react-bootstrap";

export const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center fixed-top w-100 h-100 bg-secondary bg-opacity-50">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <div className="text-white fs-3 ms-3">Cargando...</div>
    </div>
  );
};
