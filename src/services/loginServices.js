import axios from "axios";
import config from "../config.json";
const loginRequest = (username, password) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/login/?usuario=${username}&password=${password}`
      )
      .then((response) => {
        console.log("Respuesta", response.status);
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      });
  });
};
const loginInputControl = (username, password) => {
  if (username.length < 1 || password.length < 1) {
    return false;
  } else {
    return true;
  }
};

export { loginRequest, loginInputControl };
