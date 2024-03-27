const conversor = require("conversor-numero-a-letras-es-ar");

export const convertToText = (number) => {
  const nb = Number(number);
  const entero = Math.trunc(nb);
  const resto = Math.round(Number((nb - entero).toFixed(2)) * 100);
  let ClaseConversor = conversor.conversorNumerosALetras;
  let miConversor = new ClaseConversor();
  var texto = miConversor.convertToText(entero);
  return {
    texto,
    resto,
  };
};
