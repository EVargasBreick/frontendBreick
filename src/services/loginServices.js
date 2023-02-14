import axios from "axios";

import { dateString } from "./dateServices";

const loginRequest = (username, password) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${
          process.env.REACT_APP_ENDPOINT_PORT
        }/login/?usuario=${username}&password=${password}&date='${dateString()}'`
      )
      .then((response) => {
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
