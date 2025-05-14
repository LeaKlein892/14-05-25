const dateAsYMD = () =>
  new Date().toISOString().split("T")[0].split("-").join("");

const dateAsExactTime = () =>
  new Date().toISOString().split(".")[0].split(":").join("-");

const dateAsDMY = () => {
  const [year, month, day] = new Date().toISOString().split("T")[0].split("-");
  return day + "-" + month + "-" + year.substr(2);
};

const dateAsString = (date: string) =>
  new Date(date).toDateString().split(" ").slice(1).join(" ");

const dateAsHMS = () =>
  new Date().toLocaleTimeString("it-IT").split(":").join("");

const compareDate = (dateA: Date, dateB: Date) => {
  if (dateA && dateB) return dateB.getTime() - dateA.getTime();
  return 0;
};

const stringAsDMY = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getDateFromNow = (minute: number) => {
  const now = new Date();
  const expirationTime = new Date(now.getTime() + minute * 60000).getTime();
  return expirationTime;
};

const compareDatesDescending = (dateStr1: string, dateStr2: string): number => {
  const date1 = stringAsDMY(padDMY(dateStr1));
  const date2 = stringAsDMY(padDMY(dateStr2));
  return date2.getTime() - date1.getTime();
};

const convertDateFormat = (dateString: string, dmyFormat = false) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const padYear = (year: string) => (year.length === 2 ? "20" + year : year);

const padDMY = (date: string): string => {
  const [day, month, year] = date.split("-");
  const paddedYear = padYear(year);
  return `${day}-${month}-${paddedYear}`;
};

const convertToValidDateFormat = (dateString: string): string | null => {
  const dateParts = dateString.split("-");
  if (dateParts.length === 3) {
    const year = padYear(dateParts[2]);
    const formattedDate = [dateParts[0], dateParts[1], year].join("-");
    const convertedDate = convertDateFormat(formattedDate);
    return isValidDate(convertedDate) ? convertedDate : null;
  }
  return null;
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Parse dates like "Wed 15/11/23" into ISO format "2023-11-15"
const parseDayMonthShortYear = (dateStr: string): string => {
  const parts = dateStr.split(" ")[1].split("/");
  return `20${parts[2]}-${parts[1]}-${parts[0]}`;
};

export {
  dateAsYMD,
  dateAsExactTime,
  dateAsHMS,
  dateAsDMY,
  dateAsString,
  compareDate,
  stringAsDMY,
  getDateFromNow,
  compareDatesDescending,
  convertDateFormat,
  convertToValidDateFormat,
  isValidDate,
  padDMY,
  parseDayMonthShortYear,
};
