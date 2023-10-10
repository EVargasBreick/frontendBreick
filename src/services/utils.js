import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

const generateExcelDoubleSheets = (
  items,
  items2,
  file_name,
  sheet1,
  sheet2
) => {
  const worksheet = XLSX.utils.json_to_sheet(items);
  const workbook = XLSX.utils.book_new();
  const worksheet2 = XLSX.utils.json_to_sheet(items2);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheet1);
  XLSX.utils.book_append_sheet(workbook, worksheet2, sheet2);
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

export const handleDownloadPdf = async (namePdf, ref) => {
  const element = ref.current;
  const canvas = await html2canvas(element);
  const data = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  const imgProperties = pdf.getImageProperties(data);
  const pdfWidth = 70;
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
  pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(namePdf);
  setTimeout(() => {
    window.location.reload();
  }, 3000);
};

async function handleExcelUpdate(fileInput) {
  const fileObj = fileInput.target.files[0];
  if (!checkFileExtension(fileObj.name)) {
    console.log("Tipo de archivo inválido");
    return "Tipo De Archivo inválido";
  }
  const data = await fileObj.arrayBuffer();
  return handleExcelData(data);
}

function handleExcelData(data) {
  const wb = XLSX.read(data);
  const dataArray = [];
  wb.SheetNames.map((sheet) => {
    const workSheet = wb.Sheets[sheet];
    const jsonData = XLSX.utils.sheet_to_json(workSheet);
    dataArray.push({ [sheet]: jsonData });
  });
  return dataArray;
}

const checkFileExtension = (name) => {
  const acceptable = ["xlsx", "xls"];
  return acceptable.includes(name.split(".").pop().toLowerCase());
};

export { generateExcel, generateExcelDoubleSheets, handleExcelUpdate };
