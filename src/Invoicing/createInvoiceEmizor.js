const sendInvoiceEmizor = (body) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/facturas/enviar`;
    try {
      const sended = await axios.post(url, body);
      resolve(sended);
    } catch (error) {
      reject(error);
    }
  });
};

export { sendInvoiceEmizor };
