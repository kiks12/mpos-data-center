export const getDateToday = () => {
  const date = new Date();
  return `${date.getTime()}-${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDay()}`;
};
