function getDiscountPercentage(tipoProd, rango, discountList) {
  return discountList
    .filter((dl) => dl.idTiposProducto == tipoProd)
    .find((fd) => fd.rango == rango) != undefined
    ? discountList
        .filter((dl) => dl.idTiposProducto == tipoProd)
        .find((fd) => fd.rango == rango).descuento
    : 0;
}

function traditionalDiscounts(
  tradicionales,
  especiales,
  sinDesc,
  discountList
) {
  console.log("Tradicionales", tradicionales);
  console.log("Esp", especiales);
  console.log("SD", sinDesc);

  const totalTradicional = tradicionales.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalSinDesc = sinDesc.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalEspecial = especiales.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalEspecialDesc = especiales.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalDescFijo);
  }, 0);
  const tradA = getDiscountPercentage(1, "A", discountList);
  const tradB = getDiscountPercentage(1, "B", discountList);
  const tradC = getDiscountPercentage(1, "C", discountList);
  const tradD = getDiscountPercentage(1, "D", discountList);
  const tradE = getDiscountPercentage(1, "E", discountList);
  if (
    parseFloat(totalTradicional) * parseFloat(1 - tradA / 100).toFixed(2) +
      parseFloat(totalSinDesc) +
      parseFloat(totalEspecial) <
    1000
  ) {
    return {
      total:
        parseFloat(totalTradicional) +
        parseFloat(totalEspecial) +
        parseFloat(totalSinDesc),
      descuento: 0,
      descCalculado: 0,
      especial: false,
      facturar:
        parseFloat(totalTradicional) +
        parseFloat(totalEspecial) +
        parseFloat(totalSinDesc),
    };
  } else {
    if (
      parseFloat(totalTradicional) * parseFloat(1 - tradB / 100).toFixed(2) +
        parseFloat(totalSinDesc) +
        parseFloat(totalEspecial) <
      3000
    ) {
      const totalDescontado =
        parseFloat(totalTradicional) * parseFloat(1 - tradA / 100).toFixed(2) +
        parseFloat(totalSinDesc) +
        parseFloat(totalEspecial);
      return {
        total:
          parseFloat(totalTradicional) +
          parseFloat(totalEspecial) +
          parseFloat(totalSinDesc),
        descuento: tradA,
        descCalculado: parseFloat(
          parseFloat(totalTradicional) +
            parseFloat(totalSinDesc) +
            parseFloat(totalEspecial) -
            parseFloat(totalDescontado)
        ).toFixed(2),
        facturar: parseFloat(totalDescontado).toFixed(2),
        especial: false,
      };
    } else {
      if (
        parseFloat(totalTradicional) * parseFloat(1 - tradC / 100).toFixed(2) +
          parseFloat(totalSinDesc) +
          parseFloat(totalEspecial) <
        5000
      ) {
        const totalDescontado =
          parseFloat(totalTradicional) *
            parseFloat(1 - tradB / 100).toFixed(2) +
          parseFloat(totalSinDesc) +
          parseFloat(totalEspecial);

        return {
          total:
            parseFloat(totalTradicional) +
            parseFloat(totalEspecial) +
            parseFloat(totalSinDesc),
          descuento: tradB,
          descCalculado: parseFloat(
            parseFloat(totalTradicional) +
              parseFloat(totalSinDesc) +
              parseFloat(totalEspecial) -
              parseFloat(totalDescontado)
          ).toFixed(2),
          facturar: parseFloat(totalDescontado).toFixed(2),
          especial: false,
        };
      } else {
        if (
          parseFloat(totalTradicional) *
            parseFloat(1 - tradD / 100).toFixed(2) +
            parseFloat(totalSinDesc) +
            parseFloat(totalEspecial) <
          10000
        ) {
          const totalDescontado =
            parseFloat(totalTradicional) *
              parseFloat(1 - tradC / 100).toFixed(2) +
            parseFloat(totalSinDesc) +
            parseFloat(totalEspecial);

          return {
            total:
              parseFloat(totalTradicional) +
              parseFloat(totalEspecial) +
              parseFloat(totalSinDesc),
            descuento: tradC,
            descCalculado: parseFloat(
              parseFloat(totalTradicional) +
                parseFloat(totalSinDesc) +
                parseFloat(totalEspecial) -
                parseFloat(totalDescontado)
            ).toFixed(2),
            facturar: parseFloat(totalDescontado).toFixed(2),
            especial: false,
          };
        } else {
          if (
            parseFloat(
              totalTradicional * parseFloat(1 - tradE / 100).toFixed(2)
            ) +
              parseFloat(totalEspecialDesc) +
              parseFloat(totalSinDesc) <
            20000
          ) {
            const totalDescontado =
              parseFloat(
                totalTradicional * parseFloat(1 - tradD / 100).toFixed(2)
              ) +
              parseFloat(totalSinDesc) +
              parseFloat(totalEspecial);
            console.log(
              "A ver que onda",
              totalTradicional * parseFloat(1 - tradD / 100).toFixed(2)
            );
            console.log("Total descontado", totalSinDesc + totalEspecial);
            return {
              total:
                parseFloat(totalTradicional) +
                parseFloat(totalEspecial) +
                parseFloat(totalSinDesc),
              descuento: tradD,
              descCalculado: parseFloat(
                parseFloat(totalTradicional) +
                  parseFloat(totalSinDesc) +
                  parseFloat(totalEspecial) -
                  parseFloat(totalDescontado)
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
              especial: false,
            };
          } else {
            const totalDescontado =
              parseFloat(
                totalTradicional * parseFloat(1 - tradE / 100).toFixed(2)
              ) +
              parseFloat(totalSinDesc) +
              parseFloat(totalEspecialDesc);
            console.log(
              "Total descontado",
              totalTradicional * parseFloat(1 - tradE / 100).toFixed(2) +
                totalEspecialDesc +
                totalSinDesc
            );
            return {
              total:
                parseFloat(totalTradicional) +
                parseFloat(totalEspecial) +
                parseFloat(totalSinDesc),
              descuento: tradE,
              descCalculado: parseFloat(
                parseFloat(totalTradicional) +
                  parseFloat(totalEspecialDesc) +
                  parseFloat(totalSinDesc) -
                  parseFloat(totalDescontado)
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
              especial: true,
            };
          }
        }
      }
    }
  }
}

function easterDiscounts(pascua, discountList) {
  const pasA = getDiscountPercentage(2, "A", discountList);
  const pasB = getDiscountPercentage(2, "B", discountList);
  const pasC = getDiscountPercentage(2, "C", discountList);
  const pasD = getDiscountPercentage(2, "D", discountList);
  const pasE = getDiscountPercentage(2, "E", discountList);
  const pasF = getDiscountPercentage(2, "F", discountList);
  const pasG = getDiscountPercentage(2, "G", discountList);
  const pasH = getDiscountPercentage(2, "H", discountList);
  console.log("Pascua test", pascua);
  const totalPascua = pascua.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  console.log("Total pascua", totalPascua);
  if (totalPascua * parseFloat(1 - pasA / 100).toFixed(2) < 1000) {
    return {
      total: totalPascua,
      descuento: 0,
      descCalculado: 0,
      facturar: totalPascua,
    };
  } else {
    if (totalPascua * parseFloat(1 - pasB / 100).toFixed(2) < 3000) {
      const totalDescontado =
        totalPascua * parseFloat(1 - pasA / 100).toFixed(2);

      return {
        total: totalPascua,
        descuento: pasA,
        descCalculado: parseFloat(
          parseFloat(totalPascua) - parseFloat(totalDescontado)
        ).toFixed(2),
        facturar: totalDescontado.toFixed(2),
      };
    } else {
      if (totalPascua * parseFloat(1 - pasC / 100).toFixed(2) < 5000) {
        const totalDescontado =
          totalPascua * parseFloat(1 - pasB / 100).toFixed(2);

        return {
          total: totalPascua,
          descuento: pasB,
          descCalculado: parseFloat(
            parseFloat(totalPascua) - parseFloat(totalDescontado)
          ).toFixed(2),
          facturar: totalDescontado.toFixed(2),
        };
      } else {
        if (totalPascua * parseFloat(1 - pasD / 100).toFixed(2) < 10000) {
          const totalDescontado =
            totalPascua * parseFloat(1 - pasC / 100).toFixed(2);

          return {
            total: totalPascua,
            descuento: pasC,
            descCalculado: parseFloat(
              parseFloat(totalPascua) - parseFloat(totalDescontado)
            ).toFixed(2),
            facturar: totalDescontado.toFixed(2),
          };
        } else {
          if (totalPascua * parseFloat(1 - pasE / 100).toFixed(2) < 20000) {
            const totalDescontado =
              totalPascua * parseFloat(1 - pasD / 100).toFixed(2);

            return {
              total: totalPascua,
              descuento: pasD,
              descCalculado: parseFloat(
                parseFloat(totalPascua) - parseFloat(totalDescontado)
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
            };
          } else {
            if (totalPascua * parseFloat(1 - pasF / 100).toFixed(2) < 50000) {
              const totalDescontado =
                totalPascua * parseFloat(1 - pasE / 100).toFixed(2);

              return {
                total: totalPascua,
                descuento: pasE,
                descCalculado: parseFloat(
                  totalPascua - totalDescontado
                ).toFixed(2),
                facturar: totalDescontado.toFixed(2),
              };
            } else {
              if (
                totalPascua * parseFloat(1 - pasG / 100).toFixed(2) <
                100000
              ) {
                const totalDescontado =
                  totalPascua * parseFloat(1 - pasF / 100).toFixed(2);

                return {
                  total: totalPascua,
                  descuento: pasF,
                  descCalculado: parseFloat(
                    parseFloat(totalPascua) - parseFloat(totalDescontado)
                  ).toFixed(2),
                  facturar: totalDescontado.toFixed(2),
                };
              } else {
                if (
                  totalPascua * parseFloat(1 - pasH / 100).toFixed(2) <
                  200000
                ) {
                  const totalDescontado =
                    totalPascua * parseFloat(1 - pasG / 100).toFixed(2);

                  return {
                    total: totalPascua,
                    descuento: pasG,
                    descCalculado: parseFloat(
                      totalPascua - totalDescontado
                    ).toFixed(2),
                    facturar: totalDescontado.toFixed(2),
                  };
                } else {
                  const totalDescontado =
                    totalPascua * parseFloat(1 - pasH / 100).toFixed(2);

                  return {
                    total: parseFloat(totalPascua),
                    descuento: pasH,
                    descCalculado: parseFloat(
                      parseFloat(totalPascua) - parseFloat(totalDescontado)
                    ).toFixed(2),
                    facturar: totalDescontado.toFixed(2),
                  };
                }
              }
            }
          }
        }
      }
    }
  }
}

function christmassDiscounts(navidad, discountList) {
  const crisA = getDiscountPercentage(3, "A", discountList);
  const crisB = getDiscountPercentage(3, "B", discountList);
  const crisC = getDiscountPercentage(3, "C", discountList);
  const crisD = getDiscountPercentage(3, "D", discountList);
  const crisE = getDiscountPercentage(3, "E", discountList);
  const totalNavidad = navidad.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  if (totalNavidad * parseFloat(1 - crisA / 100).toFixed(2) < 1000) {
    return {
      total: totalNavidad,
      descuento: 0,
      descCalculado: 0,
      facturar: totalNavidad,
    };
  } else {
    if (totalNavidad * parseFloat(1 - crisB / 100).toFixed(2) < 3000) {
      const totalDescontado =
        totalNavidad * parseFloat(1 - crisA / 100).toFixed(2);

      return {
        total: totalNavidad,
        descuento: crisA,
        descCalculado: parseFloat(
          parseFloat(totalNavidad) - parseFloat(totalDescontado)
        ).toFixed(2),
        facturar: totalDescontado.toFixed(2),
      };
    } else {
      if (totalNavidad * parseFloat(1 - crisC / 100).toFixed(2) < 5000) {
        const totalDescontado =
          totalNavidad * parseFloat(1 - crisB / 100).toFixed(2);

        return {
          total: totalNavidad,
          descuento: crisB,
          descCalculado: parseFloat(
            parseFloat(totalNavidad) - parseFloat(totalDescontado)
          ).toFixed(2),
          facturar: totalDescontado.toFixed(2),
        };
      } else {
        if (totalNavidad * parseFloat(1 - crisD / 100).toFixed(2) < 10000) {
          const totalDescontado =
            totalNavidad * parseFloat(1 - crisC / 100).toFixed(2);

          return {
            total: totalNavidad,
            descuento: crisC,
            descCalculado: parseFloat(
              parseFloat(totalNavidad) - parseFloat(totalDescontado)
            ).toFixed(2),
            facturar: totalDescontado.toFixed(2),
          };
        } else {
          if (totalNavidad * parseFloat(1 - crisE / 100).toFixed(2) < 20000) {
            const totalDescontado =
              totalNavidad * parseFloat(1 - crisD / 100).toFixed(2);

            return {
              total: totalNavidad,
              descuento: crisD,
              descCalculado: parseFloat(
                parseFloat(totalNavidad) - parseFloat(totalDescontado)
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
            };
          } else {
            const totalDescontado =
              totalNavidad * parseFloat(1 - crisE / 100).toFixed(2);

            return {
              total: totalNavidad,
              descuento: crisE,
              descCalculado: parseFloat(
                parseFloat(totalNavidad) - parseFloat(totalDescontado)
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
            };
          }
        }
      }
    }
  }
}

function halloweenDiscounts(halloween, discountList) {
  const hallA = getDiscountPercentage(4, "A", discountList);
  const hallB = getDiscountPercentage(4, "B", discountList);
  const hallC = getDiscountPercentage(4, "C", discountList);
  const hallD = getDiscountPercentage(4, "D", discountList);
  const hallE = getDiscountPercentage(4, "E", discountList);
  const totalHalloween = halloween.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  if (totalHalloween * parseFloat(1 - hallA / 100).toFixed(2) < 1000) {
    return {
      total: totalHalloween,
      descuento: 0,
      descCalculado: 0,
      facturar: totalHalloween,
    };
  } else {
    if (totalHalloween * parseFloat(1 - hallB / 100).toFixed(2) < 3000) {
      const totalDescontado =
        totalHalloween * parseFloat(1 - hallA / 100).toFixed(2);

      return {
        total: totalHalloween,
        descuento: hallA,
        descCalculado: parseFloat(
          parseFloat(totalHalloween) - parseFloat(totalDescontado)
        ).toFixed(2),
        facturar: totalDescontado.toFixed(2),
      };
    } else {
      if (totalHalloween * parseFloat(1 - hallC / 100).toFixed(2) < 5000) {
        const totalDescontado =
          totalHalloween * parseFloat(1 - hallB / 100).toFixed(2);

        return {
          total: totalHalloween,
          descuento: hallB,
          descCalculado: parseFloat(
            parseFloat(totalHalloween) - parseFloat(totalDescontado)
          ).toFixed(2),
          facturar: totalDescontado.toFixed(2),
        };
      } else {
        if (totalHalloween * parseFloat(1 - hallD / 100).toFixed(2) < 10000) {
          const totalDescontado =
            totalHalloween * parseFloat(1 - hallC / 100).toFixed(2);

          return {
            total: totalHalloween,
            descuento: hallC,
            descCalculado: parseFloat(
              parseFloat(totalHalloween) - parseFloat(totalDescontado)
            ).toFixed(2),
            facturar: totalDescontado.toFixed(2),
          };
        } else {
          if (totalHalloween * parseFloat(1 - hallE / 100).toFixed(2) < 20000) {
            const totalDescontado =
              parseFloat(totalHalloween) *
              parseFloat(1 - hallD / 100).toFixed(2);

            return {
              total: totalHalloween,
              descuento: hallD,
              descCalculado: parseFloat(
                parseFloat(totalHalloween) - parseFloat(totalDescontado)
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
            };
          } else {
            const totalDescontado =
              parseFloat(totalHalloween) *
              parseFloat(1 - hallE / 100).toFixed(2);

            return {
              total: totalHalloween,
              descuento: hallE,
              descCalculado: parseFloat(
                parseFloat(totalHalloween) - parseFloat(totalDescontado)
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
            };
          }
        }
      }
    }
  }
}
function manualAutomaticDiscount(
  tradicionales,
  pascua,
  halloween,
  navidad,
  especiales,
  sinDesc,
  descuento
) {
  const totalTradicional = tradicionales.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalSinDesc = sinDesc.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalEspecial = especiales.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalEspecialDesc = especiales.reduce((accumulator, object) => {
    return accumulator + object.totalDescFijo;
  }, 0);
  const totalPascua = pascua.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalNavidad = navidad.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalHalloween = halloween.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);
  const totalDescontado =
    (parseFloat(totalTradicional) +
      parseFloat(totalPascua) +
      parseFloat(totalNavidad) +
      parseFloat(totalHalloween)) *
    (1 - descuento / 100);

  if (
    parseFloat(totalDescontado) +
      parseFloat(totalSinDesc) +
      parseFloat(totalEspecialDesc) >
    20000
  ) {
    return {
      totalDescontables:
        parseFloat(totalTradicional) +
        parseFloat(totalPascua) +
        parseFloat(totalNavidad) +
        parseFloat(totalHalloween) +
        parseFloat(totalSinDesc),
      descuento: descuento,
      descCalculado:
        parseFloat(totalTradicional) +
        parseFloat(totalPascua) +
        parseFloat(totalNavidad) +
        parseFloat(totalHalloween) +
        parseFloat(totalSinDesc) -
        parseFloat(totalDescontado),
      totalTradicional: parseFloat(totalDescontado) + parseFloat(totalSinDesc),
      totalEspecial: parseFloat(totalEspecial),
      descCalculadoEspeciales:
        parseFloat(totalEspecial) - parseFloat(totalEspecialDesc),
      facturar: parseFloat(totalEspecialDesc),
      especial: true,
    };
  } else {
    return {
      totalDescontables:
        parseFloat(totalTradicional) +
        parseFloat(totalPascua) +
        parseFloat(totalNavidad) +
        parseFloat(totalHalloween) +
        parseFloat(totalSinDesc),
      descuento: descuento,
      descCalculado:
        parseFloat(totalTradicional) +
        parseFloat(totalPascua) +
        parseFloat(totalNavidad) +
        parseFloat(totalHalloween) +
        parseFloat(totalSinDesc) -
        parseFloat(totalDescontado),
      totalTradicional: parseFloat(totalDescontado) + parseFloat(totalSinDesc),
      totalEspecial: totalEspecial,
      descCalculadoEspeciales: 0,
      facturar: totalEspecial,
      especial: false,
    };
  }
}

function addProductDiscounts(selectedProds, tradObj, pasObj, navObj, hallObj) {
  var auxProdObj = [];
  return new Promise((resolve) => {
    selectedProds.map((sp) => {
      if (sp.tipoProducto == 1) {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;
        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: (
            (sp.precioDeFabrica -
              sp.precioDeFabrica * (1 - tradObj.descuento / 100)) *
            cantidadDeProducto
          ).toFixed(2),
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProdObj.push(auxObj);
      }
      if (sp.tipoProducto == 2) {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;
        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: (
            (sp.precioDeFabrica -
              sp.precioDeFabrica * (1 - pasObj.descuento / 100)) *
            cantidadDeProducto
          ).toFixed(2),
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProdObj.push(auxObj);
      }
      if (sp.tipoProducto == 3) {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;
        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: (
            (sp.precioDeFabrica -
              sp.precioDeFabrica * (1 - navObj.descuento / 100)) *
            cantidadDeProducto
          ).toFixed(2),
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProdObj.push(auxObj);
      }
      if (sp.tipoProducto == 4) {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;
        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: (
            (sp.precioDeFabrica -
              sp.precioDeFabrica * (1 - hallObj.descuento / 100)) *
            cantidadDeProducto
          ).toFixed(2),
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProdObj.push(auxObj);
      }
      if (sp.tipoProducto == 5) {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;
        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: 0,
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProdObj.push(auxObj);
      }
      if (sp.tipoProducto == 6) {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;
        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: tradObj.especial
            ? (sp.precioDeFabrica - sp.precioDescuentoFijo) * cantidadDeProducto
            : 0,
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProdObj.push(auxObj);
      }
    });
    resolve(auxProdObj);
  });
}

function addProductDiscSimple(selectedProds, descSimple) {
  var auxProdObj = [];
  return new Promise((resolve) => {
    selectedProds.map((sp) => {
      if (sp.tipoProducto == 6) {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;
        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: descSimple.especial
            ? (sp.precioDeFabrica - sp.precioDescuentoFijo) * cantidadDeProducto
            : 0,
          unidadDeMedida: sp.unidadDeMedida,
          precio_producto: sp.precio_producto,
        };
        auxProdObj.push(auxObj);
      } else {
        const cantidadDeProducto =
          sp.cantProducto == undefined ? sp.cantidadProducto : sp.cantProducto;

        let auxObj = {
          cant_Actual: sp.cant_Actual,
          cantPrevia: sp.cantPrevia,
          cantProducto: cantidadDeProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          codInterno: sp.codInterno,
          idProducto: sp.idProducto,
          idPedidoProducto: sp.idPedidoProducto,
          nombreProducto: sp.nombreProducto,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,

          totalProd: sp.totalProd,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: (
            (sp.precioDeFabrica -
              sp.precioDeFabrica * (1 - descSimple.descuento / 100)) *
            cantidadDeProducto
          ).toFixed(2),
          unidadDeMedida: sp.unidadDeMedida,
          precio_producto: sp.precio_producto,
        };
        auxProdObj.push(auxObj);
      }
    });
    resolve(auxProdObj);
  });
}

function verifyAutomaticDiscount(selectedProducts, descuento) {
  return new Promise((resolve) => {
    const divided = divideByType(selectedProducts);
    divided.then((response) => {
      const especiales = response.especiales;
      const tradicionales = response.tradicionales;
      const totEspeciales = especiales.reduce((accumulator, object) => {
        return accumulator + parseFloat(object.total);
      }, 0);
      const totTradicional = tradicionales.reduce((accumulator, object) => {
        return accumulator + parseFloat(object.total);
      }, 0);

      if (
        parseFloat(totTradicional) * 0.93 + parseFloat(totEspeciales) >
        1000
      ) {
        resolve(7);
      } else {
        resolve(descuento);
      }
    });
  });
}

function divideByType(selectedProducts) {
  const especiales = [];
  const tradicionales = [];
  return new Promise((resolve) => {
    selectedProducts.map((sp) => {
      if (sp.tipoProducto == 6) {
        especiales.push(sp);
      } else {
        tradicionales.push(sp);
      }
    });
    resolve({ especiales: especiales, tradicionales: tradicionales });
  });
}

function saleDiscount(selectedProducts, descuento) {
  var auxProducts = [];
  return new Promise((resolve) => {
    selectedProducts.map((sp) => {
      if (sp.tipoProducto == 6) {
        const productObj = {
          codInterno: sp.codInterno,
          cantProducto: sp.cantProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          nombreProducto: sp.nombreProducto,
          idProducto: sp.idProducto,
          cant_Actual: sp.cant_Actual,
          cantidadRestante: sp.cant_Actual,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          descuentoProd: 0,
          total: sp.precioDeFabrica * sp.cantProducto,
          tipoProducto: sp.tipoProducto,
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProducts.push(productObj);
      } else {
        const productObj = {
          codInterno: sp.codInterno,
          cantProducto: sp.cantProducto,
          codigoSin: sp.codigoSin,
          actividadEconomica: sp.actividadEconomica,
          codigoUnidad: sp.codigoUnidad,
          nombreProducto: sp.nombreProducto,
          idProducto: sp.idProducto,
          cant_Actual: sp.cant_Actual,
          cantidadRestante: sp.cant_Actual,
          precioDeFabrica: sp.precioDeFabrica,
          precioDescuentoFijo: sp.precioDescuentoFijo,
          descuentoProd: (
            (sp.precioDeFabrica - sp.precioDeFabrica * (1 - descuento / 100)) *
            sp.cantProducto
          ).toFixed(2),
          total: sp.precioDeFabrica * sp.cantProducto,
          tipoProducto: sp.tipoProducto,
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProducts.push(productObj);
      }
    });
    resolve(auxProducts);
  });
}

function discountByAmount(selectedProducts, descuento) {
  console.log("Selected products", selectedProducts);
  const total = selectedProducts.reduce((accumulator, object) => {
    return accumulator + parseFloat(object.totalProd);
  }, 0);

  const descuentoCalculado = parseFloat((total * descuento) / 100).toFixed(2);
  const totalDescontado = total - descuentoCalculado;
  return {
    totalDescontables: total,
    descuento: descuento,
    descCalculado: descuentoCalculado,
    totalTradicional: totalDescontado,
    totalEspecial: 0,
    descCalculadoEspeciales: 0,
    facturar: 0,
    especial: false,
  };
}

function newDiscountByAmount(selectedProducts, descuento) {
  console.log("Selected products", selectedProducts);
  let totalCD = 0;
  let totalSD = 0;
  const conDesc = [1, 2, 3, 4];
  let prodCD = [];
  let prodSD = [];
  let reprocessedProducts = [];
  for (const product of selectedProducts) {
    if (conDesc.includes(product.tipoProducto)) {
      totalCD += Number(product.totalProd);
      prodCD.push(product);
      product.descuentoProd = Number(
        (product.totalProd * (descuento / 100)).toFixed(2)
      );
    } else {
      totalSD += Number(product.totalProd);
      prodSD.push(product);
    }
    reprocessedProducts.push(product);
  }
  const descuentoCalculado = parseFloat((totalCD * descuento) / 100).toFixed(2);
  const totalDescontado = Number(totalCD) - descuentoCalculado;
  return {
    totalDescontables: Number(totalCD),
    descuento: descuento,
    descCalculado: descuentoCalculado,
    totalTradicional: totalDescontado,
    totalEspecial: Number(totalSD),
    descCalculadoEspeciales: 0,
    facturar: Number(totalSD),
    especial: false,
    productosConDescuento: prodCD,
    productosSinDescuento: prodSD,
    productosReprocesados: reprocessedProducts,
  };
}

function complexDiscountFunction(selectedProducts, discountList) {
  //console.log("Selected", selectedProducts);
  var totalTrad = 0;
  var totalPascua = 0;
  var totalHallo = 0;
  var totalNav = 0;
  var totalSinDesc = 0;
  var totalEsp = 0;
  var totalEspDesc = 0;
  selectedProducts.map((sp) => {
    //console.log("Producto", sp);
    switch (sp.tipoProducto) {
      case 1:
        totalTrad += parseFloat(sp.totalProd);
        break;
      case 2:
        totalPascua += parseFloat(sp.totalProd);
        break;
      case 3:
        totalNav += parseFloat(sp.totalProd);
        break;
      case 4:
        totalHallo += parseFloat(sp.totalProd);
        break;
      case 5:
        totalSinDesc += parseFloat(sp.totalProd);
        break;
      case 6:
        totalEsp += parseFloat(sp.totalProd);
        totalEspDesc += parseFloat(sp.cantProducto * sp.precioDescuentoFijo);
    }
  });
  //console.log("Total tradicionales", totalTrad);
  //console.log("Total sin descuento", totalSinDesc);
  const trads = getTradDiscounts(
    totalTrad,
    totalEsp,
    totalEspDesc,
    totalSinDesc,
    discountList
  );
  const pasc = getEasterDiscounts(totalPascua, discountList);
  const nav = getNavDiscounts(totalNav, discountList);
  const hall = getHalloweenDiscounts(totalHallo, discountList);
  return {
    tradicionales: trads,
    pascua: pasc,
    navidad: nav,
    halloween: hall,
  };
}

function getTradDiscounts(
  totalTrad,
  totalEsp,
  totalEspDesc,
  totalSD,
  discountList
) {
  const tradA = getDiscountPercentage(1, "A", discountList);
  const tradB = getDiscountPercentage(1, "B", discountList);
  const tradC = getDiscountPercentage(1, "C", discountList);
  const tradD = getDiscountPercentage(1, "D", discountList);
  const tradE = getDiscountPercentage(1, "E", discountList);
  const totalConDescuentoA = totalTrad * (1 - tradA / 100);
  const totalConDescuentoB = totalTrad * (1 - tradB / 100);
  const totalConDescuentoC = totalTrad * (1 - tradC / 100);
  const totalConDescuentoD = totalTrad * (1 - tradD / 100);
  const totalConDescuentoE = totalTrad * (1 - tradE / 100);
  const totalGeneral =
    parseFloat(totalTrad) + parseFloat(totalEsp) + parseFloat(totalSD);
  const totalDescA =
    parseFloat(totalConDescuentoA) + parseFloat(totalEsp) + parseFloat(totalSD);
  const totalDescB =
    parseFloat(totalConDescuentoB) + parseFloat(totalEsp) + parseFloat(totalSD);
  const totalDescC =
    parseFloat(totalConDescuentoC) + parseFloat(totalEsp) + parseFloat(totalSD);
  const totalDescD =
    parseFloat(totalConDescuentoD) + parseFloat(totalEsp) + parseFloat(totalSD);
  const totalDescF =
    parseFloat(totalConDescuentoE) +
    parseFloat(totalEspDesc) +
    parseFloat(totalSD);
  if (totalConDescuentoA + totalEsp + totalSD < 1000) {
    return {
      total: totalGeneral,
      descuento: 0,
      descCalculado: 0,
      especial: false,
      facturar: totalGeneral,
    };
  } else {
    if (totalConDescuentoB + totalEsp + totalSD < 3000) {
      return {
        total: totalGeneral,
        descuento: tradA,
        descCalculado: totalGeneral - totalDescA,
        especial: false,
        facturar: totalDescA,
      };
    } else {
      if (totalConDescuentoC + totalEsp + totalSD < 5000) {
        return {
          total: totalGeneral,
          descuento: tradB,
          descCalculado: totalGeneral - totalDescB,
          especial: false,
          facturar: totalDescB,
        };
      } else {
        if (totalConDescuentoD + totalEsp + totalSD < 10000) {
          return {
            total: totalGeneral,
            descuento: tradC,
            descCalculado: totalGeneral - totalDescC,
            especial: false,
            facturar: totalDescC,
          };
        } else {
          //console.log("Test", totalConDescuentoE, totalEspDesc, totalSD);
          if (totalConDescuentoE + totalEspDesc + totalSD < 20000) {
            return {
              total: totalGeneral,
              descuento: tradD,
              descCalculado: totalGeneral - totalDescD,
              especial: false,
              facturar: totalDescD,
            };
          } else {
            return {
              total: totalGeneral,
              descuento: tradE,
              descCalculado: totalGeneral - totalDescF,
              especial: true,
              facturar: totalDescF,
            };
          }
        }
      }
    }
  }
}

function getEasterDiscounts(totalPascua, discountList) {
  const pasA = getDiscountPercentage(2, "A", discountList);
  const pasB = getDiscountPercentage(2, "B", discountList);
  const pasC = getDiscountPercentage(2, "C", discountList);
  const pasD = getDiscountPercentage(2, "D", discountList);
  const pasE = getDiscountPercentage(2, "E", discountList);
  const pasF = getDiscountPercentage(2, "F", discountList);
  const pasG = getDiscountPercentage(2, "G", discountList);
  const pasH = getDiscountPercentage(2, "H", discountList);
  const totalConDescuentoA = totalPascua * (1 - pasA / 100);
  const totalConDescuentoB = totalPascua * (1 - pasB / 100);
  const totalConDescuentoC = totalPascua * (1 - pasC / 100);
  const totalConDescuentoD = totalPascua * (1 - pasD / 100);
  const totalConDescuentoE = totalPascua * (1 - pasE / 100);
  const totalConDescuentoF = totalPascua * (1 - pasF / 100);
  const totalConDescuentoG = totalPascua * (1 - pasG / 100);
  const totalConDescuentoH = totalPascua * (1 - pasH / 100);
  if (totalConDescuentoA < 1000) {
    return {
      total: totalPascua,
      descuento: 0,
      descCalculado: 0,
      facturar: totalPascua,
    };
  } else {
    if (totalConDescuentoB < 3000) {
      return {
        total: totalPascua,
        descuento: pasA,
        descCalculado: totalPascua - totalConDescuentoA,
        facturar: totalConDescuentoA,
      };
    } else {
      if (totalConDescuentoC < 5000) {
        return {
          total: totalPascua,
          descuento: pasB,
          descCalculado: totalPascua - totalConDescuentoB,
          facturar: totalConDescuentoB,
        };
      } else {
        if (totalConDescuentoD < 10000) {
          return {
            total: totalPascua,
            descuento: pasC,
            descCalculado: totalPascua - totalConDescuentoC,
            facturar: totalConDescuentoC,
          };
        } else {
          if (totalConDescuentoD < 20000) {
            return {
              total: totalPascua,
              descuento: pasD,
              descCalculado: totalPascua - totalConDescuentoD,
              facturar: totalConDescuentoD,
            };
          } else {
            if (totalConDescuentoD < 50000) {
              return {
                total: totalPascua,
                descuento: pasE,
                descCalculado: totalPascua - totalConDescuentoE,
                facturar: totalConDescuentoE,
              };
            } else {
              if (totalConDescuentoD < 100000) {
                return {
                  total: totalPascua,
                  descuento: pasF,
                  descCalculado: totalPascua - totalConDescuentoF,
                  facturar: totalConDescuentoF,
                };
              } else {
                if (totalConDescuentoD < 200000) {
                  return {
                    total: totalPascua,
                    descuento: pasG,
                    descCalculado: totalPascua - totalConDescuentoG,
                    facturar: totalConDescuentoG,
                  };
                } else {
                  return {
                    total: totalPascua,
                    descuento: pasH,
                    descCalculado: totalPascua - totalConDescuentoH,
                    facturar: totalConDescuentoH,
                  };
                }
              }
            }
          }
        }
      }
    }
  }
}

function getNavDiscounts(totalNav, discountList) {
  const crisA = getDiscountPercentage(3, "A", discountList);
  const crisB = getDiscountPercentage(3, "B", discountList);
  const crisC = getDiscountPercentage(3, "C", discountList);
  const crisD = getDiscountPercentage(3, "D", discountList);
  const crisE = getDiscountPercentage(3, "E", discountList);
  const totalConDescuentoA = totalNav * (1 - crisA / 100);
  const totalConDescuentoB = totalNav * (1 - crisB / 100);
  const totalConDescuentoC = totalNav * (1 - crisC / 100);
  const totalConDescuentoD = totalNav * (1 - crisD / 100);
  const totalConDescuentoE = totalNav * (1 - crisE / 100);
  if (totalConDescuentoA < 1000) {
    return {
      total: totalNav,
      descuento: 0,
      descCalculado: 0,
      facturar: totalNav,
    };
  } else {
    if (totalConDescuentoB < 3000) {
      return {
        total: totalNav,
        descuento: crisA,
        descCalculado: totalNav - totalConDescuentoA,
        facturar: totalConDescuentoA,
      };
    } else {
      if (totalConDescuentoC < 5000) {
        return {
          total: totalNav,
          descuento: crisB,
          descCalculado: totalNav - totalConDescuentoB,
          facturar: totalConDescuentoB,
        };
      } else {
        if (totalConDescuentoC < 10000) {
          return {
            total: totalNav,
            descuento: crisC,
            descCalculado: totalNav - totalConDescuentoC,
            facturar: totalConDescuentoC,
          };
        } else {
          if (totalConDescuentoC < 20000) {
            return {
              total: totalNav,
              descuento: crisD,
              descCalculado: totalNav - totalConDescuentoD,
              facturar: totalConDescuentoD,
            };
          } else {
            return {
              total: totalNav,
              descuento: crisE,
              descCalculado: totalNav - totalConDescuentoE,
              facturar: totalConDescuentoE,
            };
          }
        }
      }
    }
  }
}

function getHalloweenDiscounts(totalHall, discountList) {
  const hallA = getDiscountPercentage(4, "A", discountList);
  const hallB = getDiscountPercentage(4, "B", discountList);
  const hallC = getDiscountPercentage(4, "C", discountList);
  const hallD = getDiscountPercentage(4, "D", discountList);
  const hallE = getDiscountPercentage(4, "E", discountList);
  const totalConDescuentoA = totalHall * (1 - hallA / 100);
  const totalConDescuentoB = totalHall * (1 - hallB / 100);
  const totalConDescuentoC = totalHall * (1 - hallC / 100);
  const totalConDescuentoD = totalHall * (1 - hallD / 100);
  const totalConDescuentoE = totalHall * (1 - hallE / 100);
  if (totalConDescuentoA < 1000) {
    return {
      total: totalHall,
      descuento: 0,
      descCalculado: 0,
      facturar: totalHall,
    };
  } else {
    if (totalConDescuentoB < 3000) {
      return {
        total: totalHall,
        descuento: hallA,
        descCalculado: totalHall - totalConDescuentoA,
        facturar: totalConDescuentoA,
      };
    } else {
      if (totalConDescuentoC < 5000) {
        return {
          total: totalHall,
          descuento: hallB,
          descCalculado: totalHall - totalConDescuentoB,
          facturar: totalConDescuentoB,
        };
      } else {
        if (totalConDescuentoD < 10000) {
          return {
            total: totalHall,
            descuento: hallC,
            descCalculado: totalHall - totalConDescuentoC,
            facturar: totalConDescuentoC,
          };
        } else {
          if (totalConDescuentoE < 20000) {
            return {
              total: totalHall,
              descuento: hallD,
              descCalculado: totalHall - totalConDescuentoD,
              facturar: totalConDescuentoD,
            };
          } else {
            return {
              total: totalHall,
              descuento: hallE,
              descCalculado: totalHall - totalConDescuentoE,
              facturar: totalConDescuentoE,
            };
          }
        }
      }
    }
  }
}

function processSeasonalDiscount(selectedProds, discounts) {
  console.log("Procesando descuento estacional", selectedProds, discounts);
  let totalGeneral = 0;
  let totalEsp = 0;
  let totalEspCD = 0;
  let totalSD = 0;
  const seasonProducts = [];
  const sinDescProds = [];
  const especialDescProds = [];
  for (const product of selectedProds) {
    // console.log("Producto", product);
    if (product.tipoProducto == 5) {
      totalSD += parseFloat(product.totalProd);
      sinDescProds.push(product);
    } else if (product.tipoProducto == 6) {
      totalEsp += parseFloat(product.totalProd);
      totalEspCD += product.precioDescuentoFijo * product.cantProducto;
      especialDescProds.push(product);
    } else {
      totalGeneral += parseFloat(product.totalProd);
      seasonProducts.push(product);
    }
  }

  let totArray = discounts.map((ds) => {
    const totalSE =
      parseFloat(totalGeneral) * (1 - ds.descuento / 100) +
      parseFloat(totalEsp) +
      parseFloat(totalSD);
    const totalCE =
      parseFloat(totalGeneral) * (1 - ds.descuento / 100) +
      parseFloat(totalEspCD) +
      parseFloat(totalSD);
    return {
      totalSinDescEsp: parseFloat(totalSE.toFixed(2)),
      totalConDescEsp: parseFloat(totalCE.toFixed(2)),
      categoria: ds.categoria,
      descuento: ds.descuento,
    };
  });

  const obtained = obtainDiscounts(totArray, discounts);
  const descEsp = obtained.conDescEsp ? totalEspCD : totalEsp;
  const totalPedido = parseFloat(
    parseFloat(totalGeneral) + parseFloat(totalSD) + parseFloat(totalEsp)
  );
  console.log(
    `Total general ${totalGeneral} total sin descuento ${totalSD} total especiales ${totalEsp}`
  );
  console.log("TOTAL SUMADO", totalPedido);
  const totalFacturar =
    parseFloat(totalGeneral) * (1 - obtained.discount.descuento / 100) +
    parseFloat(totalSD) +
    parseFloat(descEsp);
  const descCalculado = parseFloat(totalPedido) - parseFloat(totalFacturar);
  return new Promise((resolve) =>
    resolve({
      totalesPedido: {
        totalPedido,
        totalFacturar,
        descCalculado,
        descuento: obtained.discount.descuento,
        isDescEsp: obtained.conDescEsp,
      },
      productArrays: {
        sinDescProds,
        especialDescProds,
        seasonProducts,
      },
    })
  );
}

function obtainDiscounts(totArray, discounts) {
  //console.log("discount array", discounts);
  const ordenado = discounts.sort((a, b) => {
    const categoriaA = a.categoria;
    const categoriaB = b.categoria;
    return categoriaB.localeCompare(categoriaA);
  });

  const catSinDesc = ["0", "A", "B", "C", "D"];

  for (const discount of ordenado) {
    const found = totArray.find((ta) => ta.categoria == discount.categoria);

    if (!catSinDesc.includes(discount.categoria)) {
      if (found.totalConDescEsp >= discount.montoMinimo) {
        return { discount, conDescEsp: true };
      }
    } else {
      if (found.totalSinDescEsp >= discount.montoMinimo) {
        return { discount, conDescEsp: false };
      }
    }
  }
}

function verifySeasonalProduct(selectedProds, discountData) {
  const prodType = discountData[0].tipoProducto;
  for (const product of selectedProds) {
    if (product.tipoProducto == prodType) {
      return true;
    }
  }
  return false;
}

function complexNewDiscountFunction(selectedProducts, discountList) {
  let separatedProducts = {
    tradicionales: [],
    navidad: [],
    pascua: [],
    halloween: [],
    sinDesc: [],
    especiales: [],
  };

  let totalesTipo = {
    tradicionales: 0,
    navidad: 0,
    pascua: 0,
    halloween: 0,
    sinDesc: 0,
    especiales: 0,
    especialesCD: 0,
  };

  for (const product of selectedProducts) {
    if (product.tipoProducto == 1) {
      separatedProducts.tradicionales.push(product);
      totalesTipo.tradicionales += product.totalProd;
    } else if (product.tipoProducto == 2) {
      separatedProducts.pascua.push(product);
      totalesTipo.pascua += product.totalProd;
    } else if (product.tipoProducto == 3) {
      separatedProducts.navidad.push(product);
      totalesTipo.navidad += product.totalProd;
    } else if (product.tipoProducto == 4) {
      separatedProducts.halloween.push(product);
      totalesTipo.halloween += product.totalProd;
    } else if (product.tipoProducto == 5) {
      separatedProducts.sinDesc.push(product);
      totalesTipo.sinDesc += product.totalProd;
    } else {
      separatedProducts.especiales.push(product);
      totalesTipo.especiales += product.totalProd;
      totalesTipo.especialesCD +=
        product.precioDescuentoFijo * product.cantProducto;
    }
  }

  const categorias = [
    { categoria: "0", montoMinimo: 0, montoMaximo: 1000 },
    { categoria: "A", montoMinimo: 1001, montoMaximo: 3000 },
    { categoria: "B", montoMinimo: 3001, montoMaximo: 5000 },
    { categoria: "C", montoMinimo: 5001, montoMaximo: 10000 },
    { categoria: "D", montoMinimo: 10001, montoMaximo: 20000 },
    {
      categoria: "E",
      montoMinimo: 20001,
      montoMaximo: 50000,
    },
    { categoria: "F", montoMinimo: 50001, montoMaximo: 100000 },
    { categoria: "G", montoMinimo: 100001, montoMaximo: 200000 },
    { categoria: "H", montoMinimo: 200001, montoMaximo: 9999999 },
  ];

  let tradDiscounts = [];
  let hallDiscounts = [];
  let pasDiscounts = [];
  let navDiscounts = [];
  for (const cat of categorias) {
    if (!["F", "G", "H"].includes(cat.categoria)) {
      const trad = getDiscountPercentage(1, cat.categoria, discountList);
      const nav = getDiscountPercentage(3, cat.categoria, discountList);
      const hall = getDiscountPercentage(4, cat.categoria, discountList);
      const pas = getDiscountPercentage(2, cat.categoria, discountList);
      tradDiscounts.push({
        categoria: cat.categoria,
        descuento: trad,
        descontado: totalesTipo.tradicionales * (1 - trad / 100),
      });
      hallDiscounts.push({
        categoria: cat.categoria,
        descuento: hall,
        descontado: totalesTipo.halloween * (1 - hall / 100),
      });
      navDiscounts.push({
        categoria: cat.categoria,
        descuento: nav,
        descontado: totalesTipo.navidad * (1 - nav / 100),
      });
      pasDiscounts.push({
        categoria: cat.categoria,
        descuento: pas,
        descontado: totalesTipo.pascua * (1 - pas / 100),
      });
    } else {
      const pas = getDiscountPercentage(2, cat.categoria, discountList);
      pasDiscounts.push({
        categoria: cat.categoria,
        descuento: pas,
        descontado: totalesTipo.pascua * (1 - pas / 100),
      });
      const trad = getDiscountPercentage(1, "E", discountList);
      const nav = getDiscountPercentage(3, "E", discountList);
      const hall = getDiscountPercentage(4, "E", discountList);
      tradDiscounts.push({
        categoria: cat.categoria,
        descuento: trad,
        descontado: totalesTipo.tradicionales * (1 - trad / 100),
      });
      hallDiscounts.push({
        categoria: cat.categoria,
        descuento: hall,
        descontado: totalesTipo.halloween * (1 - hall / 100),
      });
      navDiscounts.push({
        categoria: cat.categoria,
        descuento: nav,
        descontado: totalesTipo.navidad * (1 - nav / 100),
      });
    }
  }
  console.log("Descuentos trad", tradDiscounts);
  console.log("Descuentos pas", pasDiscounts);
  console.log("Descuentos hall", hallDiscounts);
  console.log("Descuentos nav", navDiscounts);

  let index = categorias.length - 1;

  while (index >= 0) {
    //console.log("Corriendo en index", index);
    const foundTrad = tradDiscounts.find(
      (td) => td.categoria == categorias[index].categoria
    );
    const foundPas = pasDiscounts.find(
      (td) => td.categoria == categorias[index].categoria
    );
    const foundNav = navDiscounts.find(
      (td) => td.categoria == categorias[index].categoria
    );
    const foundHall = hallDiscounts.find(
      (td) => td.categoria == categorias[index].categoria
    );

    let totalSDE =
      foundTrad?.descontado +
      foundPas?.descontado +
      foundNav?.descontado +
      foundHall?.descontado +
      totalesTipo.especiales +
      totalesTipo.sinDesc;
    let totalCDE =
      foundTrad?.descontado +
      foundPas?.descontado +
      foundNav?.descontado +
      foundHall?.descontado +
      totalesTipo.especialesCD +
      totalesTipo.sinDesc;

    let objReturn = {
      halloween: {
        total: Number(totalesTipo.halloween).toFixed(2),
        descuento: foundHall.descuento,
        descCalculado: Number(
          Number(totalesTipo.halloween) - Number(foundHall.descontado)
        ).toFixed(2),
        facturar: Number(foundHall.descontado).toFixed(2),
      },
      navidad: {
        total: Number(totalesTipo.navidad).toFixed(2),
        descuento: foundNav.descuento,
        descCalculado: Number(
          Number(totalesTipo.navidad) - Number(foundNav.descontado)
        ).toFixed(2),
        facturar: Number(foundNav.descontado).toFixed(2),
      },
      pascua: {
        total: Number(totalesTipo.pascua).toFixed(2),
        descuento: foundPas.descuento,
        descCalculado: Number(
          Number(totalesTipo.pascua) - Number(foundPas.descontado)
        ).toFixed(2),
        facturar: Number(foundPas.descontado).toFixed(2),
      },
      tradicionales: {
        total: Number(
          Number(totalesTipo.tradicionales) +
            Number(totalesTipo.sinDesc) +
            Number(totalesTipo.especiales)
        ),
        descuento: foundNav.descuento,
        descCalculado: 0,
        facturar: 0,
        especial: false,
      },
    };
    if (index > 4) {
      objReturn.tradicionales.descuento = foundTrad.descuento;
      objReturn.tradicionales.descCalculado =
        Number(
          Number(totalesTipo.tradicionales) +
            Number(totalesTipo.sinDesc) +
            Number(totalesTipo.especiales)
        ) -
        (Number(foundTrad.descontado) +
          totalesTipo.sinDesc +
          totalesTipo.especialesCD);
      objReturn.tradicionales.facturar =
        Number(foundTrad.descontado) +
        totalesTipo.sinDesc +
        totalesTipo.especialesCD;
      objReturn.tradicionales.especial =
        totalesTipo.especiales != 0 ? true : false;
      if (
        totalCDE >= categorias[index].montoMinimo &&
        totalCDE <= categorias[index].montoMaximo
      ) {
        console.log("Objeto a retornar", objReturn);
        console.log("Categoria escogida", categorias[index]);
        return objReturn;
        break;
      } else {
        if (index != categorias.length - 1) {
          if (
            totalCDE >= categorias[index + 1].montoMinimo &&
            totalCDE <= categorias[index + 1].montoMaximo
          ) {
            console.log("Objeto a retornar", objReturn);
            console.log("Categoria escogida", categorias[index]);
            return objReturn;
            break;
          }
        }
      }
    } else {
      objReturn.tradicionales.descuento = foundTrad.descuento;
      objReturn.tradicionales.descCalculado =
        Number(totalesTipo.tradicionales) - Number(foundTrad.descontado);
      objReturn.tradicionales.facturar =
        Number(foundTrad.descontado) +
        totalesTipo.sinDesc +
        totalesTipo.especiales;

      if (
        totalSDE >= categorias[index].montoMinimo &&
        totalSDE <= categorias[index].montoMaximo
      ) {
        console.log("Objeto a retornar", objReturn);
        console.log("Categoria escogida", categorias[index]);
        return objReturn;
        break;
      } else {
        if (
          totalSDE >= categorias[index + 1].montoMinimo &&
          totalSDE <= categorias[index + 1].montoMaximo
        ) {
          console.log("Objeto a retornar", objReturn);
          console.log("Categoria escogida", categorias[index]);
          return objReturn;
          break;
        }
      }
    }
    index--;
  }
  /*for (const categoria of categorias) {
    const foundTrad = tradDiscounts.find(
      (td) => td.categoria == categoria.categoria
    );
    const foundPas = pasDiscounts.find(
      (td) => td.categoria == categoria.categoria
    );
    const foundNav = navDiscounts.find(
      (td) => td.categoria == categoria.categoria
    );
    const foundHall = hallDiscounts.find(
      (td) => td.categoria == categoria.categoria
    );

    let totalSDE =
      foundTrad?.descontado +
      foundPas?.descontado +
      foundNav?.descontado +
      foundHall?.descontado +
      totalesTipo.especiales +
      totalesTipo.sinDesc;
    let totalCDE =
      foundTrad?.descontado +
      foundPas?.descontado +
      foundNav?.descontado +
      foundHall?.descontado +
      totalesTipo.especialesCD +
      totalesTipo.sinDesc;

    if (foundPas.descontado == 0) {
      if (index < 4) {
        if (
          totalSDE >= categoria.montoMinimo &&
          totalSDE <= categoria.montoMaximo
        ) {
          console.log("SE DEBE APLICAR ESTA CATEGORIA", categoria);
          console.log("Total calculado", totalCDE);
        }
      } else {
        if (totalCDE >= categoria.montoMinimo) {
          console.log("SE DEBE APLICAR ESTA CATEGORIA", categoria);
          console.log("Total calculado", totalSDE);
        }
      }
    } else {
      if (index < 4) {
        if (
          totalSDE >= categoria.montoMinimo &&
          totalSDE <= categoria.montoMaximo
        ) {
          console.log("SE DEBE APLICAR ESTA CATEGORIA", categoria);
          console.log("Total calculado", totalCDE);
        }
      } else {
        if (
          totalCDE >= categoria.montoMinimo &&
          totalCDE <= categoria.montoMaximo
        ) {
          console.log("SE DEBE APLICAR ESTA CATEGORIA", categoria);
          console.log("Total calculado", totalSDE);
        }
      }
    }
    index++;
  }*/

  /*console.log("Rangos", categorias);

  console.log("Totales trad", tradDiscounts);
  console.log("Totales pas", pasDiscounts);
  console.log("Totales hall", hallDiscounts);
  console.log("Totales nav", navDiscounts);*/
}

export {
  traditionalDiscounts,
  easterDiscounts,
  christmassDiscounts,
  halloweenDiscounts,
  manualAutomaticDiscount,
  addProductDiscounts,
  addProductDiscSimple,
  saleDiscount,
  verifyAutomaticDiscount,
  discountByAmount,
  complexDiscountFunction,
  processSeasonalDiscount,
  verifySeasonalProduct,
  complexNewDiscountFunction,
  newDiscountByAmount,
};
