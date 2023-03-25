function getDiscountPercentage(tipoProd, rango, discountList) {
  console.log("Discount list", discountList);
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
    return accumulator + object.totalProd;
  }, 0);
  const totalSinDesc = sinDesc.reduce((accumulator, object) => {
    return accumulator + object.totalProd;
  }, 0);
  const totalEspecial = especiales.reduce((accumulator, object) => {
    return accumulator + object.totalProd;
  }, 0);
  const totalEspecialDesc = especiales.reduce((accumulator, object) => {
    return accumulator + object.totalDescFijo;
  }, 0);
  const tradA = getDiscountPercentage(1, "A", discountList);
  const tradB = getDiscountPercentage(1, "B", discountList);
  const tradC = getDiscountPercentage(1, "C", discountList);
  const tradD = getDiscountPercentage(1, "D", discountList);
  const tradE = getDiscountPercentage(1, "E", discountList);
  if (
    totalTradicional * parseFloat(1 - tradA / 100).toFixed(2) +
      totalSinDesc +
      totalEspecial <
    1000
  ) {
    return {
      total: totalTradicional + totalEspecial + totalSinDesc,
      descuento: 0,
      descCalculado: 0,
      especial: false,
      facturar: totalTradicional + totalEspecial + totalSinDesc,
    };
  } else {
    if (
      totalTradicional * parseFloat(1 - tradB / 100).toFixed(2) +
        totalSinDesc +
        totalEspecial <
      3000
    ) {
      const totalDescontado =
        totalTradicional * parseFloat(1 - tradA / 100).toFixed(2) +
        totalSinDesc +
        totalEspecial;
      return {
        total: totalTradicional + totalEspecial + totalSinDesc,
        descuento: tradA,
        descCalculado: parseFloat(
          totalTradicional + totalSinDesc + totalEspecial - totalDescontado
        ).toFixed(2),
        facturar: totalDescontado.toFixed(2),
        especial: false,
      };
    } else {
      if (
        totalTradicional * parseFloat(1 - tradC / 100).toFixed(2) +
          totalSinDesc +
          totalEspecial <
        5000
      ) {
        const totalDescontado =
          totalTradicional * parseFloat(1 - tradB / 100).toFixed(2) +
          totalSinDesc +
          totalEspecial;

        return {
          total: totalTradicional + totalEspecial + totalSinDesc,
          descuento: tradB,
          descCalculado: parseFloat(
            totalTradicional + totalSinDesc + totalEspecial - totalDescontado
          ).toFixed(2),
          facturar: totalDescontado.toFixed(2),
          especial: false,
        };
      } else {
        if (
          totalTradicional * parseFloat(1 - tradD / 100).toFixed(2) +
            totalSinDesc +
            totalEspecial <
          10000
        ) {
          const totalDescontado =
            totalTradicional * parseFloat(1 - tradC / 100).toFixed(2) +
            totalSinDesc +
            totalEspecial;

          return {
            total: totalTradicional + totalEspecial + totalSinDesc,
            descuento: tradC,
            descCalculado: parseFloat(
              totalTradicional + totalSinDesc + totalEspecial - totalDescontado
            ).toFixed(2),
            facturar: totalDescontado.toFixed(2),
            especial: false,
          };
        } else {
          if (
            totalTradicional * parseFloat(1 - tradE / 100).toFixed(2) +
              totalEspecialDesc +
              totalSinDesc <
            20000
          ) {
            const totalDescontado =
              totalTradicional * parseFloat(1 - tradD / 100).toFixed(2) +
              totalSinDesc +
              totalEspecial;
            console.log(
              "A ver que onda",
              totalTradicional * parseFloat(1 - tradD / 100).toFixed(2)
            );
            console.log("Total descontado", totalSinDesc + totalEspecial);
            return {
              total: totalTradicional + totalEspecial + totalSinDesc,
              descuento: tradD,
              descCalculado: parseFloat(
                totalTradicional +
                  totalSinDesc +
                  totalEspecial -
                  totalDescontado
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
              especial: false,
            };
          } else {
            const totalDescontado =
              totalTradicional * parseFloat(1 - tradE / 100).toFixed(2) +
              totalSinDesc +
              totalEspecialDesc;
            console.log(
              "Total descontado",
              totalTradicional * parseFloat(1 - tradE / 100).toFixed(2) +
                totalEspecialDesc +
                totalSinDesc
            );
            return {
              total: totalTradicional + totalEspecial + totalSinDesc,
              descuento: tradE,
              descCalculado: parseFloat(
                totalTradicional +
                  totalEspecialDesc +
                  totalSinDesc -
                  totalDescontado
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
    return accumulator + object.totalProd;
  }, 0);
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
        descCalculado: parseFloat(totalPascua - totalDescontado).toFixed(2),
        facturar: totalDescontado.toFixed(2),
      };
    } else {
      if (totalPascua * parseFloat(1 - pasC / 100).toFixed(2) < 5000) {
        const totalDescontado =
          totalPascua * parseFloat(1 - pasB / 100).toFixed(2);

        return {
          total: totalPascua,
          descuento: pasB,
          descCalculado: parseFloat(totalPascua - totalDescontado).toFixed(2),
          facturar: totalDescontado.toFixed(2),
        };
      } else {
        if (totalPascua * parseFloat(1 - pasD / 100).toFixed(2) < 10000) {
          const totalDescontado =
            totalPascua * parseFloat(1 - pasC / 100).toFixed(2);

          return {
            total: totalPascua,
            descuento: pasC,
            descCalculado: parseFloat(totalPascua - totalDescontado).toFixed(2),
            facturar: totalDescontado.toFixed(2),
          };
        } else {
          if (totalPascua * parseFloat(1 - pasE / 100).toFixed(2) < 20000) {
            const totalDescontado =
              totalPascua * parseFloat(1 - pasD / 100).toFixed(2);

            return {
              total: totalPascua,
              descuento: pasD,
              descCalculado: parseFloat(totalPascua - totalDescontado).toFixed(
                2
              ),
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
                    totalPascua - totalDescontado
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
                    total: totalPascua,
                    descuento: pasH,
                    descCalculado: parseFloat(
                      totalPascua - totalDescontado
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
    return accumulator + object.totalProd;
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
        descCalculado: parseFloat(totalNavidad - totalDescontado).toFixed(2),
        facturar: totalDescontado.toFixed(2),
      };
    } else {
      if (totalNavidad * parseFloat(1 - crisC / 100).toFixed(2) < 5000) {
        const totalDescontado =
          totalNavidad * parseFloat(1 - crisB / 100).toFixed(2);

        return {
          total: totalNavidad,
          descuento: crisB,
          descCalculado: parseFloat(totalNavidad - totalDescontado).toFixed(2),
          facturar: totalDescontado.toFixed(2),
        };
      } else {
        if (totalNavidad * parseFloat(1 - crisD / 100).toFixed(2) < 10000) {
          const totalDescontado =
            totalNavidad * parseFloat(1 - crisC / 100).toFixed(2);

          return {
            total: totalNavidad,
            descuento: crisC,
            descCalculado: parseFloat(totalNavidad - totalDescontado).toFixed(
              2
            ),
            facturar: totalDescontado.toFixed(2),
          };
        } else {
          if (totalNavidad * parseFloat(1 - crisE / 100).toFixed(2) < 20000) {
            const totalDescontado =
              totalNavidad * parseFloat(1 - crisD / 100).toFixed(2);

            return {
              total: totalNavidad,
              descuento: crisD,
              descCalculado: parseFloat(totalNavidad - totalDescontado).toFixed(
                2
              ),
              facturar: totalDescontado.toFixed(2),
            };
          } else {
            const totalDescontado =
              totalNavidad * parseFloat(1 - crisE / 100).toFixed(2);

            return {
              total: totalNavidad,
              descuento: crisE,
              descCalculado: parseFloat(totalNavidad - totalDescontado).toFixed(
                2
              ),
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
    return accumulator + object.totalProd;
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
        descCalculado: parseFloat(totalHalloween - totalDescontado).toFixed(2),
        facturar: totalDescontado.toFixed(2),
      };
    } else {
      if (totalHalloween * parseFloat(1 - hallC / 100).toFixed(2) < 5000) {
        const totalDescontado =
          totalHalloween * parseFloat(1 - hallB / 100).toFixed(2);

        return {
          total: totalHalloween,
          descuento: hallB,
          descCalculado: parseFloat(totalHalloween - totalDescontado).toFixed(
            2
          ),
          facturar: totalDescontado.toFixed(2),
        };
      } else {
        if (totalHalloween * parseFloat(1 - hallD / 100).toFixed(2) < 10000) {
          const totalDescontado =
            totalHalloween * parseFloat(1 - hallC / 100).toFixed(2);

          return {
            total: totalHalloween,
            descuento: hallC,
            descCalculado: parseFloat(totalHalloween - totalDescontado).toFixed(
              2
            ),
            facturar: totalDescontado.toFixed(2),
          };
        } else {
          if (totalHalloween * parseFloat(1 - hallE / 100).toFixed(2) < 20000) {
            const totalDescontado =
              totalHalloween * parseFloat(1 - hallD / 100).toFixed(2);

            return {
              total: totalHalloween,
              descuento: hallD,
              descCalculado: parseFloat(
                totalHalloween - totalDescontado
              ).toFixed(2),
              facturar: totalDescontado.toFixed(2),
            };
          } else {
            const totalDescontado =
              totalHalloween * parseFloat(1 - hallE / 100).toFixed(2);

            return {
              total: totalHalloween,
              descuento: hallE,
              descCalculado: parseFloat(
                totalHalloween - totalDescontado
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
    return accumulator + object.totalProd;
  }, 0);
  const totalSinDesc = sinDesc.reduce((accumulator, object) => {
    return accumulator + object.totalProd;
  }, 0);
  const totalEspecial = especiales.reduce((accumulator, object) => {
    return accumulator + object.totalProd;
  }, 0);
  const totalEspecialDesc = especiales.reduce((accumulator, object) => {
    return accumulator + object.totalDescFijo;
  }, 0);
  const totalPascua = pascua.reduce((accumulator, object) => {
    return accumulator + object.totalProd;
  }, 0);
  const totalNavidad = navidad.reduce((accumulator, object) => {
    return accumulator + object.totalProd;
  }, 0);
  const totalHalloween = halloween.reduce((accumulator, object) => {
    return accumulator + object.totalProd;
  }, 0);
  const totalDescontado =
    (totalTradicional + totalPascua + totalNavidad + totalHalloween) *
    (1 - descuento / 100);

  if (totalDescontado + totalSinDesc + totalEspecialDesc > 20000) {
    return {
      totalDescontables:
        totalTradicional +
        totalPascua +
        totalNavidad +
        totalHalloween +
        totalSinDesc,
      descuento: descuento,
      descCalculado:
        totalTradicional +
        totalPascua +
        totalNavidad +
        totalHalloween +
        totalSinDesc -
        totalDescontado,
      totalTradicional: totalDescontado + totalSinDesc,
      totalEspecial: totalEspecial,
      descCalculadoEspeciales: totalEspecial - totalEspecialDesc,
      facturar: totalEspecialDesc,
      especial: true,
    };
  } else {
    return {
      totalDescontables:
        totalTradicional +
        totalPascua +
        totalNavidad +
        totalHalloween +
        totalSinDesc,
      descuento: descuento,
      descCalculado:
        totalTradicional +
        totalPascua +
        totalNavidad +
        totalHalloween +
        totalSinDesc -
        totalDescontado,
      totalTradicional: totalDescontado + totalSinDesc,
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
          totalProd:
            sp.totalProd -
            cantidadDeProducto *
              (sp.precioDeFabrica -
                sp.precioDeFabrica * (1 - tradObj.descuento / 100)),
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
          totalProd:
            sp.totalProd -
            cantidadDeProducto *
              (sp.precioDeFabrica -
                sp.precioDeFabrica * (1 - pasObj.descuento / 100)),
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
          totalProd:
            sp.totalProd -
            cantidadDeProducto *
              (sp.precioDeFabrica -
                sp.precioDeFabrica * (1 - navObj.descuento / 100)),
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
          totalProd:
            sp.totalProd -
            cantidadDeProducto *
              (sp.precioDeFabrica -
                sp.precioDeFabrica * (1 - hallObj.descuento / 100)),
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
          totalProd: tradObj.especial
            ? cantidadDeProducto * sp.precioDescuentoFijo
            : sp.totalProd,
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
          totalProd: sp.totalProd - descSimple.descCalculadoEspeciales,
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: descSimple.especial
            ? (sp.precioDeFabrica - sp.precioDescuentoFijo) * cantidadDeProducto
            : 0,
          unidadDeMedida: sp.unidadDeMedida,
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
          totalProd:
            sp.totalProd -
            cantidadDeProducto *
              (sp.precioDeFabrica -
                sp.precioDeFabrica * (1 - descSimple.descuento / 100)),
          totalDescFijo: sp.totalDescFijo,
          tipoProducto: sp.tipoProducto,
          descuentoProd: (
            (sp.precioDeFabrica -
              sp.precioDeFabrica * (1 - descSimple.descuento / 100)) *
            cantidadDeProducto
          ).toFixed(2),
          unidadDeMedida: sp.unidadDeMedida,
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
        return accumulator + object.total;
      }, 0);
      const totTradicional = tradicionales.reduce((accumulator, object) => {
        return accumulator + object.total;
      }, 0);

      if (totTradicional * 0.93 + totEspeciales > 1000) {
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
          total:
            (sp.precioDeFabrica -
              (sp.precioDeFabrica -
                sp.precioDeFabrica * (1 - descuento / 100))) *
            sp.cantProducto,
          tipoProducto: sp.tipoProducto,
          unidadDeMedida: sp.unidadDeMedida,
        };
        auxProducts.push(productObj);
      }
    });
    resolve(auxProducts);
  });
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
};
