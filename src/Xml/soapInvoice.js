import axios from "axios";
import { debounce } from "lodash";

const debouncedSoapInvoice = debounce(
  async (body) => {
    const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/xml/aprobarComprobante`;
    const response = await axios.post(url, body);
    console.log("Respuesta", response);
    if (response.status === 200) {
      return { response };
    } else {
      resetDebouncedFunction();
      throw new Error(`Invalid response status code: ${response.status}`);
    }
  },
  45000,
  { leading: true }
);

const resetDebouncedFunction = () => {
  debouncedSoapInvoice.cancel();
};

const SoapInvoice = (body) => {
  return debouncedSoapInvoice(body);
};

export { SoapInvoice };
