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

    async getFactura(uniqueCode) {
        const url = `/emizor/facuradb/${uniqueCode}`;
        const response = await emizorInstance.get(url);
        return response.data;
    },

    async getFacturas(nit) {
        const url = `/emizor/facturasdb/${nit}`;
        const response = await emizorInstance.get(url);
        return response.data;
    },

    async downloadFactura(link, filename) {
        await fetch(link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
        })
            .then((response) => response.blob())
            .then(async (blob) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `${filename}.pdf`,
                );

                // Append to html link element page
                await document.body.appendChild(link);

                // Start download
                await link.click();

                // Clean up and remove the link
                await link.parentNode.removeChild(link);
            });

    }
};     