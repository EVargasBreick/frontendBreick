export const dateString = () => {
  var d = new Date(),
    dformat =
      [
        d.getDate() < 10 ? `0${d.getDate()}` : d.getDate(),
        d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1,
        d.getFullYear(),
      ].join("/") +
      " " +
      [
        d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
        d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
        d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds(),
      ].join(":");

  return dformat;
};

export const isLeapYear = (year) => {
  // Leap years are divisible by 4
  if (year % 4 !== 0) {
    return false;
  }
  // If it's divisible by 4 but not divisible by 100, it's a leap year
  if (year % 100 !== 0) {
    return true;
  }
  // If it's divisible by 100 but also divisible by 400, it's a leap year
  if (year % 400 === 0) {
    return true;
  }
  // If it's divisible by 100 but not divisible by 400, it's not a leap year
  return false;
};

export const monthInfo = (month, year) => {
  const monthList = [
    {
      month: "Enero",
      value: "01",
      days: 31,
    },
    {
      month: "Febrero",
      value: "02",
      days: isLeapYear(year) ? 29 : 28,
    },
    {
      month: "Marzo",
      value: "03",
      days: 31,
    },
    {
      month: "Abril",
      value: "04",
      days: 30,
    },
    {
      month: "Mayo",
      value: "05",
      days: 31,
    },
    {
      month: "Junio",
      value: "06",
      days: 30,
    },
    {
      month: "Julio",
      value: "07",
      days: 31,
    },
    {
      month: "Agosto",
      value: "08",
      days: 31,
    },
    {
      month: "Septiembre",
      value: "09",
      days: 30,
    },
    {
      month: "Octubre",
      value: "10",
      days: 31,
    },
    {
      month: "Noviembre",
      value: "11",
      days: 30,
    },
    {
      month: "Diciembre",
      value: "12",
      days: 31,
    },
  ];
  const found = monthList.find((ml) => ml.value == month);
  return found;
};

export const formatDate = (date) => {
  const originalDate = new Date(date);
  const day =
    originalDate.getDate() < 10
      ? `0${originalDate.getDate()}`
      : originalDate.getDate();
  const month =
    originalDate.getMonth() + 1 < 10
      ? `0${originalDate.getMonth() + 1}`
      : originalDate.getMonth() + 1; // Months are 0-indexed, so add 1 to get the correct month.
  const year = originalDate.getFullYear();
  const fullDate = day + "/" + month + "/" + year;
  return {
    month: month,
    day: day,
    year: year,
    fullDate: fullDate,
  };
};

export const formatPickedDate = (date) => {
  const spplited = date.split("-");
  return `${spplited[2]}/${spplited[1]}/${spplited[0]}`;
};

export const calculateMonthDifference = (start_date, end_date) => {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  if (startDate && endDate) {
    const diffInMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      endDate.getMonth() -
      startDate.getMonth();
    return diffInMonths;
  }
};
