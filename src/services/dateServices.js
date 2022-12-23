export const dateString = () => {
  var d = new Date(),
    dformat =
      [d.getDate(), d.getMonth() + 1, d.getFullYear()].join("/") +
      " " +
      [
        d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
        d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
        d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds(),
      ].join(":");

  return dformat;
};
