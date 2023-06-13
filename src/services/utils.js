import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const generateExcel = (items, file_name) => {
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    saveExcelFile(excelBuffer, `${file_name}.xlsx`);
};

const saveExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, fileName);
};

export { generateExcel };