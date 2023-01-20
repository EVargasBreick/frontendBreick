import React, { useState } from "react";
import axios from "axios";
import config from "../config.json";

const SoapLogin = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.endpointUrl}:${config.endpointPort}/xml/login`, {
        email: "evargas@breick.com.bo",
        password: "Qgt<18",
      })
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
