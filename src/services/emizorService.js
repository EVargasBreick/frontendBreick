import axios from "axios";

const emizorInstance = axios.create({
    baseURL: `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}`,
});

export const emizorService = {
    async anularFactura(cuf_ackTicket_uniqueCode, motivo) {
        console.log("TCL: anularFactura -> motivo", motivo)
        const url = `/emizor/api/v1/facturas/${cuf_ackTicket_uniqueCode}/anular/${motivo}`;
        const response = await emizorInstance.delete(url);
        return response.data;
    },
};     