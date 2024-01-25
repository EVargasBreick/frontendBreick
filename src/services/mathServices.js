export function roundToTwoDecimalPlaces(number) {
  return Math.round(number * 100) / 100;
}

export function rountWithMathFloor(number) {
  return +(Math.round(number * 100) / 100);
}

export function roundWithFixed(number) {
  return Number(number.toFixed(3)).toFixed(2);
}
