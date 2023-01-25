import React, { useState } from "react";
import axios from "axios";

const SoapLogin = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/xml/login`,
        {
          email: "evargas@breick.com.bo",
          password: "Qgt<18",
        }
      )
      .then((response) => {
        resolve({
          response,
        });
      })
      .catch((error) => {
        reject(error);
        console.log("Error del back ", error);
      });
  });
};

export { SoapLogin };
