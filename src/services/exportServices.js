import * as XLSX from "xlsx";
function ExportToExcel(objProductos, objPedido, codigo, tipo) {
  console.log("Array de prods", objProductos);
  console.log("Detalle", objPedido);
  return new Promise((resolve) => {
    var ws_data = objPedido;
    var ws = XLSX.utils.json_to_sheet(ws_data);

    var ws_data2 = objProductos;
    var ws2 = XLSX.utils.json_to_sheet(ws_data2);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Detalle ${tipo}`);
    XLSX.utils.book_append_sheet(wb, ws2, "Detalle Productos");

    XLSX.writeFile(wb, `${codigo}.xlsx`);
    resolve(true);
  });
}
function ExportTemplate() {
  return new Promise((resolve) => {
    var ws_data = [
      {
        CODINTERNO: "",
        CANTIDAD: "",
      },
    ];
    var ws = XLSX.utils.json_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `productos`);
    XLSX.writeFile(wb, `plantilla_carga.xlsx`);
    resolve(true);
  });
}
function ExportPastReport(objReporte, nombre, fecha) {
  return new Promise((resolve) => {
    var ws_data = objReporte;
    var ws = XLSX.utils.json_to_sheet(ws_data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Reporte Kardex`);
    XLSX.writeFile(wb, `Reporte ${nombre} en ${fecha}.xlsx`);
    resolve(true);
  });
}
export { ExportToExcel, ExportTemplate, ExportPastReport };
